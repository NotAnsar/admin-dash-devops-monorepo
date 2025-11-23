pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-username/admin-dash-j2e.git'
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
        success {
            echo 'CI successful. Ready for deployment.'
        }
    }
}