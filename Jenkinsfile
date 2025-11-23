pipeline {
    agent any
    stages {
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
                            sh './mvnw test'
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
        stage('Prepare for Deployment') {
            steps {
                sh 'docker-compose build'
            }
        }
    }
    post {
        always {
            sh 'docker-compose down || true'
        }
        success {
            echo 'CI successful. Ready for deployment.'
        }
    }
}