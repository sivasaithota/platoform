pipeline {
    agent {
        docker {
            image 'node:12.13.0'
            args '-v /var/run/docker.sock:/var/run/docker.sock -v /usr/bin/docker:/usr/bin/docker'
        }
    }
    environment {
      slack_channel ='#enframe3_bot'
    }

    options {
      buildDiscarder(logRotator(numToKeepStr: '5'))
      ansiColor('xterm')
    }    

    stages {
        stage('Checkout'){
            steps {
                checkout scm
            }
        }

        stage('Test'){
            steps {
                echo 'coming soon...'
                sh 'node -v'
            }
        }

        stage('npmrc generate'){
            steps {
                 withCredentials([string(credentialsId: 'github_packages_token', variable: 'NPM_TOKEN')]) {
                     sh "echo //npm.pkg.github.com/:_authToken=${env.NPM_TOKEN} >> .npmrc"
                }
            }
        }

        stage('Build'){
            steps {
                echo 'Building docker image'
                // url left empty intentionally since docker hub is the default
                withDockerRegistry([ credentialsId: "DockerHubLogin", url: "" ]) {
                    sh 'docker build -t opexanalytics/enframe:'+env.BRANCH_NAME+' .'
                }                
            }
        }

        stage('Publish'){
            steps {
                echo 'Push to docker registries -- coming soon...'
                withDockerRegistry([ credentialsId: "DockerHubLogin", url: "" ]) {
                    sh 'docker push opexanalytics/enframe:'+env.BRANCH_NAME
                }                
            }
        }

        stage('Docker Vulnerability Scan') {
            agent {
                docker {
                    image 'opexanalytics/trivy:latest'
                    registryUrl ''
                    registryCredentialsId 'DockerHubLogin'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                script {
                    MY_WORKSPACE = sh (script: 'pwd', returnStdout: true).trim()
                }
                // sh 'trivy image --format template --template "@/root/junit.tpl" -o report.xml  opexanalytics/analytics-center:prod'
                // junit 'report.xml'
                sh 'trivy image opexanalytics/enframe:'+env.BRANCH_NAME
            }
        }

    }
    post {
        success {
            echo 'Build successful. Slack notification sent to channel ' + slack_channel
            slackSend channel: slack_channel,
                        color: 'good',
                        message: "<${env.BUILD_URL} | The pipeline ${currentBuild.fullDisplayName} completed successfully >"
        }
        unstable {
            echo 'I am unstable :/'
        }
        failure {
            echo 'Build failed. Slack notification sent to channel ' + slack_channel
            slackSend channel: slack_channel,
                        color: 'bad',
                        message: "<${env.BUILD_URL} | The pipeline ${currentBuild.fullDisplayName} has failed >"
        }
    }    
}