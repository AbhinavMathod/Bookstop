# BOOKSTOP 
An e-commerce application to purchase books developed using Postgres,ExpressJS,Angular and NodeJS and deployed on AWS.

## Repository Guide 

`Client` : Angular code package for the user interface
`Server` : The server side nodeJS code for the backend 
`Packer` : Packer template for AMI creation and CircleCI template for automation
`Terraform` : Terraform Template for AWS imfrastructure as a code setup
`Lambda` : Lambda function for sending out password request emails using SES and triggered using SNS

## Technology Stack 
1. `Angular`
2. `NodeJS`
3. `ExpressJS`
4. `Postgres`
5. `AWS`

## Features 
1. User Interface using `Angular`
2. Backend Server using `NodeJS` and `ExpressJS`
3. Backend Database using `Postgres` and integrated with backend server using `Sequelize ORM`
4. Continuous Integration using `CircleCI`
5. Continuous Deployment using `AWS CodeDeploy`
6. Logging using `AWS Cloudwatch` and `StatsD`
7. AWS infra set up using Infrastructure as a code Principles using `Terraform`
8. AMI Template creation and updation automated by integrating `Packer` and `CircleCI`
9. Function as a code implemented using `Javascript` on `AWS Lambda`
10. Implemented `AWS SNS` in order to trigger the `lambda` function
11. Integrated `AWS Simple Email Service` to send Emails to subscribed users


### All the folders work best as separate repositories. 

