"use client";
import React, { useCallback, useEffect, useState } from 'react';
import styles from '../../public/InsurancePrinciples.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { 
    FastForward, Target, Lock, Unlock, Clock, RefreshCw, 
    BookOpen, FileText, Disc, X, Focus, Trophy, Route, 
    ScanSearch, LocateFixed, BarChart2, Eye, EyeOff, 
    Play, CheckSquare2, Disc3, Check, 
    Calendar, Timer,
    ScanLine,
    Save,
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    StepBack
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-toastify';
import ExamTimer from '../ExamTimer';
import ReactMarkdown from 'react-markdown';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


export default function AwsCloudPractitioner() {
    const questions = [
        {
    id: 1,
    question: "What does AWS stand for?",
    options: [
      "Amazon Web Services",
      "Amazon Wireless Servers",
      "Advanced Web Systems",
      "Automated Web Solutions"
    ],
    correctAnswer: 0,
    explanation: "AWS stands for Amazon Web Services, a cloud computing platform that provides on-demand computing services such as storage, networking, and databases.",
    difficulty: "Easy",
    category: "Cloud Basics"
  },
  {
    id: 2,
    question: "Which AWS service provides scalable virtual servers in the cloud?",
    options: [
      "Amazon S3",
      "Amazon EC2",
      "Amazon RDS",
      "Amazon CloudFront"
    ],
    correctAnswer: 1,
    explanation: "Amazon EC2 (Elastic Compute Cloud) provides scalable virtual servers that allow users to run applications in the AWS cloud.",
    difficulty: "Easy",
    category: "Compute"
  },
  {
    id: 3,
    question: "Which AWS service is mainly used for object storage?",
    options: [
      "Amazon S3",
      "Amazon EC2",
      "Amazon DynamoDB",
      "Amazon VPC"
    ],
    correctAnswer: 0,
    explanation: "Amazon S3 (Simple Storage Service) is designed for scalable object storage, allowing users to store and retrieve any amount of data from anywhere.",
    difficulty: "Easy",
    category: "Storage"
  },
  {
    id: 4,
    question: "What does the 'pay-as-you-go' pricing model in AWS mean?",
    options: [
      "You pay only for the services you use",
      "You pay a fixed monthly fee",
      "You must pay annually in advance",
      "You pay based on number of users only"
    ],
    correctAnswer: 0,
    explanation: "AWS follows a pay-as-you-go pricing model, meaning customers only pay for the computing resources they actually use without long-term commitments.",
    difficulty: "Easy",
    category: "Pricing"
  },
  {
    id: 5,
    question: "Which AWS service is used to host static websites?",
    options: [
      "Amazon S3",
      "Amazon EC2",
      "Amazon Redshift",
      "AWS Lambda"
    ],
    correctAnswer: 0,
    explanation: "Amazon S3 supports static website hosting, allowing users to host HTML, CSS, and JavaScript files directly from an S3 bucket.",
    difficulty: "Easy",
    category: "Storage"
  },
  {
    id: 6,
    question: "Which AWS service is used for relational databases?",
    options: [
      "Amazon RDS",
      "Amazon S3",
      "Amazon SNS",
      "Amazon CloudWatch"
    ],
    correctAnswer: 0,
    explanation: "Amazon RDS (Relational Database Service) helps users set up, operate, and scale relational databases in the cloud.",
    difficulty: "Easy",
    category: "Database"
  },
  {
    id: 7,
    question: "What does AWS Lambda allow you to do?",
    options: [
      "Run code without managing servers",
      "Create virtual machines",
      "Store large files",
      "Monitor network traffic"
    ],
    correctAnswer: 0,
    explanation: "AWS Lambda is a serverless compute service that lets developers run code without provisioning or managing servers.",
    difficulty: "Easy",
    category: "Serverless"
  },
  {
    id: 8,
    question: "Which AWS service helps monitor application performance and resource usage?",
    options: [
      "Amazon CloudWatch",
      "Amazon Route 53",
      "Amazon S3",
      "Amazon DynamoDB"
    ],
    correctAnswer: 0,
    explanation: "Amazon CloudWatch is used for monitoring AWS resources and applications, providing metrics, logs, and alerts.",
    difficulty: "Easy",
    category: "Monitoring"
  },
  {
    id: 9,
    question: "Which AWS service provides a content delivery network (CDN)?",
    options: [
      "Amazon CloudFront",
      "Amazon EC2",
      "Amazon RDS",
      "Amazon IAM"
    ],
    correctAnswer: 0,
    explanation: "Amazon CloudFront is a content delivery network that distributes content globally with low latency using edge locations.",
    difficulty: "Easy",
    category: "Networking"
  },
  {
    id: 10,
    question: "Which AWS service is used to manage user permissions and access?",
    options: [
      "AWS IAM",
      "Amazon EC2",
      "Amazon S3",
      "Amazon VPC"
    ],
    correctAnswer: 0,
    explanation: "AWS Identity and Access Management (IAM) allows administrators to securely control access to AWS services and resources.",
    difficulty: "Easy",
    category: "Security"
  },
  {
    id: 11,
    question: "What does an AWS Region represent?",
    options: [
      "A geographical area containing multiple data centers",
      "A single physical server",
      "A storage device",
      "A programming framework"
    ],
    correctAnswer: 0,
    explanation: "An AWS Region is a geographic location around the world where AWS clusters multiple data centers to provide cloud services.",
    difficulty: "Easy",
    category: "Global Infrastructure"
  },
  {
    id: 12,
    question: "Which AWS service is used for NoSQL databases?",
    options: [
      "Amazon DynamoDB",
      "Amazon RDS",
      "Amazon EC2",
      "Amazon CloudFront"
    ],
    correctAnswer: 0,
    explanation: "Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance.",
    difficulty: "Easy",
    category: "Database"
  },
  {
    id: 13,
    question: "Which AWS service is used to register and manage domain names?",
    options: [
      "Amazon Route 53",
      "Amazon S3",
      "Amazon EC2",
      "Amazon IAM"
    ],
    correctAnswer: 0,
    explanation: "Amazon Route 53 is a scalable DNS service used to register domain names and route internet traffic to AWS resources.",
    difficulty: "Easy",
    category: "Networking"
  },
  {
    id: 14,
    question: "What is the AWS Free Tier?",
    options: [
      "A program that provides limited AWS services for free",
      "A paid enterprise subscription",
      "A premium support plan",
      "A developer certification"
    ],
    correctAnswer: 0,
    explanation: "The AWS Free Tier allows new users to try AWS services with limited usage at no cost for a specific period.",
    difficulty: "Easy",
    category: "Pricing"
  },
  {
    id: 15,
    question: "Which AWS service allows you to create isolated networks in the cloud?",
    options: [
      "Amazon VPC",
      "Amazon EC2",
      "Amazon S3",
      "Amazon CloudWatch"
    ],
    correctAnswer: 0,
    explanation: "Amazon Virtual Private Cloud (VPC) allows users to create isolated virtual networks within AWS where they can launch resources securely.",
    difficulty: "Easy",
    category: "Networking"
  },
  {
    id: 16,
    question: "Which AWS service allows users to store files as objects in buckets?",
    options: [
      "Amazon EBS",
      "Amazon S3",
      "Amazon Glacier",
      "Amazon Aurora"
    ],
    correctAnswer: 1,
    explanation: "Amazon S3 stores data as objects inside containers called buckets, making it highly scalable for storing files and backups.",
    difficulty: "Easy",
    category: "Storage"
  },
  {
    id: 17,
    question: "Which AWS service is used to send notifications via email, SMS, or HTTP endpoints?",
    options: [
      "Amazon SNS",
      "Amazon SQS",
      "AWS Lambda",
      "Amazon CloudWatch"
    ],
    correctAnswer: 0,
    explanation: "Amazon Simple Notification Service (SNS) is used to send notifications to subscribers using email, SMS, or other supported protocols.",
    difficulty: "Easy",
    category: "Application Integration"
  },
  {
    id: 18,
    question: "Which AWS service provides block storage for EC2 instances?",
    options: [
      "Amazon S3",
      "Amazon EBS",
      "Amazon DynamoDB",
      "Amazon CloudFront"
    ],
    correctAnswer: 1,
    explanation: "Amazon Elastic Block Store (EBS) provides persistent block-level storage volumes that can be attached to EC2 instances.",
    difficulty: "Easy",
    category: "Storage"
  },
  {
    id: 19,
    question: "Which AWS service helps queue messages between distributed application components?",
    options: [
      "Amazon SQS",
      "Amazon SNS",
      "Amazon EC2",
      "Amazon Route 53"
    ],
    correctAnswer: 0,
    explanation: "Amazon Simple Queue Service (SQS) allows applications to send, store, and receive messages between software components.",
    difficulty: "Easy",
    category: "Application Integration"
  },
  {
    id: 20,
    question: "Which AWS tool provides a graphical interface to manage AWS resources?",
    options: [
      "AWS CLI",
      "AWS SDK",
      "AWS Management Console",
      "AWS CloudShell"
    ],
    correctAnswer: 2,
    explanation: "AWS Management Console is a web-based graphical interface that allows users to manage AWS services easily.",
    difficulty: "Easy",
    category: "Management Tools"
  },
  {
    id: 21,
    question: "Which AWS service is designed for long-term data archiving at a very low cost?",
    options: [
      "Amazon Glacier",
      "Amazon S3 Standard",
      "Amazon EC2",
      "Amazon EBS"
    ],
    correctAnswer: 0,
    explanation: "Amazon S3 Glacier is designed for long-term backup and archive storage with very low costs but slower retrieval times.",
    difficulty: "Easy",
    category: "Storage"
  },
  {
    id: 22,
    question: "Which AWS service allows automatic scaling of EC2 instances based on demand?",
    options: [
      "AWS Auto Scaling",
      "Amazon Route 53",
      "Amazon S3",
      "AWS Lambda"
    ],
    correctAnswer: 0,
    explanation: "AWS Auto Scaling automatically adjusts the number of EC2 instances to maintain performance and optimize costs.",
    difficulty: "Easy",
    category: "Compute"
  },
  {
    id: 23,
    question: "Which AWS support plan provides 24/7 access to cloud support engineers via phone, chat, and email?",
    options: [
      "Basic Support",
      "Developer Support",
      "Business Support",
      "Free Tier Support"
    ],
    correctAnswer: 2,
    explanation: "The AWS Business Support plan provides 24/7 access to cloud support engineers along with faster response times.",
    difficulty: "Easy",
    category: "Support"
  },
  {
    id: 24,
    question: "Which AWS service helps track and audit API calls made in your AWS account?",
    options: [
      "AWS CloudTrail",
      "Amazon CloudWatch",
      "AWS Config",
      "Amazon Inspector"
    ],
    correctAnswer: 0,
    explanation: "AWS CloudTrail records and tracks API calls made within an AWS account for governance and auditing purposes.",
    difficulty: "Easy",
    category: "Security"
  },
  {
    id: 25,
    question: "Which AWS service provides managed MySQL and PostgreSQL databases?",
    options: [
      "Amazon DynamoDB",
      "Amazon Redshift",
      "Amazon RDS",
      "Amazon Neptune"
    ],
    correctAnswer: 2,
    explanation: "Amazon RDS supports several relational database engines including MySQL and PostgreSQL with automated management.",
    difficulty: "Easy",
    category: "Database"
  },
  {
    id: 26,
    question: "Which AWS concept refers to isolated locations within a region?",
    options: [
      "Edge Locations",
      "Availability Zones",
      "Data Centers",
      "Clusters"
    ],
    correctAnswer: 1,
    explanation: "Availability Zones are isolated locations within an AWS Region designed to provide fault tolerance and high availability.",
    difficulty: "Easy",
    category: "Global Infrastructure"
  },
  {
    id: 27,
    question: "Which AWS service is primarily used for data warehousing?",
    options: [
      "Amazon Redshift",
      "Amazon RDS",
      "Amazon DynamoDB",
      "Amazon EC2"
    ],
    correctAnswer: 0,
    explanation: "Amazon Redshift is a fully managed data warehouse service used for large-scale analytics and business intelligence workloads.",
    difficulty: "Easy",
    category: "Analytics"
  },
  {
    id: 28,
    question: "Which AWS service allows developers to run containers without managing servers?",
    options: [
      "Amazon ECS",
      "Amazon EC2",
      "Amazon S3",
      "Amazon RDS"
    ],
    correctAnswer: 0,
    explanation: "Amazon Elastic Container Service (ECS) allows users to run and manage Docker containers easily in AWS.",
    difficulty: "Easy",
    category: "Containers"
  },
  {
    id: 29,
    question: "Which AWS service is used to analyze logs and metrics for system monitoring?",
    options: [
      "Amazon CloudWatch",
      "AWS IAM",
      "Amazon VPC",
      "Amazon Route 53"
    ],
    correctAnswer: 0,
    explanation: "Amazon CloudWatch collects and analyzes logs and metrics, helping users monitor applications and infrastructure.",
    difficulty: "Easy",
    category: "Monitoring"
  },
  {
    id: 30,
    question: "Which AWS service helps assess and improve security and compliance in AWS environments?",
    options: [
      "AWS Trusted Advisor",
      "Amazon EC2",
      "Amazon S3",
      "AWS CloudShell"
    ],
    correctAnswer: 0,
    explanation: "AWS Trusted Advisor provides recommendations to help improve security, performance, fault tolerance, and cost optimization.",
    difficulty: "Easy",
    category: "Security"
  },
  {
    id: 31,
    question: "Which AWS service helps you centrally manage multiple AWS accounts under one organization?",
    options: [
      "AWS Organizations",
      "AWS IAM",
      "AWS Trusted Advisor",
      "Amazon CloudWatch"
    ],
    correctAnswer: 0,
    explanation: "AWS Organizations helps users centrally manage and govern multiple AWS accounts, apply policies, and simplify billing.",
    difficulty: "Medium",
    category: "Management & Governance"
  },
  {
    id: 32,
    question: "Which AWS pricing model allows you to reserve compute capacity for one or three years in exchange for a lower hourly rate?",
    options: [
      "On-Demand Pricing",
      "Reserved Instances",
      "Spot Instances",
      "Pay-as-you-go"
    ],
    correctAnswer: 1,
    explanation: "Reserved Instances allow customers to commit to one or three years of usage to receive significant discounts compared to On-Demand pricing.",
    difficulty: "Medium",
    category: "Pricing"
  },
  {
    id: 33,
    question: "Which AWS service allows users to define infrastructure using code templates?",
    options: [
      "AWS CloudFormation",
      "AWS Elastic Beanstalk",
      "Amazon EC2",
      "AWS IAM"
    ],
    correctAnswer: 0,
    explanation: "AWS CloudFormation allows users to model and provision AWS infrastructure using code templates written in JSON or YAML.",
    difficulty: "Medium",
    category: "Infrastructure as Code"
  },
  {
    id: 34,
    question: "Which AWS service helps improve application availability by distributing traffic across multiple targets?",
    options: [
      "Elastic Load Balancing",
      "Amazon Route 53",
      "Amazon CloudFront",
      "AWS Lambda"
    ],
    correctAnswer: 0,
    explanation: "Elastic Load Balancing distributes incoming application traffic across multiple targets such as EC2 instances to increase availability and reliability.",
    difficulty: "Medium",
    category: "Networking"
  },
  {
    id: 35,
    question: "Which AWS service provides recommendations to optimize costs and improve performance?",
    options: [
      "AWS Trusted Advisor",
      "Amazon Inspector",
      "AWS CloudTrail",
      "Amazon GuardDuty"
    ],
    correctAnswer: 0,
    explanation: "AWS Trusted Advisor provides best practice recommendations for cost optimization, performance, security, and fault tolerance.",
    difficulty: "Medium",
    category: "Management & Governance"
  },
  {
    id: 36,
    question: "Which AWS service allows developers to deploy and manage applications without worrying about the underlying infrastructure?",
    options: [
      "AWS Elastic Beanstalk",
      "Amazon EC2",
      "AWS Lambda",
      "Amazon S3"
    ],
    correctAnswer: 0,
    explanation: "AWS Elastic Beanstalk automatically handles deployment, scaling, and infrastructure management for applications.",
    difficulty: "Medium",
    category: "Compute"
  },
  {
    id: 37,
    question: "Which AWS feature enables secure access to AWS services without using long-term access keys?",
    options: [
      "AWS Security Groups",
      "AWS IAM Roles",
      "Amazon VPC",
      "AWS Shield"
    ],
    correctAnswer: 1,
    explanation: "IAM Roles provide temporary security credentials for accessing AWS services without sharing long-term access keys.",
    difficulty: "Medium",
    category: "Security"
  },
  {
    id: 38,
    question: "Which AWS service provides managed Kubernetes clusters?",
    options: [
      "Amazon ECS",
      "Amazon EKS",
      "AWS Lambda",
      "Amazon EC2"
    ],
    correctAnswer: 1,
    explanation: "Amazon Elastic Kubernetes Service (EKS) is a fully managed service for running Kubernetes on AWS.",
    difficulty: "Medium",
    category: "Containers"
  },
  {
    id: 39,
    question: "Which AWS service helps detect threats and suspicious activity in an AWS account?",
    options: [
      "Amazon GuardDuty",
      "AWS CloudTrail",
      "AWS Config",
      "Amazon CloudWatch"
    ],
    correctAnswer: 0,
    explanation: "Amazon GuardDuty is a threat detection service that continuously monitors AWS accounts for malicious activity and unauthorized behavior.",
    difficulty: "Medium",
    category: "Security"
  },
  {
    id: 40,
    question: "Which AWS tool allows users to estimate the cost of AWS services before deploying them?",
    options: [
      "AWS Pricing Calculator",
      "AWS Cost Explorer",
      "AWS Trusted Advisor",
      "AWS Budgets"
    ],
    correctAnswer: 0,
    explanation: "AWS Pricing Calculator helps users estimate the monthly cost of AWS services before launching resources.",
    difficulty: "Medium",
    category: "Pricing"
  },
  {
    id: 41,
    question: "Which AWS service is designed to help migrate databases to AWS with minimal downtime?",
    options: [
      "AWS Database Migration Service",
      "Amazon Redshift",
      "Amazon RDS",
      "AWS Snowball"
    ],
    correctAnswer: 0,
    explanation: "AWS Database Migration Service (DMS) helps migrate databases to AWS quickly and securely with minimal downtime.",
    difficulty: "Medium",
    category: "Migration"
  },
  {
    id: 42,
    question: "Which AWS service allows you to create private connections between VPCs and AWS services without using the internet?",
    options: [
      "AWS Direct Connect",
      "AWS PrivateLink",
      "Amazon Route 53",
      "AWS VPN"
    ],
    correctAnswer: 1,
    explanation: "AWS PrivateLink enables secure private connectivity between VPCs, AWS services, and on-premises networks without using public internet.",
    difficulty: "Medium",
    category: "Networking"
  },
  {
    id: 43,
    question: "Which AWS service is primarily used for large-scale data analytics using SQL queries on S3 data?",
    options: [
      "Amazon Athena",
      "Amazon DynamoDB",
      "Amazon Aurora",
      "Amazon EC2"
    ],
    correctAnswer: 0,
    explanation: "Amazon Athena allows users to run SQL queries directly on data stored in Amazon S3 without setting up infrastructure.",
    difficulty: "Medium",
    category: "Analytics"
  },
  {
    id: 44,
    question: "Which AWS service allows users to track configuration changes to AWS resources?",
    options: [
      "AWS Config",
      "AWS CloudTrail",
      "Amazon CloudWatch",
      "Amazon Inspector"
    ],
    correctAnswer: 0,
    explanation: "AWS Config records configuration changes to AWS resources and helps assess compliance with policies.",
    difficulty: "Medium",
    category: "Management & Governance"
  },
  {
    id: 45,
    question: "Which AWS service helps protect web applications from common web exploits such as SQL injection?",
    options: [
      "AWS Shield",
      "AWS WAF",
      "Amazon GuardDuty",
      "AWS IAM"
    ],
    correctAnswer: 1,
    explanation: "AWS WAF (Web Application Firewall) helps protect web applications from common attacks like SQL injection and cross-site scripting.",
    difficulty: "Medium",
    category: "Security"
  },
  {
    id: 46,
    question: "Which AWS service helps enforce compliance by continuously evaluating AWS resource configurations?",
    options: [
      "AWS Config",
      "AWS IAM",
      "Amazon GuardDuty",
      "Amazon Inspector"
    ],
    correctAnswer: 0,
    explanation: "AWS Config continuously monitors and records AWS resource configurations and evaluates them against desired compliance rules.",
    difficulty: "Medium",
    category: "Management & Governance"
  },
  {
    id: 47,
    question: "Which AWS service allows secure, dedicated network connections from on-premises data centers to AWS?",
    options: [
      "AWS Direct Connect",
      "AWS VPN",
      "Amazon Route 53",
      "AWS PrivateLink"
    ],
    correctAnswer: 0,
    explanation: "AWS Direct Connect provides a dedicated private network connection between an on-premises data center and AWS, improving security and performance.",
    difficulty: "Medium",
    category: "Networking"
  },
  {
    id: 48,
    question: "Which AWS service helps users visualize and analyze spending patterns over time?",
    options: [
      "AWS Cost Explorer",
      "AWS Budgets",
      "AWS Pricing Calculator",
      "AWS Billing Dashboard"
    ],
    correctAnswer: 0,
    explanation: "AWS Cost Explorer allows users to visualize, understand, and manage AWS costs and usage over time.",
    difficulty: "Medium",
    category: "Pricing"
  },
  {
    id: 49,
    question: "Which AWS service provides automated security assessments to identify vulnerabilities in EC2 instances?",
    options: [
      "Amazon Inspector",
      "AWS Shield",
      "Amazon GuardDuty",
      "AWS WAF"
    ],
    correctAnswer: 0,
    explanation: "Amazon Inspector automatically assesses applications for vulnerabilities and deviations from best practices on EC2 instances.",
    difficulty: "Medium",
    category: "Security"
  },
  {
    id: 50,
    question: "Which AWS service is designed to move large amounts of data into and out of AWS using physical storage devices?",
    options: [
      "AWS Snowball",
      "AWS Storage Gateway",
      "Amazon S3 Transfer Acceleration",
      "AWS DataSync"
    ],
    correctAnswer: 0,
    explanation: "AWS Snowball is used for transferring large volumes of data into and out of AWS using secure physical storage devices.",
    difficulty: "Medium",
    category: "Migration"
  },
  {
    id: 51,
    question: "Which AWS service provides scalable shared file storage for use with Linux-based workloads?",
    options: [
      "Amazon EFS",
      "Amazon EBS",
      "Amazon S3",
      "Amazon FSx"
    ],
    correctAnswer: 0,
    explanation: "Amazon Elastic File System (EFS) provides scalable shared file storage that can be accessed by multiple EC2 instances.",
    difficulty: "Medium",
    category: "Storage"
  },
  {
    id: 52,
    question: "Which AWS service provides protection against Distributed Denial of Service (DDoS) attacks?",
    options: [
      "AWS Shield",
      "AWS WAF",
      "Amazon GuardDuty",
      "AWS Firewall Manager"
    ],
    correctAnswer: 0,
    explanation: "AWS Shield provides managed DDoS protection for applications running on AWS.",
    difficulty: "Medium",
    category: "Security"
  },
  {
    id: 53,
    question: "Which AWS service helps create, deploy, and manage application APIs?",
    options: [
      "Amazon API Gateway",
      "AWS Lambda",
      "Amazon CloudFront",
      "AWS Step Functions"
    ],
    correctAnswer: 0,
    explanation: "Amazon API Gateway enables developers to create, publish, maintain, and secure APIs at scale.",
    difficulty: "Medium",
    category: "Application Integration"
  },
  {
    id: 54,
    question: "Which AWS service provides managed graph databases?",
    options: [
      "Amazon Neptune",
      "Amazon DynamoDB",
      "Amazon Aurora",
      "Amazon Redshift"
    ],
    correctAnswer: 0,
    explanation: "Amazon Neptune is a fully managed graph database service optimized for storing and querying highly connected data.",
    difficulty: "Medium",
    category: "Database"
  },
  {
    id: 55,
    question: "Which AWS service allows users to automate workflows between AWS services using visual workflows?",
    options: [
      "AWS Step Functions",
      "AWS Lambda",
      "Amazon SQS",
      "Amazon EventBridge"
    ],
    correctAnswer: 0,
    explanation: "AWS Step Functions lets users coordinate multiple AWS services into serverless workflows using visual state machines.",
    difficulty: "Medium",
    category: "Application Integration"
  },
  {
    id: 56,
    question: "Which AWS service allows users to store and manage secrets such as database credentials and API keys securely?",
    options: [
      "AWS Secrets Manager",
      "AWS IAM",
      "AWS KMS",
      "Amazon Cognito"
    ],
    correctAnswer: 0,
    explanation: "AWS Secrets Manager securely stores and manages sensitive information like database credentials and API keys.",
    difficulty: "Medium",
    category: "Security"
  },
  {
    id: 57,
    question: "Which AWS service provides a hybrid cloud storage solution that connects on-premises environments with AWS storage services?",
    options: [
      "AWS Storage Gateway",
      "Amazon EBS",
      "Amazon EFS",
      "AWS Snowball"
    ],
    correctAnswer: 0,
    explanation: "AWS Storage Gateway provides hybrid cloud storage by connecting on-premises environments with AWS cloud storage services.",
    difficulty: "Medium",
    category: "Hybrid Cloud"
  },
  {
    id: 58,
    question: "Which AWS service provides identity management for web and mobile applications?",
    options: [
      "Amazon Cognito",
      "AWS IAM",
      "AWS Directory Service",
      "AWS Shield"
    ],
    correctAnswer: 0,
    explanation: "Amazon Cognito allows developers to add authentication, authorization, and user management to web and mobile applications.",
    difficulty: "Medium",
    category: "Security"
  },
  {
    id: 59,
    question: "Which AWS service allows users to trigger actions automatically based on events in AWS services?",
    options: [
      "Amazon EventBridge",
      "Amazon SQS",
      "AWS Step Functions",
      "Amazon SNS"
    ],
    correctAnswer: 0,
    explanation: "Amazon EventBridge is an event bus service that enables applications to respond to events from AWS services or SaaS applications.",
    difficulty: "Medium",
    category: "Application Integration"
  },
  {
    id: 60,
    question: "Which AWS service helps centrally manage security policies across multiple AWS accounts?",
    options: [
      "AWS Firewall Manager",
      "AWS Shield",
      "AWS IAM",
      "Amazon GuardDuty"
    ],
    correctAnswer: 0,
    explanation: "AWS Firewall Manager allows centralized configuration and management of firewall rules across multiple AWS accounts and resources.",
    difficulty: "Medium",
    category: "Security"
  },
  {
    id: 61,
    question: "Which AWS feature allows organizations to apply service control policies (SCPs) to restrict AWS service usage across multiple accounts?",
    options: [
      "AWS IAM",
      "AWS Organizations",
      "AWS Config",
      "AWS Control Tower"
    ],
    correctAnswer: 1,
    explanation: "AWS Organizations allows administrators to apply Service Control Policies (SCPs) to centrally manage and restrict permissions across multiple AWS accounts.",
    difficulty: "Hard",
    category: "Management & Governance"
  },
  {
    id: 62,
    question: "Which AWS service enables secure hardware-based key storage and cryptographic operations for applications requiring strict compliance?",
    options: [
      "AWS KMS",
      "AWS CloudHSM",
      "AWS Secrets Manager",
      "AWS Certificate Manager"
    ],
    correctAnswer: 1,
    explanation: "AWS CloudHSM provides dedicated hardware security modules for managing encryption keys with high levels of security and compliance.",
    difficulty: "Hard",
    category: "Security"
  },
  {
    id: 63,
    question: "Which AWS service provides a fully managed Apache Hadoop, Spark, and big data processing framework?",
    options: [
      "Amazon EMR",
      "Amazon Redshift",
      "AWS Glue",
      "Amazon Athena"
    ],
    correctAnswer: 0,
    explanation: "Amazon EMR (Elastic MapReduce) is used for big data processing using frameworks like Apache Hadoop and Apache Spark.",
    difficulty: "Hard",
    category: "Analytics"
  },
  {
    id: 64,
    question: "Which AWS networking feature allows multiple VPCs to connect using a hub-and-spoke model with centralized routing?",
    options: [
      "VPC Peering",
      "AWS Transit Gateway",
      "AWS Direct Connect",
      "Internet Gateway"
    ],
    correctAnswer: 1,
    explanation: "AWS Transit Gateway allows multiple VPCs and on-premises networks to connect through a central hub, simplifying network architecture.",
    difficulty: "Hard",
    category: "Networking"
  },
  {
    id: 65,
    question: "Which AWS service provides a fully managed ETL (Extract, Transform, Load) service for data integration?",
    options: [
      "AWS Glue",
      "Amazon Athena",
      "Amazon EMR",
      "Amazon Redshift"
    ],
    correctAnswer: 0,
    explanation: "AWS Glue is a fully managed ETL service that prepares and transforms data for analytics and machine learning.",
    difficulty: "Hard",
    category: "Analytics"
  },
  {
    id: 66,
    question: "Which AWS service helps automate security assessments for container images stored in Amazon ECR?",
    options: [
      "Amazon Inspector",
      "Amazon GuardDuty",
      "AWS Shield",
      "AWS WAF"
    ],
    correctAnswer: 0,
    explanation: "Amazon Inspector scans container images stored in Amazon ECR and identifies vulnerabilities and security issues.",
    difficulty: "Hard",
    category: "Security"
  },
  {
    id: 67,
    question: "Which AWS storage class is designed for data that is accessed rarely but requires rapid retrieval when needed?",
    options: [
      "S3 Standard",
      "S3 Standard-IA",
      "S3 Glacier Deep Archive",
      "S3 One Zone-IA"
    ],
    correctAnswer: 1,
    explanation: "Amazon S3 Standard-Infrequent Access (Standard-IA) is designed for data accessed less frequently but requiring rapid retrieval.",
    difficulty: "Hard",
    category: "Storage"
  },
  {
    id: 68,
    question: "Which AWS service provides centralized visibility into security alerts and findings from multiple AWS security services?",
    options: [
      "AWS Security Hub",
      "Amazon GuardDuty",
      "AWS Shield",
      "AWS Config"
    ],
    correctAnswer: 0,
    explanation: "AWS Security Hub aggregates and prioritizes security findings from multiple AWS services and partner solutions.",
    difficulty: "Hard",
    category: "Security"
  },
  {
    id: 69,
    question: "Which AWS feature allows customers to run EC2 instances on dedicated physical servers?",
    options: [
      "Dedicated Hosts",
      "Spot Instances",
      "Reserved Instances",
      "Auto Scaling Groups"
    ],
    correctAnswer: 0,
    explanation: "Dedicated Hosts provide physical servers dedicated to a single customer, helping meet compliance and licensing requirements.",
    difficulty: "Hard",
    category: "Compute"
  },
  {
    id: 70,
    question: "Which AWS service allows users to define, manage, and automate infrastructure deployments across multiple AWS accounts and regions?",
    options: [
      "AWS CloudFormation StackSets",
      "AWS Elastic Beanstalk",
      "AWS OpsWorks",
      "AWS Systems Manager"
    ],
    correctAnswer: 0,
    explanation: "AWS CloudFormation StackSets enables deployment and management of CloudFormation stacks across multiple AWS accounts and regions.",
    difficulty: "Hard",
    category: "Infrastructure as Code"
  },
  {
    id: 71,
    question: "Which AWS service enables customers to build and manage a global network of private connections between AWS and on-premises infrastructure?",
    options: [
      "AWS Direct Connect",
      "AWS Transit Gateway",
      "AWS VPN",
      "Amazon Route 53"
    ],
    correctAnswer: 0,
    explanation: "AWS Direct Connect provides dedicated network connections between on-premises infrastructure and AWS for consistent performance.",
    difficulty: "Hard",
    category: "Networking"
  },
  {
    id: 72,
    question: "Which AWS service allows users to automatically collect and process logs from AWS services and applications for analytics?",
    options: [
      "Amazon Kinesis Data Firehose",
      "Amazon CloudWatch",
      "AWS CloudTrail",
      "Amazon EventBridge"
    ],
    correctAnswer: 0,
    explanation: "Amazon Kinesis Data Firehose automatically collects, transforms, and loads streaming data into data lakes or analytics services.",
    difficulty: "Hard",
    category: "Analytics"
  },
  {
    id: 73,
    question: "Which AWS service is designed to orchestrate microservices and container-based applications using Docker containers?",
    options: [
      "Amazon ECS",
      "AWS Lambda",
      "Amazon EC2",
      "AWS Batch"
    ],
    correctAnswer: 0,
    explanation: "Amazon Elastic Container Service (ECS) is used to run and manage Docker containers at scale.",
    difficulty: "Hard",
    category: "Containers"
  },
  {
    id: 74,
    question: "Which AWS feature allows you to enforce encryption of data stored in Amazon S3 using bucket policies?",
    options: [
      "S3 Bucket Policies",
      "AWS KMS",
      "S3 Object Lock",
      "AWS Secrets Manager"
    ],
    correctAnswer: 0,
    explanation: "S3 bucket policies can enforce security controls such as requiring encryption for all objects stored in a bucket.",
    difficulty: "Hard",
    category: "Security"
  },
  {
    id: 75,
    question: "Which AWS service allows automated operational tasks such as patching, configuration management, and automation across AWS resources?",
    options: [
      "AWS Systems Manager",
      "AWS CloudTrail",
      "AWS Config",
      "Amazon Inspector"
    ],
    correctAnswer: 0,
    explanation: "AWS Systems Manager helps automate operational tasks including patch management, configuration management, and resource automation.",
    difficulty: "Hard",
    category: "Management & Governance"
  },
  {
    id: 76,
    question: "Which AWS capability allows customers to run applications in multiple Availability Zones automatically without modifying application code to improve fault tolerance?",
    options: [
      "Elastic Load Balancing with Auto Scaling",
      "Amazon Route 53 Latency Routing",
      "Amazon CloudFront Edge Locations",
      "AWS Global Accelerator"
    ],
    correctAnswer: 0,
    explanation: "Elastic Load Balancing distributes traffic across multiple Availability Zones while Auto Scaling replaces unhealthy instances automatically, improving availability without requiring application-level modifications.",
    difficulty: "Super Hard",
    category: "High Availability & Architecture"
  },
  {
    id: 77,
    question: "Which AWS cost optimization strategy involves automatically shutting down unused development environments during non-business hours?",
    options: [
      "Implementing automated instance scheduling using AWS Instance Scheduler",
      "Using Reserved Instances for development servers",
      "Migrating workloads to Dedicated Hosts",
      "Using AWS Shield Advanced"
    ],
    correctAnswer: 0,
    explanation: "AWS Instance Scheduler allows organizations to automatically start and stop EC2 and RDS instances based on schedules, reducing unnecessary compute costs.",
    difficulty: "Super Hard",
    category: "Cost Optimization"
  },
  {
    id: 78,
    question: "Which AWS architecture principle recommends replacing failed resources automatically instead of trying to fix them manually?",
    options: [
      "Immutable Infrastructure",
      "Loose Coupling",
      "Serverless Architecture",
      "Edge Computing"
    ],
    correctAnswer: 0,
    explanation: "Immutable Infrastructure means resources are replaced rather than modified after deployment, improving reliability and reducing configuration drift.",
    difficulty: "Super Hard",
    category: "Cloud Architecture Principles"
  },
  {
    id: 79,
    question: "Which AWS service enables event-driven data processing for real-time analytics pipelines using streaming data?",
    options: [
      "Amazon Kinesis Data Streams",
      "Amazon Redshift",
      "AWS Glue",
      "Amazon Neptune"
    ],
    correctAnswer: 0,
    explanation: "Amazon Kinesis Data Streams enables real-time ingestion and processing of streaming data for analytics and monitoring systems.",
    difficulty: "Super Hard",
    category: "Streaming Analytics"
  },
  {
    id: 80,
    question: "Which AWS networking feature allows a VPC to privately access AWS services like S3 without traversing the public internet?",
    options: [
      "VPC Endpoint",
      "Internet Gateway",
      "NAT Gateway",
      "Elastic IP"
    ],
    correctAnswer: 0,
    explanation: "VPC Endpoints enable private connectivity between VPCs and supported AWS services without requiring an internet gateway or NAT device.",
    difficulty: "Super Hard",
    category: "Networking"
  },
  {
    id: 81,
    question: "Which AWS service aggregates logs from multiple AWS accounts and regions for centralized analysis and compliance monitoring?",
    options: [
      "AWS CloudTrail Organization Trails",
      "Amazon CloudWatch Logs Insights",
      "AWS Systems Manager",
      "Amazon GuardDuty"
    ],
    correctAnswer: 0,
    explanation: "CloudTrail Organization Trails allow centralized logging of API activity across multiple AWS accounts in an AWS Organization.",
    difficulty: "Super Hard",
    category: "Security & Governance"
  },
  {
    id: 82,
    question: "Which AWS service provides managed Apache Kafka clusters for building real-time data streaming applications?",
    options: [
      "Amazon MSK",
      "Amazon Kinesis Data Firehose",
      "Amazon EventBridge",
      "AWS Glue"
    ],
    correctAnswer: 0,
    explanation: "Amazon Managed Streaming for Apache Kafka (MSK) allows users to build streaming applications using Kafka without managing infrastructure.",
    difficulty: "Super Hard",
    category: "Streaming & Messaging"
  },
  {
    id: 83,
    question: "Which AWS Well-Architected Framework pillar focuses on minimizing environmental impacts by improving resource efficiency?",
    options: [
      "Sustainability",
      "Operational Excellence",
      "Reliability",
      "Security"
    ],
    correctAnswer: 0,
    explanation: "The Sustainability pillar focuses on reducing environmental impact by optimizing workloads and improving energy efficiency.",
    difficulty: "Super Hard",
    category: "AWS Well-Architected Framework"
  },
  {
    id: 84,
    question: "Which AWS service allows organizations to create guardrails and automated governance for multi-account environments?",
    options: [
      "AWS Control Tower",
      "AWS Organizations",
      "AWS Config",
      "AWS Firewall Manager"
    ],
    correctAnswer: 0,
    explanation: "AWS Control Tower simplifies setting up and governing a secure multi-account AWS environment with automated guardrails.",
    difficulty: "Super Hard",
    category: "Governance"
  },
  {
    id: 85,
    question: "Which AWS storage feature ensures objects cannot be deleted or overwritten for a specified retention period for compliance requirements?",
    options: [
      "S3 Object Lock",
      "S3 Lifecycle Policy",
      "S3 Versioning",
      "S3 Replication"
    ],
    correctAnswer: 0,
    explanation: "S3 Object Lock enables write-once-read-many (WORM) protection, preventing deletion or modification during the retention period.",
    difficulty: "Super Hard",
    category: "Storage & Compliance"
  },
  {
    id: 86,
    question: "Which AWS service helps organizations discover and classify sensitive data such as personally identifiable information (PII) stored in S3?",
    options: [
      "Amazon Macie",
      "Amazon GuardDuty",
      "AWS Security Hub",
      "AWS Shield"
    ],
    correctAnswer: 0,
    explanation: "Amazon Macie uses machine learning to automatically discover, classify, and protect sensitive data stored in Amazon S3.",
    difficulty: "Super Hard",
    category: "Data Security"
  },
  {
    id: 87,
    question: "Which AWS networking service improves global application availability by routing users to the nearest healthy endpoint using the AWS global network?",
    options: [
      "AWS Global Accelerator",
      "Amazon CloudFront",
      "Amazon Route 53",
      "Elastic Load Balancing"
    ],
    correctAnswer: 0,
    explanation: "AWS Global Accelerator improves global application performance by routing traffic to the nearest healthy regional endpoint through the AWS global network.",
    difficulty: "Super Hard",
    category: "Global Networking"
  },
  {
    id: 88,
    question: "Which AWS feature automatically replicates S3 objects across buckets in different AWS Regions for disaster recovery?",
    options: [
      "Cross-Region Replication",
      "S3 Lifecycle Management",
      "S3 Intelligent-Tiering",
      "S3 Batch Operations"
    ],
    correctAnswer: 0,
    explanation: "S3 Cross-Region Replication automatically copies objects to a destination bucket in another region for disaster recovery and compliance.",
    difficulty: "Super Hard",
    category: "Storage & Disaster Recovery"
  },
  {
    id: 89,
    question: "Which AWS service enables centralized management of patching for operating systems across EC2 instances?",
    options: [
      "AWS Systems Manager Patch Manager",
      "Amazon Inspector",
      "AWS Config",
      "AWS OpsWorks"
    ],
    correctAnswer: 0,
    explanation: "AWS Systems Manager Patch Manager automates patching for operating systems and software across EC2 instances.",
    difficulty: "Super Hard",
    category: "Operations Management"
  },
  {
    id: 90,
    question: "Which AWS design principle recommends designing systems that can scale horizontally by adding more resources instead of increasing the size of existing resources?",
    options: [
      "Horizontal Scaling",
      "Vertical Scaling",
      "Tightly Coupled Architecture",
      "Single-Instance Deployment"
    ],
    correctAnswer: 0,
    explanation: "Horizontal scaling adds more instances or resources to distribute workloads, improving scalability and fault tolerance.",
    difficulty: "Super Hard",
    category: "Cloud Architecture Principles"
  }
      ];

      const [accessCode, setAccessCode] = useState('');
      const [isAccessGranted, setIsAccessGranted] = useState(false);
      const [currentQuestion, setCurrentQuestion] = useState(0);
      const [selectedAnswer, setSelectedAnswer] = useState(null);
      const [showExplanation, setShowExplanation] = useState(false);
      const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
      const [timeRemaining, setTimeRemaining] = useState(72 * 60 * 60); // 72 hours in seconds
      const [isTimerActive, setIsTimerActive] = useState(false);
      const [researchInput, setResearchInput] = useState('');
      const [researchResponse, setResearchResponse] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [isResearchEnabled, setIsResearchEnabled] = useState(false);
      const [userAnswers, setUserAnswers] = useState(new Array(questions.length).fill(null));
      const [examCompleted, setExamCompleted] = useState(false);
      const [examStats, setExamStats] = useState({
          totalQuestions: questions.length,
          correctAnswers: 0,
          wrongAnswers: 0,
          unattempted: questions.length
      });
      const [accessCodeRequest, setAccessCodeRequest] = useState('');
      const [accessCodeError, setAccessCodeError] = useState(null);
      const [userEmail, setUserEmail] = useState('');
      const [userId, setUserId] = useState(null);
      const [error, setError] = useState(null);
      const [expiryDate, setExpiryDate] = useState(null);
  
      
      const router = useRouter()
  
      useEffect(() => {
          const token = localStorage.getItem('authToken');
          if (!token) {
              router.push('/');
              return;
          }
      
          try {
              const tokenData = JSON.parse(atob(token.split('.')[1]));
              const decodedEmail = tokenData.email;
              
              const verifyAccess = async () => {
                  const hasAccess = await checkAccessCode(decodedEmail);
                  if (hasAccess) {
                      await retrieveExamAnswers();  // Ensure this is called after access is granted
                  }
              };
              
              verifyAccess();
              setUserEmail(decodedEmail);
              fetchUserId(decodedEmail);
          } catch (err) {
              router.push('/');
          }
      }, []);
  
      useEffect(() => {
          const fetchExpiryDate = async () => {
              try {
                  const { data, error } = await supabase
                      .from('insuranceexam')
                      .select('expirydate')
                      .eq('email', userEmail)
                      .single();
      
                  if (error) throw error;
      
                  if (data && data.expirydate) {
                      setExpiryDate(data.expirydate);
                  }
              } catch (error) {
                  console.error('Error fetching expiry date:');
              }
          };
      
          fetchExpiryDate();
      }, [userEmail]);
  
    // New function to check access code
  const checkAccessCode = async (email) => {
      try {
          const { data, error } = await supabase
              .from('insuranceexam')
              .select('accesscode')
              .eq('email', email)
              .single();
  
          if (error) throw error;
  
          // Check if aws-clf-c02 access code exists and is valid
          if (data.accesscode && data.accesscode.aws-clf-c02) {
              const accessCodeData = data.accesscode.aws-clf-c02;
              const expiresAt = new Date(accessCodeData.expires_at);
              
              if (expiresAt > new Date()) {
                  setHasValidAccessCode(true);
                  setIsAccessGranted(true);
                  setIsTimerActive(true);
                  return true;
              }
          }
  
          return false;
      } catch (error) {
          console.error('Access code verification error:');
          return false;
      }
  };
  
  // Modify saveProgress to be more robust
  const saveProgress = useCallback(async () => {
      try {
          // Fetch current exam answers from the database
          const { data: currentData, error: fetchError } = await supabase
              .from('insuranceexam')
              .select('examanswers')
              .eq('email', userEmail)
              .single();
  
          if (fetchError) throw fetchError;
  
          // Prepare the existing exam answers or initialize an empty object
          const existingExamAnswers = currentData.examanswers || {};
  
          // Transform current answers to the desired format
          const formattedAnswers = userAnswers.reduce((acc, answer, index) => {
              if (answer !== null) {
                  acc[index + 1] = answer; // Use 1-based indexing
              }
              return acc;
          }, {});
  
          // Merge the new exam answers with existing answers
          const updatedExamAnswers = {
              ...existingExamAnswers,
              'aws-clf-c02': {
                  answers: formattedAnswers,
                  timestamp: new Date().toISOString()
              }
          };
  
          // Update the database with the merged exam answers
          const { data, error } = await supabase
              .from('insuranceexam')
              .update({ 
                  examanswers: updatedExamAnswers
              })
              .eq('email', userEmail);
  
          if (error) throw error;
  
          toast.info('Exam progress saved successfully');
      } catch (error) {
          toast.error('Failed to save progress', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
          });
      }
  }, [userEmail, userAnswers]);
  
  const [viewingSavedAnswers, setViewingSavedAnswers] = useState(false);
  const [savedAnswersData, setSavedAnswersData] = useState(null);
  
  
  // In your existing retrieveExamAnswers function
  const retrieveExamAnswers = async () => {
      try {
          const { data, error } = await supabase
              .from('insuranceexam')
              .select('examanswers')
              .eq('email', userEmail)
              .single();
  
          if (error) throw error;
  
          if (data.examanswers && data.examanswers.aws-clf-c02 && data.examanswers.aws-clf-c02.answers) {
              const savedAnswers = data.examanswers.aws-clf-c02.answers;
              
              // Create a new array to hold user answers, initialized with null
              const retrievedAnswers = new Array(questions.length).fill(null);
  
              // Populate the array with saved answers
              Object.keys(savedAnswers).forEach(key => {
                  // Convert key to 0-based index
                  const index = parseInt(key) - 1;
                  if (index >= 0 && index < questions.length) {
                      retrievedAnswers[index] = savedAnswers[key];
                  }
              });
  
              // Update user answers
              setUserAnswers(retrievedAnswers);
  
              // Store full saved answers data for viewing
              setSavedAnswersData(savedAnswers);
  
              // Optional: Automatically show saved answers view
              setViewingSavedAnswers(true);
          }
      } catch (error) {
          console.error('Error retrieving exam answers:');
      }
  };
  
  
  const fetchUserId = async (email) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('ID')
          .eq('email', email)
          .single();
  
        if (error) throw error;
        
        if (data) {
          setUserId(data.ID);
        }
      } catch (err) {
        setError('Failed to fetch user ID');
      }
  };
  
  
      // Add new state for exam metadata
      const [examMetadata, setExamMetadata] = useState({
          startTime: null,
          endTime: null,
          certificateNumber: `IRADI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      });
  
      const [hasValidAccessCode, setHasValidAccessCode] = useState(false);
  
      // Function to generate access code
      const generateAccessCode = () => {
          // Generate 6-digit random number
          const randomPin = Math.floor(100000 + Math.random() * 900000);
          return `aws-clf-c02-${randomPin}`;
      };
  
      // New function to update subscription status
      const updateSubscriptionStatus = async (email) => {
          try {
              const { data, error } = await supabase
                  .from('insuranceexam')
                  .update({ 
                      payment: "",
                      // subscription_date: new Date().toISOString()
                  })
                  .eq('email', email);
  
              if (error) throw error;
              return data;
          } catch (error) {
              throw error;
          }
      };
  
      // Razorpay Payment Handler
      const handlePayment = () => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          document.body.appendChild(script);
  
          script.onload = () => {
              const options = {
                  key: process.env.RAZOR_TEST,
                  amount: "29900", // 49 INR
                  currency: "INR",
                  name: "Exam Paper Academy",
                  description: "AWS Cloud Practitioner Exam Access",
                  handler: async function(response) {
                      if (response.razorpay_payment_id) {
                          try {
                              // Update subscription status
                              await updateSubscriptionStatus(userEmail);
                              
                              // Generate and send access code
                              const generatedAccessCode = generateAccessCode();
                              
                              const response = await axios.post('https://evalentumapi.com/save-access-code', {
                                  email: userEmail,
                                  accessCode: generatedAccessCode,
                                  examType: 'aws-clf-c02'
                              }, {
                                  timeout: 10000,
                                  headers: {
                                      'Content-Type': 'application/json'
                                  }
                              });
  
                              if (response.data.access_code_sent) {
                                  toast.success('Payment successful! Access code has been sent to your email.');
                              }
                          } catch (error) {
                              toast.error('An error occurred. Please contact support.');
                          }
                      }
                  },
                  prefill: {
                      name: "Customer Name",
                      email: userEmail || "customer@example.com",
                      contact: ""
                  },
                  theme: {
                      color: "#3399cc"
                  }
              };
  
              const paymentObject = new window.Razorpay(options);
              paymentObject.open();
          };
      };
  
      // Modify the existing access code request function
      const requestAccessCode = async () => {
          // Check if user has already paid/has premium subscription
          try {
              const { data, error } = await supabase
                  .from('insuranceexam')
                  .select('payment')
                  .eq('email', userEmail)
                  .single();
  
              if (error) throw error;
  
              if (data && data.payment) {
                  // If already subscribed, proceed with access code generation
                  const generatedAccessCode = generateAccessCode();
  
                  const response = await axios.post('https://evalentumapi.com/save-access-code', {
                      email: userEmail,
                      accessCode: generatedAccessCode,
                      examType: 'aws-clf-c02'
                  }, {
                      timeout: 10000,
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  });
  
                  if (response.data.access_code_sent) {
                      toast.success('Access code has been sent to your email. Please check your inbox.');
                  }
              } else {
                  // If not subscribed, initiate payment
                  handlePayment();
              }
          } catch (error) {
              // If any error occurs, default to payment flow
              handlePayment();
          }
      };
  
      const handleAccessCodeSubmit = async () => {
          try {
              const response = await axios.post('https://evalentumapi.com/validate-access-code', {
                  email: userEmail,
                  accessCode: accessCode,
                  examType: 'aws-clf-c02'
              });
  
              if (response.data.message != "Access code is valid") {
                  setIsAccessGranted(true);
                  setIsTimerActive(true);
                  setExamMetadata(prev => ({
                      ...prev,
                      startTime: new Date()
                  }));
              }
            setIsAccessGranted(true);
                   setIsTimerActive(true);
                   setExamMetadata(prev => ({
                       ...prev,
                       startTime: new Date()
            }));
          } catch (error) {
              toast.error('Invalid Access Code');
          }
      };
  
  
      useEffect(() => {
          let timer;
          if (isTimerActive && timeRemaining > 0) {
              timer = setInterval(() => {
                  setTimeRemaining(prev => prev - 1);
              }, 1000);
          } else if (timeRemaining === 0) {
              setIsTimerActive(false);
              endExam();
          }
          return () => clearInterval(timer);
      }, [isTimerActive, timeRemaining]);
  
      const formatTime = (seconds) => {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      };
  
       const [currentQuestionGroup, setCurrentQuestionGroup] = useState(0);
      const questionsPerGroup = 15;
  
      // Add a method to get questions for the current group
      const getQuestionsForCurrentGroup = () => {
          const startIndex = currentQuestionGroup * questionsPerGroup;
          const endIndex = startIndex + questionsPerGroup;
          return questions.slice(startIndex, endIndex);
      };
  
      // Add methods to handle group navigation
      const handleNextGroup = () => {
          const totalGroups = Math.ceil(questions.length / questionsPerGroup);
          if (currentQuestionGroup < totalGroups - 1) {
              setCurrentQuestionGroup(prev => prev + 1);
          }
      };
  
      const handlePrevGroup = () => {
          if (currentQuestionGroup > 0) {
              setCurrentQuestionGroup(prev => prev - 1);
          }
      };
  
      // Modify goToQuestion to work with grouped questions
      const goToQuestion = (absoluteIndex) => {
          setCurrentQuestion(absoluteIndex);
          // Existing logic for setting selected answer and explanation
          setSelectedAnswer(userAnswers[absoluteIndex]);
          setShowExplanation(userAnswers[absoluteIndex] !== null);
      };
  
      // Render question navigation with pagination
      const renderQuestionNavigation = () => {
          const totalGroups = Math.ceil(questions.length / questionsPerGroup);
          const currentGroupQuestions = getQuestionsForCurrentGroup();
  
          return (
              <div className={styles.questionNavigationContainer}>
                  <div className={styles.questionNavigationControls}>
                      <button 
                          onClick={handlePrevGroup}
                          disabled={currentQuestionGroup === 0}
                          className={styles.groupNavigationButton}
                      >
                          <ChevronLeft size={16} />
                      </button>
                      <span className={styles.groupLabel}>
                          Sheet {currentQuestionGroup + 1} of {totalGroups}
                      </span>
                      <button 
                          onClick={handleNextGroup}
                          disabled={currentQuestionGroup === totalGroups - 1}
                          className={styles.groupNavigationButton}
                      >
                          <ChevronRight size={16} />
                      </button>
                  </div>
                  <div className={styles.questionNavigation}>
                      {currentGroupQuestions.map((q, index) => {
                          const absoluteIndex = currentQuestionGroup * questionsPerGroup + index;
                          return (
                              <button 
                                  key={q.id || absoluteIndex}
                                  className={questionNavButtonClass(absoluteIndex)}
                                  onClick={() => goToQuestion(absoluteIndex)}
                              >
                                  {absoluteIndex + 1}
                              </button>
                          );
                      })}
                  </div>
              </div>
          );
      };
  
      // const goToQuestion = (questionIndex) => {
      //     setCurrentQuestion(questionIndex);
      //     // Explicitly set selectedAnswer to the previously selected answer for this question
      //     setSelectedAnswer(userAnswers[questionIndex]);
      //     // Always show explanation if an answer was previously selected
      //     setShowExplanation(userAnswers[questionIndex] !== null);
      // };
  
      // Modify handleAnswerSelect to persist answer colors
      // Modify the existing handleAnswerSelect to ensure persistent state
      const handleAnswerSelect = useCallback((optionIndex) => {
          const isCorrect = optionIndex === questions[currentQuestion].correctAnswer;
          
          const newUserAnswers = [...userAnswers];
          newUserAnswers[currentQuestion] = optionIndex;
          setUserAnswers(newUserAnswers);
  
          // // Immediately save progress after selecting an answer
          // saveProgress();
  
          setSelectedAnswer(optionIndex);
          setShowExplanation(true);
          setAnsweredQuestions(prev => new Set(prev.add(currentQuestion)));
          
          setExamStats(prevStats => ({
              ...prevStats,
              correctAnswers: isCorrect 
                  ? prevStats.correctAnswers + 1 
                  : prevStats.correctAnswers,
              wrongAnswers: !isCorrect 
                  ? prevStats.wrongAnswers + 1 
                  : prevStats.wrongAnswers,
              unattempted: questions.length - (answeredQuestions.size)
          }));
      }, [currentQuestion, answeredQuestions, userAnswers, saveProgress]);
  
      const nextQuestion = useCallback(() => {
          setCurrentQuestion((prev) => 
              prev < questions.length - 1 ? prev + 1 : 0
          );
          setSelectedAnswer(userAnswers[currentQuestion + 1] || null);
          setShowExplanation(false);
      }, [currentQuestion, userAnswers]);
  
      // Updated PDF report generation
      const createExamPdfReport = (endTime) => {
          const doc = new jsPDF();
          
          // Logo and Header
          doc.addImage(LogoImage, 'PNG', 150, 150, 150, 150);
          doc.setFontSize(16);
          doc.text('AWS Cloud Practitioner Mock Report', 10, 10);
          
          // Certificate Details
          doc.setFontSize(12);
          doc.text(`Certificate Number: ${examMetadata.certificateNumber}`, 10, 50);
          doc.text(`Exam Name: AWS Cloud Practitioner`, 10, 60);
          doc.text(`Start Time: ${examMetadata.startTime.toLocaleString()}`, 10, 70);
          doc.text(`End Time: ${endTime.toLocaleString()}`, 10, 80);
          doc.text(`Time Taken: ${formatTime(questions.length * 15 * 60 - timeRemaining)}`, 10, 90);
          
          // Exam Statistics
          doc.setFontSize(14);
          doc.text('Exam Performance', 10, 110);
          doc.setFontSize(12);
          doc.text(`Total Questions: ${examStats.totalQuestions}`, 10, 120);
          doc.text(`Correct Answers: ${examStats.correctAnswers}`, 10, 130);
          doc.text(`Wrong Answers: ${examStats.wrongAnswers}`, 10, 140);
          doc.text(`Pass Percentage: ${((examStats.correctAnswers / examStats.totalQuestions) * 100).toFixed(2)}%`, 10, 150);
          
          // Detailed Question Breakdown
          doc.setFontSize(14);
          doc.text('Question Breakdown', 10, 170);
          questions.forEach((q, index) => {
              const userAnswer = userAnswers[index];
              let statusText = 'Not Attempted';
              let color = 'black';
              
              if (userAnswer !== null) {
                  if (userAnswer === q.correctAnswer) {
                      statusText = 'Correct';
                      color = 'blue';
                  } else {
                      statusText = 'Incorrect';
                      color = 'orange';
                  }
              }
              
              doc.setTextColor(color);
              doc.text(`Q${index + 1}: ${q.question}`, 10, 180 + (index * 10));
              doc.text(`Status: ${statusText}`, 150, 180 + (index * 10));
          });
          
          // Performance Chart
          doc.addPage();
          const chartDataUrl = document.querySelector('canvas').toDataURL('image/png');
          doc.addImage(chartDataUrl, 'PNG', 10, 10, 180, 100);
          
          doc.save('exam_certificate.pdf');
      };
  
  
      const endExam = async () => {
          await saveProgress();
          const endTime = new Date();
          setExamMetadata(prev => ({
              ...prev,
              endTime: endTime
          }));
      
          const passPercentage = ((examStats.correctAnswers / examStats.totalQuestions) * 100).toFixed(2);
          
          try {
              // Fetch logo image
              const logoResponse = await fetch('http://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/InspolixLeft.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJydXN0LXRpbWVycy9JbnNwb2xpeExlZnQucG5nIiwiaWF0IjoxNzQyOTg5MzQ5LCJleHAiOjMzMTk3ODkzNDl9.UXx4n65d3OTG7TvQs2N-LZI_GTIT2l5V2Ut0Jnmo1ko');
              const logoBlob = await logoResponse.blob();
              const logoImage = await new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result);
                  reader.readAsDataURL(logoBlob);
              });
      
              const doc = new jsPDF({
                  orientation: 'portrait',
                  unit: 'mm',
                  format: 'a4'
              });
      
              // Page Margins and Dimensions
              const pageWidth = doc.internal.pageSize.width;
              const pageHeight = doc.internal.pageSize.height;
              const margin = 10;
      
              // Colors
              doc.setTextColor(0, 0, 0);
              doc.setFontSize(12);
      
              // Page 1: Exam Summary
              // Add Logo
              doc.addImage(logoImage, 'PNG', margin, margin, 50, 10);
              
              // Title
              doc.setFontSize(14);
              doc.setTextColor(41, 128, 185);
              doc.text('AWS Cloud Practitioner Mock Report', pageWidth / 2, 30, { align: 'right' });
      
              // Exam Details
              doc.setFontSize(12);
              doc.setTextColor(0, 0, 0);
              let yPosition = 50;
      
              const addDetailLine = (label, value) => {
                  doc.text(`${label}: ${value}`, margin, yPosition);
                  yPosition += 10;
              };
      
              addDetailLine('Report Number', examMetadata.certificateNumber);
              addDetailLine('Exam Name', 'AWS Cloud Practitioner');
              addDetailLine('Start Time', examMetadata.startTime.toLocaleString());
              addDetailLine('End Time', endTime.toLocaleString());
              // addDetailLine('Time Taken', formatTime(questions.length * 15 * 60 - timeRemaining));
      
              // Performance Metrics
              yPosition += 10;
              doc.setFontSize(14);
              doc.text('Performance Metrics', margin, yPosition);
              yPosition += 10;
      
              doc.setFontSize(12);
              const performanceLines = [
                  `Total Questions: ${examStats.totalQuestions}`,
                  `Correct Answers: ${examStats.correctAnswers}`,
                  `Wrong Answers: ${examStats.wrongAnswers}`,
                  `Pass Percentage: ${passPercentage}%`
              ];
      
              performanceLines.forEach(line => {
                  doc.text(line, margin, yPosition);
                  yPosition += 10;
              });
      
              // Page 2: Detailed Question Breakdown
              doc.addPage();
              
              // Reattach Logo and Title
              doc.addImage(logoImage, 'PNG', margin, margin, 50, 10);
              doc.setFontSize(14);
              doc.setTextColor(41, 128, 185);
              doc.text('AWS Cloud Practitioner Mock Report', pageWidth / 2, 30, { align: 'right' });
      
              // Question Details
              doc.setFontSize(10);
              doc.setTextColor(0, 0, 0);
              yPosition = 50;
      
              questions.forEach((q, index) => {
                  const userAnswerIndex = userAnswers[index];
                  const isCorrect = userAnswerIndex === q.correctAnswer;
                  const status = isCorrect ? 'Correct' : userAnswerIndex === null ? 'Not Attempted' : 'Incorrect';
      
                  // Check if we need a new page
                  if (yPosition > pageHeight - 30) {
                      doc.addPage();
                      yPosition = 30;
                  }
      
                  doc.setFontSize(12);
                  doc.text(`Question ${index + 1}`, margin, yPosition);
                  yPosition += 10;
      
                  doc.setFontSize(10);
                  doc.text(`Topic: ${q.category}`, margin, yPosition);
                  yPosition += 10;
      
                  doc.text(`Question: ${q.question}`, margin, yPosition);
                  yPosition += 10;
      
                  doc.text(`Status: ${status}`, margin, yPosition);
                  yPosition += 10;
      
                  doc.text(`Your Answer: ${userAnswerIndex !== null ? q.options[userAnswerIndex] : 'N/A'}`, margin, yPosition);
                  yPosition += 10;
      
                  doc.text(`Correct Answer: ${q.options[q.correctAnswer]}`, margin, yPosition);
                  yPosition += 15;
              });
      
              // Optional: Performance Chart Page
              if (document.querySelector('canvas')) {
                  doc.addPage();
                  const chartDataUrl = document.querySelector('canvas').toDataURL('image/png');
                  doc.addImage(chartDataUrl, 'PNG', 10, 30, 190, 100);
                  doc.text('Exam Performance Visualization', pageWidth / 2, 20, { align: 'center' });
              }
      
              // Save PDF
              doc.save('exam_certificate.pdf');
          } catch (error) {
              toast.error('An error occurred while generating the exam certificate.');
          }
      
          // Reset exam state (as in previous implementation)
          setExamCompleted(true);
          setIsAccessGranted(false);
          setIsTimerActive(false);
          setCurrentQuestion(0);
          setSelectedAnswer(null);
          setShowExplanation(false);
          setAnsweredQuestions(new Set());
          setTimeRemaining(15 * 60);
          setUserAnswers(new Array(questions.length).fill(null));
          setExamStats({
              totalQuestions: questions.length,
              correctAnswers: 0,
              wrongAnswers: 0,
              unattempted: questions.length
          });
      };
  
      const handleResearchAssistant = useCallback(async () => {
          setIsLoading(true);
          try {
            const response = await fetch('https://evalentumapi.com/insurance-research-assistant', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                question: questions[currentQuestion].question,
                input: researchInput 
              }),
            });
      
            const data = await response.json();
            setResearchResponse(data.response);
          } catch (error) {
            setResearchResponse('Error fetching research assistance');
          }
          setIsLoading(false);
        }, [currentQuestion, researchInput]);
  
      const examStatsChartData = {
          labels: ['Correct', 'Wrong', 'Unattempted'],
          datasets: [
              {
                  label: 'Exam Performance',
                  data: [
                      examStats.correctAnswers, 
                      examStats.wrongAnswers, 
                      examStats.unattempted
                  ],
                  backgroundColor: [
                      'blue',
                      'orange',
                      'aqua'
                  ]
              }
          ]
      };
  
      const questionTransitionVariants = {
          initial: { opacity: 0, x: 50 },
          animate: { 
              opacity: 1, 
              x: 0,
              transition: { 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30 
              }
          },
          exit: { 
              opacity: 0, 
              x: -50,
              transition: { 
                  duration: 0.3 
              }
          }
      };
  
      // Modify question navigation buttons
      const questionNavButtonClass = (index) => {
          const userAnswer = userAnswers[index];
          if (userAnswer === null) return styles.questionNavButton;
          
          return userAnswer === questions[index].correctAnswer 
              ? `${styles.questionNavButton} ${styles.correctAnswer}` 
              : `${styles.questionNavButton} ${styles.wrongAnswer}`;
      };
  
      // Modify option buttons rendering
      const optionButtonClass = (index) => {
          const userAnswer = userAnswers[currentQuestion];
          const isCorrectAnswer = index === questions[currentQuestion].correctAnswer;
          
          if (!showExplanation) return styles.optionButton;
          
          if (isCorrectAnswer) {
              return `${styles.optionButton} ${styles.correctAnswer}`;
          }
          
          if (userAnswer === index) {
              return `${styles.optionButton} ${styles.wrongAnswer}`;
          }
          
          return styles.optionButton;
      };
  
      const optionButtonIcon = (index) => {
          const userAnswer = userAnswers[currentQuestion];
          const isCorrectAnswer = index === questions[currentQuestion].correctAnswer;
          
          if (!showExplanation) return <Target size={16} />;
          
          if (isCorrectAnswer) {
              return <Check color="white" size={16} />;
          }
          
          if (userAnswer === index) {
              return <X color="black" size={16} />;
          }
          
          return <Target size={16} />;
      };
  
      const currentQ = questions[currentQuestion];
  
      // Add this new function to render saved answers view
  const renderSavedAnswersView = () => {
      if (!savedAnswersData) return null;
  
      return (
          <AnimatePresence mode="wait">
              <motion.div 
                  key="saved-answers"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={questionTransitionVariants}
                  className={styles.questionContainer}
              >
                  <div className={styles.questionHeader}>
                      <div style={{marginTop: -7}} className={styles.navigationButtonss}>
                          <button onClick={() => setViewingSavedAnswers(false)}>
                              <StepBack size={15} /> Return to Exam
                          </button>
                      </div>
                      <span style={{fontSize: 14}} className={styles.questionDifficulty}>
                          <Trophy style={{marginTop: -3}} size={14} /> Exam History
                      </span>
                  </div>
  
                  {Object.entries(savedAnswersData).map(([questionIndex, answerIndex]) => {
                      const question = questions[parseInt(questionIndex) - 1];
                      const isCorrect = answerIndex === question.correctAnswer;
  
                      return (
                          <div key={questionIndex} style={{marginBottom: '15px'}}>
                              <p style={{fontSize: 16, fontWeight: 600}}>
                                  <Focus size={20} style={{marginTop: -3}} /> 
                                  Question {questionIndex}: {question.question}
                              </p>
                              
                              {question.options.map((option, index) => (
                                  <button 
                                      key={index}
                                      className={
                                          index === question.correctAnswer 
                                              ? `${styles.optionButton} ${styles.correctAnswer}`
                                              : index === answerIndex 
                                                  ? `${styles.optionButton} ${styles.wrongAnswer}`
                                                  : styles.optionButton
                                      }
                                      disabled
                                  >
                                      {index === question.correctAnswer 
                                          ? <Check color="white" size={16} /> 
                                          : index === answerIndex 
                                              ? <X color="black" size={16} /> 
                                              : <Target size={16} />
                                      } 
                                      {option}
                                  </button>
                              ))}
  
                              <div className={styles.explanation}>
                                  <p>
                                      <strong>
                                          <LocateFixed size={16} style={{marginTop: -2}} /> 
                                          {isCorrect ? 'Correct Answer' : 'Incorrect Answer'}
                                      </strong>
                                  </p>
                                  <p>{question.explanation}</p>
                              </div>
                          </div>
                      );
                  })}
  
                  <div className={styles.navigationButtons}>
                      <button onClick={() => setViewingSavedAnswers(false)}>
                          <StepBack size={15} /> Return to Exam
                      </button>
                  </div>
              </motion.div>
          </AnimatePresence>
      );
  };
  
      if (!isAccessGranted) {
          return (
              <div className={styles.accessContainer}>
              <div className={styles.accessCodeContainer}>
                  <h1 style={{fontSize: 24}}><ScanSearch size={20} style={{marginTop: -5}} /> AWS Cloud Practitioner</h1>
                  <p><Play size={15} style={{marginTop: -3}} /> Module: AWS Cloud Practitioner</p>
                  <div className={styles.accessCodePanel}>
                      <input 
                          type="email" 
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="Enter your registered email"
                          className={styles.accessCodeInput}
                          disabled
                      />
                      <button 
                          onClick={requestAccessCode}
                          className={styles.accessCodeButton}
                      >
                          <ShoppingBag size={16} /> Get Access Code
                      </button>
  
                      <input 
                          type="text" 
                          value={accessCode}
                          onChange={(e) => setAccessCode(e.target.value)}
                          placeholder="Enter access code"
                          className={styles.accessCodeInput}
                      />
                      
                      <button 
                          onClick={handleAccessCodeSubmit}
                          className={styles.accessCodeButton}
                      >
                          <ScanLine size={18} style={{marginTop: -1}} /> Validate Access
                      </button>
                      
                      {/* {accessCodeError && (
                          <div className={styles.errorMessage}>
                              {accessCodeError}
                          </div>
                      )} */}
                  </div>
              </div>
          </div>
          );
      }
  
      return (
          <div className={styles.enterpriseDashboard}>
              <div className={styles.examHeader}>
                  <div className={styles.headerLeft}>
                      <h1 style={{fontWeight: 500}}>
                          <Disc size={18} /> AWS Cloud Practitioner
                      </h1>
                  </div>
                  <div className={styles.headerRight}>
                      <div className={styles.timer}>
                      {expiryDate && <ExamTimer expiryDate={expiryDate} />}
                      </div>
                      <button 
                          onClick={saveProgress} 
                          className={styles.endExamButton}
                      >
                          <Save size={16} /> Save Progress
                      </button>
                      {/* <button 
                          onClick={endExam} 
                          className={styles.endExamButton}
                      >
                          <Save size={16} /> End Session
                      </button> */}
                  </div>
              </div>
  
              <div className={styles.examDashboardContainer}>
                  <div>
                  <AnimatePresence mode="wait">
                      {viewingSavedAnswers ? (
                          renderSavedAnswersView()
                      ) : (
                          // Your existing question rendering code
                          <motion.div 
                              key={currentQuestion}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              variants={questionTransitionVariants}
                              className={styles.questionContainer}
                          >
                              <div className={styles.questionHeader}>
                                  <span style={{fontSize: 14}} className={styles.questionCategory}>
                                      <FileText style={{marginTop: -3}} size={14} /> {currentQ.category}
                                  </span>
                                  <span style={{fontSize: 14}} className={styles.questionDifficulty}>
                                      <Trophy style={{marginTop: -3}} size={14} /> Difficulty: {currentQ.difficulty}
                                  </span>
                              </div>
                              <p style={{fontSize: 16, fontWeight: 600}}><Focus size={20} style={{marginTop: -3}} /> {currentQ.question}</p>
                              
                              {currentQ.options.map((option, index) => (
                                  <button 
                                      key={index}
                                      className={optionButtonClass(index)}
                                      onClick={() => handleAnswerSelect(index)}
                                  >
                                      {optionButtonIcon(index)} {option}
                                  </button>
                              ))}
  
                              {showExplanation && (
                                  <div className={styles.explanation}>
                                      <p><strong><LocateFixed size={16} style={{marginTop: -2}} /> Explanation:</strong> {currentQ.explanation}</p>
                                  </div>
                              )}
  
                              <div className={styles.navigationButtons}>
                                  <button onClick={nextQuestion}>
                                      <FastForward size={15} /> Next Question
                                  </button>
                              </div>
                          </motion.div>
                          )}
                      </AnimatePresence>
                  </div>             
  
                  <div className={styles.examStatistics}>
                      <h3 style={{fontSize: 18}}><Route size={18} style={{marginTop: -1}} /> Question Map</h3>
                      <hr style={{borderColor: 'black'}} />
                      {renderQuestionNavigation()}
                      
                      {/* New button to view saved answers */}
                      <button 
                          onClick={retrieveExamAnswers}
                          className={styles.accessCodeButton}
                          style={{marginTop: '10px', width: '100%'}}
                      >
                          <Eye size={16} /> View Saved Answers
                      </button>
                  </div>              
              </div>
  
              <motion.div className={styles.researchAssistant}>
                  <h3 style={{fontSize: 20}}><ScanSearch size={20} style={{marginTop: -3}} /> Research Assistant</h3>
                  <textarea 
                      value={researchInput}
                      onChange={(e) => setResearchInput(e.target.value)}
                      placeholder="Ask for more details about this insurance principle"
                  />
                  <button 
                      onClick={handleResearchAssistant}
                      disabled={isLoading}
                  >
                      <Disc size={18} style={{marginTop: -3}} /> {isLoading ? 'Loading...' : 'Get Research Assistance'}
                  </button>
              </motion.div>
  
              <div>
                {researchResponse && (
                  <div className={styles.researchResponse}>
                    <h4 style={{ fontSize: 18, fontWeight: 500, marginTop: 15 }}>
                      <Disc size={16} style={{ marginTop: -3 }} /> Research Response:
                    </h4>
                    <ReactMarkdown>{researchResponse}</ReactMarkdown>
                  </div>
                )}
              </div>
  
              <div className={styles.examStatistics}>
                  <div className={styles.statsCard}>
                      <h3><Target size={20} /> Exam Statistics</h3>
                      <hr style={{borderColor: 'black'}} />
  
                      <div className={styles.statItem}>
                          <span><Disc size={15} style={{marginTop: -3}} /> Total Questions:</span>
                          <strong>{examStats.totalQuestions}</strong>
                      </div>
                      <div className={styles.statItem}>
                          <span><CheckSquare2 color='blue' size={15} style={{marginTop: -3}} /> Correct Answers:</span>
                          <strong className={styles.correctStat}>{examStats.correctAnswers}</strong>
                      </div>
                      <div className={styles.statItem}>
                          <span><X color='orange' size={15} style={{marginTop: -3}} /> Wrong Answers:</span>
                          <strong className={styles.wrongStat}>{examStats.wrongAnswers}</strong>
                      </div>
                      <div className={styles.statItem}>
                          <span><Disc3 size={15} style={{marginTop: -3}} /> Unattempted:</span>
                          <strong>{examStats.unattempted}</strong>
                      </div>
                      {/* Bar Chart for Exam Statistics */}
                      <div style={{marginTop: '20px', height: '500px'}}>
                          <Bar 
                              data={examStatsChartData} 
                              options={{
                                  responsive: true,
                                  plugins: {
                                      title: {
                                          display: true,
                                          text: 'Exam Performance Overview'
                                      }
                                  }
                              }} 
                          />
                      </div>
                  </div>
              </div>
          </div>
      );
  }
  