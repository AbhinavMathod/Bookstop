# ami
AMI Repository


## Technologies Used
1. Packer
2. CircleCi
3. AWS
4. AWS-cli
5. Packer
6. Packer-cli

# Steps of Execution
1. Run ./packer validate -var-file=./variables.json ubuntu-ami.json
2. ./packer build -var-file=./variables.json ubuntu-ami.json

