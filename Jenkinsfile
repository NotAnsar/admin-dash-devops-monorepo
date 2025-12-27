pipeline {
    agent any
    
    tools {
       nodejs 'NodeJS22' 
       dockerTool 'docker'
    }
    
    environment {
        SONAR_SCANNER_HOME = tool 'SonarQubeScanner'
        DOCKER_REGISTRY = 'docker.io/notansar'  
        IMAGE_TAG = "${BUILD_NUMBER}"
        EMAIL_RECIPIENTS = 'karrouach.ansar@gmail.com'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/NotAnsar/admin-dash-devops-monorepo'
            }
        }
        
        stage('Setup Environment') {
            steps {
                sh 'mkdir -p api front'
                sh 'chmod -R 755 api front'
                
                withCredentials([
                    file(credentialsId: 'api_env_file', variable: 'API_ENV_FILE'),
                    file(credentialsId: 'front_env_file', variable: 'FRONT_ENV_FILE')
                ]) {
                    sh 'cp $API_ENV_FILE api/.env'
                    sh 'cp $FRONT_ENV_FILE front/.env'
                }
            }
        }
        
        stage('Build') {
            parallel {
                stage('Build API') {
                    steps {
                        dir('api') {
                            sh './mvnw clean package -DskipTests'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('front') {
                            sh 'npm install && npm run build'
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Test API') {
                    steps {
                        dir('api') {
                            sh './mvnw clean package -DskipTests'  
                        }
                    }
                }
                stage('Test Frontend') {
                    steps {
                        dir('front') {
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            parallel {
                stage('Analyze API') {
                    steps {
                        dir('api') {
                            withSonarQubeEnv('SonarQube') {
                                sh '''
                                    ./mvnw org.sonarsource.scanner.maven:sonar-maven-plugin:sonar \
                                      -Dsonar.projectKey=admin-dashboard-api \
                                      -Dsonar.projectName="Admin Dashboard API"
                                '''
                            }
                        }
                    }
                }
                stage('Analyze Frontend') {
                    steps {
                        dir('front') {
                            withSonarQubeEnv('SonarQube') {
                                sh '''
                                    ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                                      -Dsonar.projectKey=admin-dash-frontend \
                                      -Dsonar.projectName="Admin Dashboard Frontend" \
                                      -Dsonar.sources=app,components,lib,actions,api \
                                      -Dsonar.exclusions=**/node_modules/**,**/*.test.*,**/*.spec.*,.next/**,**/__tests__/**
                                '''
                            }
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build API image
                    sh """
                        docker build --no-cache -t ${DOCKER_REGISTRY}/api:${IMAGE_TAG} -t ${DOCKER_REGISTRY}/api:latest ./api
                    """
                    
                    // Build Frontend image
                    sh """
                        docker build --no-cache -t ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG} -t ${DOCKER_REGISTRY}/frontend:latest ./front
                    """
                }
            }
        }

        stage('Push API Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                    sh """
                        docker push ${DOCKER_REGISTRY}/api:${IMAGE_TAG}
                        docker push ${DOCKER_REGISTRY}/api:latest
                    """
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                    sh """
                        docker push ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG}
                        docker push ${DOCKER_REGISTRY}/frontend:latest
                    """
                }
            }
        }

        stage('Deploy API to Cloud Run') {
            steps {
                script {
                    echo "Deploying API to Cloud Run..."
                    sh '''
                        gcloud config set project orava-monorepo
                        
                        gcloud run deploy admin-api \
                          --image=${DOCKER_REGISTRY}/api:${IMAGE_TAG} \
                          --region=us-central1 \
                          --platform=managed \
                          --allow-unauthenticated \
                          --max-instances=3 \
                          --memory=2Gi \
                          --cpu=1 \
                          --timeout=300 \
                          --set-secrets=DATABASE_URL=DATABASE_URL:latest,DB_USERNAME=DB_USERNAME:latest,DB_PASSWORD=DB_PASSWORD:latest,JWT_SECRET=JWT_SECRET:latest,MAIL_HOST=MAIL_HOST:latest,MAIL_PORT=MAIL_PORT:latest,MAIL_USERNAME=MAIL_USERNAME:latest,MAIL_PASSWORD=MAIL_PASSWORD:latest,AWS_ACCESS_KEY_ID=AWS_ACCESS_KEY_ID:latest,AWS_SECRET_KEY=AWS_SECRET_KEY:latest,AWS_REGION=AWS_REGION:latest,AWS_S3_BUCKET=AWS_S3_BUCKET:latest \
                          --update-env-vars=JWT_EXPIRATION=86400000,FRONTEND_URL=https://admin-frontend-487276152686.us-central1.run.app \
                          --quiet
                    '''
                    echo "Waiting 30 seconds before next deployment to avoid rate limiting..."
                    sleep 30
                }
            }
        }

        stage('Deploy Frontend to Cloud Run') {
            steps {
                script {
                    echo "Deploying Frontend to Cloud Run..."
                    sh '''
                        gcloud config set project orava-monorepo
                        
                        gcloud run deploy admin-frontend \
                          --image=${DOCKER_REGISTRY}/frontend:${IMAGE_TAG} \
                          --region=us-central1 \
                          --platform=managed \
                          --allow-unauthenticated \
                          --max-instances=3 \
                          --memory=512Mi \
                          --cpu=1 \
                          --timeout=300 \
                          --quiet
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            echo "Docker Images: ${DOCKER_REGISTRY}/api:${IMAGE_TAG}, ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG}"
            echo "Deployed to Cloud Run:"
            echo "API: https://admin-api-487276152686.us-central1.run.app"
            echo "Frontend: https://admin-frontend-487276152686.us-central1.run.app"
            
            emailext(
                subject: "✅ Build #${BUILD_NUMBER} - SUCCESS",
                body: """
                    <h2>Pipeline Completed Successfully!</h2>
                    <p><strong>Job:</strong> ${JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${BUILD_NUMBER}</p>
                    <p><strong>Build URL:</strong> <a href="${BUILD_URL}">${BUILD_URL}</a></p>
                    
                    <h3>Docker Images:</h3>
                    <ul>
                        <li>API: ${DOCKER_REGISTRY}/api:${IMAGE_TAG}</li>
                        <li>Frontend: ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG}</li>
                    </ul>
                    
                    <h3>Deployed Services:</h3>
                    <ul>
                        <li><a href="https://admin-api-487276152686.us-central1.run.app">API Service</a></li>
                        <li><a href="https://admin-frontend-487276152686.us-central1.run.app">Frontend Service</a></li>
                    </ul>
                    
                    <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                """,
                to: "${EMAIL_RECIPIENTS}",
                mimeType: 'text/html'
            )
        }
        failure {
            echo 'Pipeline failed!'
            
            emailext(
                subject: "❌ Build #${BUILD_NUMBER} - FAILED",
                body: """
                    <h2>Pipeline Failed!</h2>
                    <p><strong>Job:</strong> ${JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${BUILD_NUMBER}</p>
                    <p><strong>Build URL:</strong> <a href="${BUILD_URL}">${BUILD_URL}</a></p>
                    <p><strong>Console Output:</strong> <a href="${BUILD_URL}console">${BUILD_URL}console</a></p>
                    
                    <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                    
                    <p>Please check the console output for details.</p>
                """,
                to: "${EMAIL_RECIPIENTS}",
                mimeType: 'text/html'
            )
        }
        always {
            sh 'docker logout ${DOCKER_REGISTRY} || true'
            cleanWs()
        }
    }
}