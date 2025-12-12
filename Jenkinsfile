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
                                    ./mvnw sonar:sonar \
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
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // stage('Build & Push Docker Images') {
        //     parallel {
        //         stage('API Image') {
        //             steps {
        //                 withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        //                     sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
        //                     sh """
        //                         docker build -t ${DOCKER_REGISTRY}/api:${IMAGE_TAG} ./api
        //                         docker push ${DOCKER_REGISTRY}/api:${IMAGE_TAG}
        //                     """
        //                 }
        //             }
        //         }
        //         stage('Frontend Image') {
        //             steps {
        //                 withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        //                     sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
        //                     sh """
        //                         docker build -t ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG} ./front
        //                         docker push ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG}
        //                     """
        //                 }
        //             }
        //         }
        //     }
        // }

                stage('Build Docker Images') {
            steps {
                script {
                    // Build API image
                    sh """
                        docker build -t ${DOCKER_REGISTRY}/api:${IMAGE_TAG} -t ${DOCKER_REGISTRY}/api:latest ./api
                    """
                    
                    // Build Frontend image
                    sh """
                        docker build -t ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG} -t ${DOCKER_REGISTRY}/frontend:latest ./front
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
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            echo "SonarQube Reports:"
            echo "API: http://localhost:9000/dashboard?id=admin-dashboard-api"
            echo "Frontend: http://localhost:9000/dashboard?id=admin-dash-frontend"
            echo "Docker Images: ${DOCKER_REGISTRY}/api:${IMAGE_TAG}, ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG}"
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            sh 'docker logout ${DOCKER_REGISTRY} || true'
            cleanWs()
        }
    }
}