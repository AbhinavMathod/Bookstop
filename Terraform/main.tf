
variable "region" {
    type = string
}

provider "aws" {
    region = var.region
}

//provider "aws.west" {
//    alias = "west"
//    region = "us-west-2"
//}

variable "namevpc" {
    type = string
}

variable "namesubneta" {
    type = string
}

variable "namesubnetb" {
    type = string
}

variable "namesubnetc" {
    type = string
}
variable "namesubnetd" {
    type = string
}
variable "namesubnete" {
    type = string
}

variable "zone1" {
type = string
}

variable "zone2" {
    type = string
}

variable "zone3" {
    type = string
}

variable "zone4" {
    type = string
}
variable "zone5" {
    type = string
}



resource "aws_vpc" "csye6225_a4_vpc" {
    cidr_block = "${element(var.cidr_block,0)}"
    enable_dns_hostnames = true
    enable_dns_support = true
    enable_classiclink_dns_support = true
    assign_generated_ipv6_cidr_block = false

    tags = {
        Name = "${var.namevpc}",
        Tag2 = "new tag"
    }
}

resource "aws_subnet" "csye6225-subnet-a" {
    cidr_block = "${element(var.cidr_block,1)}"
    vpc_id = "${aws_vpc.csye6225_a4_vpc.id}"
    availability_zone = "${var.zone1}"
    map_public_ip_on_launch = true
    tags = {
        Name = "${var.namesubneta}"
    }
}

resource "aws_subnet" "csye6225-subnet-b" {
    cidr_block = "${element(var.cidr_block,2)}"
    vpc_id = "${aws_vpc.csye6225_a4_vpc.id}"
    availability_zone = "${var.zone2}"
    map_public_ip_on_launch = true
    tags = {
        Name = "${var.namesubnetb}"
    }
}

resource "aws_subnet" "csye6225-subnet-c" {
    cidr_block = "${element(var.cidr_block,3)}"
    vpc_id = "${aws_vpc.csye6225_a4_vpc.id}"
    availability_zone = "${var.zone3}"
    map_public_ip_on_launch = true
    tags = {
        Name = "${var.namesubnetc}"
    }
}

resource "aws_subnet" "csye6225-subnet-d" {
    cidr_block = "${element(var.cidr_block,4)}"
    vpc_id = "${aws_vpc.csye6225_a4_vpc.id}"
    availability_zone = "${var.zone4}"
    map_public_ip_on_launch = true
    tags = {
        Name = "${var.namesubnetd}"
    }
}



resource "aws_internet_gateway" "csye6225-igw" {
    vpc_id = "${aws_vpc.csye6225_a4_vpc.id}"
    tags = {
        Name = "csye6225-igw"
    }
}

resource "aws_route_table" "csye6225-crt" {
    vpc_id = "${aws_vpc.csye6225_a4_vpc.id}"

    route {
        //associated subnet can reach everywhere
        cidr_block = "0.0.0.0/0"
        //CRT uses this IGW to reach internet
        gateway_id = "${aws_internet_gateway.csye6225-igw.id}"
    }

    tags = {
        Name = "csye6225-crt"
    }
}

resource "aws_route_table_association" "csye6225-crta" {
  subnet_id      = "${aws_subnet.csye6225-subnet-a.id}"
  route_table_id = "${aws_route_table.csye6225-crt.id}"
}

resource "aws_route_table_association" "csye6225-associationb" {
    subnet_id      = "${aws_subnet.csye6225-subnet-b.id}"
    route_table_id = "${aws_route_table.csye6225-crt.id}"
}

resource "aws_route_table_association" "csye6225-associationc" {
    subnet_id      = "${aws_subnet.csye6225-subnet-c.id}"
    route_table_id = "${aws_route_table.csye6225-crt.id}"
}

resource "aws_security_group" "application" {
  name        = "application"
  description = "Application Security Group"
  vpc_id      = "${aws_vpc.csye6225_a4_vpc.id}"

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    security_groups = ["${aws_security_group.lb_security_group.id}"]
  }
  ingress{
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    security_groups = ["${aws_security_group.lb_security_group.id}"]
  }
  ingress{
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    security_groups = ["${aws_security_group.lb_security_group.id}"]
    }
    ingress{
    description = "Angular"
    from_port   = 4200
    to_port     = 4200
    protocol    = "tcp"
    security_groups = ["${aws_security_group.lb_security_group.id}"]
   }
   ingress{
    description = "Node"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    security_groups = ["${aws_security_group.lb_security_group.id}"]
    
    }
    ingress{
    description = "Postgres"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = ["${aws_security_group.lb_security_group.id}"]
    }
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

  
  tags = {
    Name = "application"
  }
}

resource "aws_security_group" "database" {
  name        = "db_SG"
  description = "Database Security Group"
  vpc_id      = "${aws_vpc.csye6225_a4_vpc.id}"

  ingress {
    description = "Postgres"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.csye6225_a4_vpc.cidr_block]
  }
  
}

resource "aws_security_group" "lb_security_group" {
  name        = "lb_security_group"
  description = "Load Balancer Security Group"
  vpc_id      = "${aws_vpc.csye6225_a4_vpc.id}"

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress{
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress{
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    }
    ingress{
    description = "Angular"
    from_port   = 4200
    to_port     = 4200
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
   }
   ingress{
    description = "Node"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    
    }
    ingress{
    description = "Postgres"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    }
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

  
  tags = {
    Name = "application"
  }
}

resource "aws_kms_key" "mykey" {
  description             = "This key is used to encrypt bucket objects"
  deletion_window_in_days = 10
}

resource "aws_s3_bucket" "webapp_abhinav_nagaraj" {

        bucket = "webapp.abhinav.nagaraj"
        force_destroy = true
        acl    = "private"

        versioning {
            enabled = true
        }
        server_side_encryption_configuration {
        rule {
            apply_server_side_encryption_by_default {
            kms_master_key_id = "${aws_kms_key.mykey.arn}"
            sse_algorithm     = "aws:kms"
                }
            }
        }
        lifecycle_rule {
        enabled = true
        transition {
            days          = 30
            storage_class = "STANDARD_IA" # or "ONEZONE_IA"
        }
        expiration {
            days = 90
        }
    }
    cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT","POST","GET","DELETE"]
    allowed_origins = ["*"]
  }
    tags = {
            Name        = "S3_Bucket"
            Environment = "Dev"
        }
    }

    

resource "aws_s3_bucket" "codedeploy_csye6225su-abhinav_me" {
    bucket = "codedeploy.csye6225su-abhinav.me"
    force_destroy = true
    acl = "private"
    server_side_encryption_configuration {
        rule {
            apply_server_side_encryption_by_default {
                sse_algorithm     = "AES256"
            }
        }
    }
    cors_rule {
        allowed_headers = ["Authorization"]
        allowed_methods = ["GET", "POST", "DELETE"]
        allowed_origins = ["*"]
        expose_headers  = ["ETag"]
        max_age_seconds = 3000
    }

    lifecycle_rule {
        enabled = true

        expiration {
            days = 30
        }
    }
}

resource "aws_s3_bucket" "lambda_codedeploy_bucket" {
    bucket = "lambda.codedeploy.bucket"
    force_destroy = true
    acl = "private"
    server_side_encryption_configuration {
        rule {
            apply_server_side_encryption_by_default {
                sse_algorithm     = "AES256"
            }
        }
    }
    cors_rule {
        allowed_headers = ["Authorization"]
        allowed_methods = ["GET", "POST", "DELETE"]
        allowed_origins = ["*"]
        expose_headers  = ["ETag"]
        max_age_seconds = 3000
    }

    lifecycle_rule {
        enabled = true

        expiration {
            days = 30
        }
    }
}

    
   variable "name_subnet_group" {
    type = string
}

resource "aws_db_subnet_group" "my_subnet_group" {
    name       = "my_subnet_group"
    subnet_ids = ["${aws_subnet.csye6225-subnet-c.id}", "${aws_subnet.csye6225-subnet-a.id}", "${aws_subnet.csye6225-subnet-b.id}"]

    tags = {
        Name = var.name_subnet_group

    }
}
resource "aws_db_parameter_group" "postgres-parameters" {
name = "postgres-parameters"
family = "postgres9.6"
description = "Postgres parameter group"

parameter {
    name         = "rds.force_ssl"
    value        = "1"
    apply_method = "pending-reboot"
  }
}

resource "aws_db_instance" "psql_rds" {
    allocated_storage    = 20
    storage_type         = "gp2"
    engine               = "postgres"
    engine_version       = "9.6.11"
    multi_az             = "false"
    identifier           = "csye6225-su2020"
    instance_class       = "db.t3.micro"
    db_subnet_group_name = "${aws_db_subnet_group.my_subnet_group.id}"
    name                 = "csye6225"
    username             = "csye6225_su2020"
    password             = "Uzumaki_1995"
    publicly_accessible  = "false"
    final_snapshot_identifier = "csye6225-su2020-final-snapshot"
    skip_final_snapshot  = "true"
    storage_encrypted = "true"
    parameter_group_name = "${aws_db_parameter_group.postgres-parameters.name}"
    vpc_security_group_ids = [aws_security_group.database.id]
}

variable "nameami" {
    type = string
}

variable "namedevice" {   // /dev/sdn or /dev/sdg
    type = string
}

# resource "aws_instance" "web" {
#     ami = var.nameami
#     instance_type = "t2.micro"
#     key_name = "CSYE6226-Prod"
#     disable_api_termination = "false"
#     subnet_id ="${aws_subnet.csye6225-subnet-b.id}"
#     vpc_security_group_ids = ["${aws_security_group.application.id}"]
#     iam_instance_profile = "${aws_iam_instance_profile.CodeDeployEC2ServiceRole_profile.name}"

#     lifecycle {     #force_destroy = true

#     }
#     ebs_block_device {
#         device_name = var.namedevice
#         volume_size = 20
#         volume_type = "gp2"
#     }
#     user_data = <<-EOF
#                 #!/bin/bash
#                 sudo touch /home/ubuntu/.env
#                 sudo echo "RDS_USERNAME = "${aws_db_instance.psql_rds.username}"" >> /home/ubuntu/.env
#                 sudo echo "RDS_PASSWORD = "Uzumaki_1995"" >> /home/ubuntu/.env
#                 sudo echo "RDS_HOSTNAME = "${aws_db_instance.psql_rds.address}"" >> /home/ubuntu/.env
#                 sudo echo "BUCKET = "${aws_s3_bucket.webapp_abhinav_nagaraj.bucket}"" >> /home/ubuntu/.env
#                 sudo echo "RDS_ENDPOINT = "${aws_db_instance.psql_rds.endpoint}"" >> /home/ubuntu/.env
#                 sudo echo "RDS_DB_NAME = "${aws_db_instance.psql_rds.name}"" >> /home/ubuntu/.env
#                 sudo echo "AWS_ACCESS_KEY = "AKIAUZMNGK6UDZV47O3X"" >> /home/ubuntu/.env
#                 sudo echo "AWS_SECRET_ACCESS_KEY = "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"" >> /home/ubuntu/.env
#                 sudo echo "REGION = "us-east-1"" >> /home/ubuntu/.env
#         EOF

#     tags = {
#         Name = "myec2app"
#     }
# }

resource "aws_dynamodb_table" "mydbtable" {
    provider = aws
    name = "csye6225-dynamo"
    hash_key = "id"
    read_capacity = 1
    write_capacity = 1

    attribute {
        name = "id"
        type = "S"
    }
}


resource "aws_iam_policy" "WebAppS3policy" {
    name        = "WebAppS3policy"
    path        = "/"
    description = "S3 Policy for web application"

    policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetObject",
        "s3:PutObject",
        "s3:PostObject",
        "s3:DeleteObject"
      ],
      "Effect": "Allow",
      "Resource": [
                "arn:aws:s3:::webapp.abhinav.nagaraj",
                "arn:aws:s3:::webapp.abhinav.nagaraj/*"
            ]
    }
  ]
}
EOF
}

resource "aws_iam_policy" "DeployS3policy" {
    name        = "DeployS3policy"
    path        = "/"
    description = "S3 Policy for web application"

    policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetObject",
        "s3:PutObject",
        "s3:PostObject",
        "s3:DeleteObject"
      ],
      "Effect": "Allow",
      "Resource": [
                "arn:aws:s3:::webapp.abhinav.nagaraj",
                "arn:aws:s3:::webapp.abhinav.nagaraj/*"
            ]
    }
  ]
}
EOF
}

resource "aws_iam_user_policy" "codedeploy" {
  name = "codedeploy"
  user = "cicd"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:AttachVolume",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:CopyImage",
                "ec2:CreateImage",
                "ec2:CreateKeypair",
                "ec2:CreateSecurityGroup",
                "ec2:CreateSnapshot",
                "ec2:CreateTags",
                "ec2:CreateVolume",
                "ec2:DeleteKeyPair",
                "ec2:DeleteSecurityGroup",
                "ec2:DeleteSnapshot",
                "ec2:DeleteVolume",
                "ec2:DeregisterImage",
                "ec2:DescribeImageAttribute",
                "ec2:DescribeImages",
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceStatus",
                "ec2:DescribeRegions",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeSnapshots",
                "ec2:DescribeSubnets",
                "ec2:DescribeTags",
                "ec2:DescribeVolumes",
                "ec2:DetachVolume",
                "ec2:GetPasswordData",
                "ec2:ModifyImageAttribute",
                "ec2:ModifyInstanceAttribute",
                "ec2:ModifySnapshotAttribute",
                "ec2:RegisterImage",
                "ec2:RunInstances",
                "ec2:StopInstances",
                "ec2:TerminateInstances"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_iam_policy" "CodeDeploy-EC2-S3" {
  name = "CodeDeploy-EC2-S3"
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::codedeploy.csye6225su-abhinav.me",
                "arn:aws:s3:::codedeploy.csye6225su-abhinav.me/*"
              ]
        }
    ]
}

EOF
}

resource "aws_iam_user_policy" "CircleCI-Upload-To-S3"{

    user = "circleci"
    name = "CircleCI-Upload-To-S3"
    policy = <<EOF
{

    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": [
                "arn:aws:s3:::codedeploy.csye6225su-abhinav.me",
                "arn:aws:s3:::codedeploy.csye6225su-abhinav.me/*"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_user_policy" "CircleCI-Upload-To-S3-Lambda"{

    user = "circleci"
    name = "CircleCI-Upload-To-S3-Lambda"
    policy = <<EOF
{

    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": [
                "arn:aws:s3:::lambda.codedeploy.bucket",
                "arn:aws:s3:::lambda.codedeploy.bucket/*"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_user_policy" "CircleCI-Code-Deploy" {
    user = "circleci"
    name = "CircleCI-Code-Deploy"

    policy = <<EOF
{
    "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "codedeploy:RegisterApplicationRevision",
        "codedeploy:GetApplicationRevision",
        "codedeploy:ListApplicationRevisions",
        "codedeploy:GetDeploymentConfig",
        "codedeploy:RegisterApplicationRevision",
        "codedeploy:ListApplicationRevisions",
        "codedeploy:GetApplicationRevision"
      ],
      "Resource": [
        "arn:aws:codedeploy:us-east-1:329397983144:application:csye6225-webapp"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codedeploy:CreateDeployment",
        "codedeploy:GetDeployment",
        "codedeploy:GetDeploymentConfig",
        "codedeploy:RegisterApplicationRevision",
        "codedeploy:ListApplicationRevisions",
        "codedeploy:GetApplicationRevision"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codedeploy:GetDeploymentConfig",
        "codedeploy:RegisterApplicationRevision",
        "codedeploy:ListApplicationRevisions",
        "codedeploy:GetApplicationRevision"
      ],
      "Resource": [
        "arn:aws:codedeploy:us-east-1:329397983144:deploymentconfig:CodeDeployDefault.OneAtATime",
        "arn:aws:codedeploy:us-east-1:329397983144:deploymentconfig:CodeDeployDefault.HalfAtATime",
        "arn:aws:codedeploy:us-east1:329397983144:deploymentconfig:CodeDeployDefault.AllAtOnce"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role" "CodeDeployEC2ServiceRole" {
  name = "CodeDeployEC2ServiceRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": ["ec2.amazonaws.com",
        "codedeploy.us-east-1.amazonaws.com"
        ]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

}
resource "aws_iam_role" "CodeDeployServiceRole" {
  name = "CodeDeployServiceRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "codedeploy.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

}
resource "aws_iam_role" "CloudWatchAgentServerRole" {
  name = "CloudWatchAgentServerRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

}

resource "aws_iam_role_policy_attachment" "CloudwatchServerAttachment1" {
 role       = "${aws_iam_role.CloudWatchAgentServerRole.name}"
 policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy_attachment" "CloudwatchServerAttachment2" {
 role       = "${aws_iam_role.CloudWatchAgentServerRole.name}"
 policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
resource "aws_iam_role_policy_attachment" "CloudwatchServerAttachment3" {
 role       = "${aws_iam_role.CodeDeployEC2ServiceRole.name}"
 policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}
resource "aws_iam_role_policy_attachment" "CloudwatchServerAttachment4" {
 role       = "${aws_iam_role.CodeDeployEC2ServiceRole.name}"
 policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role" "CloudWatchAgentAdminRole" {
  name = "CloudWatchAgentAdminRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

}

resource "aws_iam_role_policy_attachment" "CloudwatchAdminAttachment1" {
 role       = "${aws_iam_role.CloudWatchAgentAdminRole.name}"
 policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentAdminPolicy"
}

resource "aws_iam_role_policy_attachment" "CloudwatchAdminAttachment2" {
 role       = "${aws_iam_role.CloudWatchAgentAdminRole.name}"
 policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
resource "aws_iam_role_policy_attachment" "CloudwatchAdminAttachment3" {
 role       = "${aws_iam_role.CodeDeployEC2ServiceRole.name}"
 policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentAdminPolicy"
}
resource "aws_iam_role_policy_attachment" "CloudwatchAdminAttachment4" {
 role       = "${aws_iam_role.CodeDeployEC2ServiceRole.name}"
 policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_policy_attachment" "CodeDeploy-EC2-S3-attachment" {
  name       = "test-attachment"
  users      = ["circleci"]
  roles      = ["${aws_iam_role.CodeDeployEC2ServiceRole.name}"]
  policy_arn = "${aws_iam_policy.CodeDeploy-EC2-S3.arn}"
}

resource "aws_iam_instance_profile" "CodeDeployEC2ServiceRole_profile" {
  name = "CodeDeployEC2ServiceRole_profile"
  role = "${aws_iam_role.CodeDeployEC2ServiceRole.name}"
}

resource "aws_codedeploy_app" "csye6225-webapp" {
  compute_platform = "Server"
  name             = "csye6225-webapp"
}

resource "aws_codedeploy_deployment_group" "csye6225-webapp-deployment" {
  app_name              = "${aws_codedeploy_app.csye6225-webapp.name}"
  deployment_group_name = "csye6225-webapp-deployment"
  service_role_arn      = "${aws_iam_role.CodeDeployServiceRole.arn}"
  deployment_style {
    deployment_option = "WITHOUT_TRAFFIC_CONTROL"
    deployment_type   = "IN_PLACE"
  }
  deployment_config_name = "CodeDeployDefault.AllAtOnce"
  autoscaling_groups = ["${aws_autoscaling_group.asg.name}"]
  ec2_tag_set {
    ec2_tag_filter {
      key   = "Name"
      type  = "KEY_AND_VALUE"
      value = "myec2app"
    }

  }
 auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

}

resource "aws_codedeploy_app" "csye6225-frontend" {
  compute_platform = "Server"
  name             = "csye6225-frontend"
}

resource "aws_codedeploy_deployment_group" "csye6225-frontend-deployment" {
  app_name              = "${aws_codedeploy_app.csye6225-frontend.name}"
  deployment_group_name = "csye6225-frontend-deployment"
  service_role_arn      = "${aws_iam_role.CodeDeployServiceRole.arn}"
  deployment_style {
    deployment_option = "WITHOUT_TRAFFIC_CONTROL"
    deployment_type   = "IN_PLACE"
  }
  deployment_config_name = "CodeDeployDefault.AllAtOnce"
  autoscaling_groups = ["${aws_autoscaling_group.asg.name}"]
  ec2_tag_set {
    ec2_tag_filter {
      key   = "Name"
      type  = "KEY_AND_VALUE"
      value = "myec2app"
    }

  }
 auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

}

resource "aws_codedeploy_app" "csye6225-lambda" {
  compute_platform = "Lambda"
  name             = "csye6225-lambda"
}

resource "aws_codedeploy_deployment_config" "lambda_deployment_config" {
  deployment_config_name = "lambda_deployment_config"
  compute_platform       = "Lambda"

  traffic_routing_config {
    type = "TimeBasedLinear"

    time_based_linear {
      interval   = 10
      percentage = 10
    }
  }
}

resource "aws_codedeploy_deployment_group" "csye6225-lambda-deployment" {
  app_name              = "${aws_codedeploy_app.csye6225-lambda.name}"
  deployment_group_name = "csye6225-lambda-deployment"
  service_role_arn      = "${aws_iam_role.CodeDeployLambdaServiceRole.arn}"
  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
  }
  deployment_config_name = "${aws_codedeploy_deployment_config.lambda_deployment_config.id}"
 auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

}

resource "aws_iam_role_policy_attachment" "AWSCodeDeployRole" {
 role       = "${aws_iam_role.CodeDeployServiceRole.name}"
 policy_arn = "arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"
}

resource "aws_launch_configuration" "asg_launch_config" {
  name          = "asg_launch_config"
  image_id      = "${var.nameami}"
  instance_type = "t2.micro"
  key_name      = "CSYE6226-Prod"
  associate_public_ip_address  = true
  iam_instance_profile = "${aws_iam_instance_profile.CodeDeployEC2ServiceRole_profile.name}"
  user_data = <<-EOF
                #!/bin/bash
                sudo touch /home/ubuntu/.env
                sudo echo "RDS_USERNAME = "${aws_db_instance.psql_rds.username}"" >> /home/ubuntu/.env
                sudo echo "RDS_PASSWORD = "Uzumaki_1995"" >> /home/ubuntu/.env
                sudo echo "RDS_HOSTNAME = "${aws_db_instance.psql_rds.address}"" >> /home/ubuntu/.env
                sudo echo "BUCKET = "${aws_s3_bucket.webapp_abhinav_nagaraj.bucket}"" >> /home/ubuntu/.env
                sudo echo "RDS_ENDPOINT = "${aws_db_instance.psql_rds.endpoint}"" >> /home/ubuntu/.env
                sudo echo "RDS_DB_NAME = "${aws_db_instance.psql_rds.name}"" >> /home/ubuntu/.env
                sudo echo "AWS_ACCESS_KEY = "*******************"" >> /home/ubuntu/.env
                sudo echo "AWS_SECRET_ACCESS_KEY = "*********************"" >> /home/ubuntu/.env
                sudo echo "REGION = "us-east-1"" >> /home/ubuntu/.env
                sudo echo "TOPIC_ARN = "${aws_sns_topic.EmailNotificationRecipeEndpoint.arn}"" >> /home/ubuntu/.env
        EOF
  security_groups = ["${aws_security_group.application.id}"]
  
}

resource "aws_autoscaling_group" "asg"{
  default_cooldown = 60
  launch_configuration = "${aws_launch_configuration.asg_launch_config.name}"
  min_size = 2
  max_size = 4
  desired_capacity = 2
  health_check_type = "EC2"
  vpc_zone_identifier = ["${aws_subnet.csye6225-subnet-a.id}","${aws_subnet.csye6225-subnet-b.id}","${aws_subnet.csye6225-subnet-c.id}","${aws_subnet.csye6225-subnet-d.id}"]
  tag {
    key                 = "Instance_Name"
    value               = "myec2app"
    propagate_at_launch = true
  }
  target_group_arns = ["${aws_lb_target_group.awsLbTargetGroupfrontend.arn}","${aws_lb_target_group.awsLbTargetGroupbackend.arn}"]
  

}

resource "aws_autoscaling_policy" "awsAutoScalingPolicyUp" {
  autoscaling_group_name = "${aws_autoscaling_group.asg.name}"
  name = "awsAutoScalingPolicyUp"
  adjustment_type = "ChangeInCapacity"
  cooldown = 60
  scaling_adjustment = 1
}
resource "aws_autoscaling_policy" "awsAutoScalingPolicyDown" {
  autoscaling_group_name = "${aws_autoscaling_group.asg.name}"
  name = "awsAutoScalingPolicyDown"
  adjustment_type = "ChangeInCapacity"
  cooldown = 60
  scaling_adjustment = -1
}

resource "aws_cloudwatch_metric_alarm" "CPUAlarmHigh" {
  alarm_name = "CPUAlarmHigh"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods = 2
  threshold = 5
  metric_name = "CPUUtilization"
  statistic = "Average"
  namespace = "AWS/EC2"
  dimensions = {
    AutoScalingGroupName = "${aws_autoscaling_group.asg.name}"
  }

  alarm_actions = [aws_autoscaling_policy.awsAutoScalingPolicyUp.arn]
  alarm_description = "Scale-up if CPU > 90%"
  period = 60
}

resource "aws_cloudwatch_metric_alarm" "CPUAlarmLow" {
  alarm_name = "CPUAlarmLow"
  comparison_operator = "LessThanThreshold"
  evaluation_periods = 2
  threshold = 3
  metric_name = "CPUUtilization"
  statistic = "Average"
  namespace = "AWS/EC2"
  dimensions = {
    AutoScalingGroupName = "${aws_autoscaling_group.asg.name}"
  }
  alarm_actions = [aws_autoscaling_policy.awsAutoScalingPolicyDown.arn]
  alarm_description = "Scale-down if CPU < 3%"
  period = 60
}

resource "aws_lb" "csye-6225-lb" {
  name = "csye-6225-lb"
  load_balancer_type = "application"
  subnets = ["${aws_subnet.csye6225-subnet-a.id}","${aws_subnet.csye6225-subnet-b.id}","${aws_subnet.csye6225-subnet-c.id}","${aws_subnet.csye6225-subnet-d.id}"]
  security_groups = ["${aws_security_group.lb_security_group.id}"]
  //  depends_on = [aws_security_group.loadBalancerSecurityGroup]
}

resource "aws_lb_target_group" "awsLbTargetGroupfrontend" {
  name = "awsLbTargetGroupfrontend"
  target_type = "instance"
  port = 80
  protocol = "HTTP"
  vpc_id = "${aws_vpc.csye6225_a4_vpc.id}"
  depends_on = [aws_lb.csye-6225-lb]
}
resource "aws_lb_target_group" "awsLbTargetGroupbackend" {
    name = "awsLbTargetGroupbackend"
    target_type = "instance"
    port = 3000
    protocol = "HTTP"
    vpc_id = "${aws_vpc.csye6225_a4_vpc.id}"
    depends_on = [aws_lb.csye-6225-lb]
}
resource "aws_lb_listener" "aws_lb_listener_frontend" {
  load_balancer_arn = "${aws_lb.csye-6225-lb.arn}"
  port = 443
  protocol = "HTTPS"
  ssl_policy = "ELBSecurityPolicy-2016-08"
  certificate_arn = "arn:aws:acm:us-east-1:329397983144:certificate/e66aa522-309f-40a3-8cbb-e96c213b4ae2"
  default_action {
    type = "forward"
    target_group_arn = "${aws_lb_target_group.awsLbTargetGroupfrontend.arn}"
  }
}

resource "aws_lb_listener" "aws_lb_listener_abackend" {
    load_balancer_arn = "${aws_lb.csye-6225-lb.arn}"
    port = 3000
    protocol = "HTTPS"
    ssl_policy = "ELBSecurityPolicy-2016-08"
    certificate_arn = "arn:aws:acm:us-east-1:329397983144:certificate/e66aa522-309f-40a3-8cbb-e96c213b4ae2"
    default_action {
        type = "forward"
        target_group_arn = "${aws_lb_target_group.awsLbTargetGroupbackend.arn}"
    }
}

resource "aws_route53_record" "csye-dns" {
  allow_overwrite = true
  zone_id = "Z00774132RMFLTZCL8DY5"
  name = "prod.csye6225su-abhinav.me"
  type    = "A"
  alias {
    name                   = "${aws_lb.csye-6225-lb.dns_name}"
    zone_id                = "${aws_lb.csye-6225-lb.zone_id}"
    evaluate_target_health = true
  }

}

resource "aws_iam_role" "CodeDeployLambdaServiceRole" {
name           = "iam_for_lambda_with_sns"
path           = "/"
assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": ["lambda.amazonaws.com","codedeploy.us-east-1.amazonaws.com"]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
tags = {
Name = "CodeDeployLambdaServiceRole"
}
}

resource "aws_lambda_function" "lambdaFunction" {
filename        = "${data.archive_file.dummy.output_path}"
function_name   = "csye6225"
role            = "${aws_iam_role.CodeDeployLambdaServiceRole.arn}"
handler         = "index.handler"
runtime         = "nodejs12.x"
memory_size     = 256
timeout         = 180
reserved_concurrent_executions  = 5
environment  {
variables = {
DOMAIN_NAME = "prod.csye6225su-abhinav.me"
table  = aws_dynamodb_table.mydbtable.name
}
}
tags = {
Name = "Lambda Email"
}
}

resource "aws_sns_topic" "EmailNotificationRecipeEndpoint" {
name          = "EmailNotificationRecipeEndpoint"
}

resource "aws_sns_topic_subscription" "topicId" {
topic_arn       = "${aws_sns_topic.EmailNotificationRecipeEndpoint.arn}"
protocol        = "lambda"
endpoint        = "${aws_lambda_function.lambdaFunction.arn}"
depends_on      = [aws_lambda_function.lambdaFunction]
}

resource "aws_lambda_permission" "lambda_permission" {
statement_id  = "AllowExecutionFromSNS"
action        = "lambda:InvokeFunction"
principal     = "sns.amazonaws.com"
source_arn    = "${aws_sns_topic.EmailNotificationRecipeEndpoint.arn}"
function_name = "${aws_lambda_function.lambdaFunction.function_name}"
depends_on    = [aws_lambda_function.lambdaFunction]
}

resource "aws_iam_policy" "lambda_policy" {
name        = "lambda"
depends_on = [aws_sns_topic.EmailNotificationRecipeEndpoint]
policy =  <<EOF
{
          "Version" : "2012-10-17",
          "Statement": [
            {
              "Sid": "LambdaDynamoDBAccess",
              "Effect": "Allow",
              "Action": ["dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem"],
              "Resource": "arn:aws:dynamodb:us-east-1:329397983144:table/csye6225-dynamo"
            },
            {
              "Sid": "LambdaSESAccess",
              "Effect": "Allow",
              "Action": ["ses:VerifyEmailAddress",
              "ses:SendEmail",
              "ses:SendRawEmail"],
              "Resource": "arn:aws:ses:us-east-1:329397983144:identity/*"
            },
            {
              "Sid": "LambdaS3Access",
              "Effect": "Allow",
              "Action": ["s3:GetObject","s3:PutObject"],
              "Resource": "arn:aws:s3:::lambda.codedeploy.bucket/*"
            },
            {
              "Sid": "LambdaSNSAccess",
              "Effect": "Allow",
              "Action": ["sns:ConfirmSubscription"],
              "Resource": "${aws_sns_topic.EmailNotificationRecipeEndpoint.arn}"
            }
          ]
        }
EOF
}

resource "aws_iam_policy" "topic_policy" {
name        = "Topic"
description = ""
depends_on  = [aws_sns_topic.EmailNotificationRecipeEndpoint]
policy      = <<EOF
{
          "Version" : "2012-10-17",
          "Statement": [
            {
              "Sid": "AllowEC2ToPublishToSNSTopic",
              "Effect": "Allow",
              "Action": ["sns:Publish",
              "sns:CreateTopic"],
              "Resource": "${aws_sns_topic.EmailNotificationRecipeEndpoint.arn}"
            }
          ]
        }
EOF
}

resource "aws_iam_role_policy_attachment" "topic_policy_attach" {
  role       = "${aws_iam_role.CodeDeployEC2ServiceRole.name}"
  depends_on = [aws_iam_policy.topic_policy]
  policy_arn = "${aws_iam_policy.topic_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "sns_policy_attach" {
  role       = "${aws_iam_role.CodeDeployEC2ServiceRole.name}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonSNSFullAccess"

}

resource "aws_iam_policy" "CircleCI-update-lambda-To-S3" {
name        = "CircleCI-update-lambda-To-S3"
description = "A Upload policy"
depends_on = [aws_lambda_function.lambdaFunction]
policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ActionsWhichSupportResourceLevelPermissions",
            "Effect": "Allow",
            "Action": [
                "lambda:AddPermission",
                "lambda:RemovePermission",
                "lambda:CreateAlias",
                "lambda:UpdateAlias",
                "lambda:DeleteAlias",
                "lambda:UpdateFunctionCode",
                "lambda:UpdateFunctionConfiguration",
                "lambda:PutFunctionConcurrency",
                "lambda:DeleteFunctionConcurrency",
                "lambda:PublishVersion"
            ],
            "Resource": "arn:aws:lambda:us-east-1:329397983144:function:csye6225"
        }
]
}
EOF
}

resource "aws_iam_policy_attachment" "circleci-update-policy-attach" {
name       = "circleci-policy"
users      = ["circleci"]
policy_arn = "${aws_iam_policy.CircleCI-update-lambda-To-S3.arn}"
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attach_predefinedrole" {
role       = "${aws_iam_role.CodeDeployLambdaServiceRole.name}"
depends_on = [aws_iam_role.CodeDeployLambdaServiceRole]
policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attach_role" {
role       = "${aws_iam_role.CodeDeployLambdaServiceRole.name}"
depends_on = [aws_iam_role.CodeDeployLambdaServiceRole]
policy_arn = "${aws_iam_policy.lambda_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "topic_policy_attach_role" {
role       = "${aws_iam_role.CodeDeployLambdaServiceRole.name}"
depends_on = [aws_iam_role.CodeDeployLambdaServiceRole]
policy_arn = "${aws_iam_policy.topic_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "dynamoDB_policy_attach_role" {
role       = "${aws_iam_role.CodeDeployLambdaServiceRole.name}"
depends_on = [aws_iam_role.CodeDeployLambdaServiceRole]
policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_iam_role_policy_attachment" "ses_policy_attach_role" {
role       = "${aws_iam_role.CodeDeployLambdaServiceRole.name}"
depends_on = [aws_iam_role.CodeDeployLambdaServiceRole]
policy_arn = "arn:aws:iam::aws:policy/AmazonSESFullAccess"
}

output "ELB_IP" {
  value = "${aws_lb.csye-6225-lb.dns_name}"
}

data "archive_file" "dummy" {
  type = "zip"
  output_path = "${path.module}/lambda_function_payload.zip"

  source {
    content = "hello"
    filename = "dummy.txt"

  }
}















    # sudo apt update
    # sudo apt install postgresql postgresql-contrib -Y
    # sudo useradd -m -p password abhi
    # sudo -u postgres psql -c "CREATE ROLE abhi WITH LOGIN PASSWORD 'password';"
    # sudo -u postgres psql -c "CREATE DATABASE abhi;"
    # sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE abhi to abhi;"
    # sudo -u postgres psql -c "ALTER ROLE abhi CREATEDB;"
    # sudo -u postgres psql -c "ALTER DATABASE abhi OWNER TO abhi;"
    # sudo -u abhi psql -c "\c abhi;"
    # sudo apt-get install unzip
    


