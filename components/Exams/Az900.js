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


export default function Az900() {
    const questions = [
       {
    "id": 1,
    "question": "What is Microsoft Azure?",
    "options": [
      "A programming language",
      "A cloud computing platform by Microsoft",
      "An operating system",
      "A database software"
    ],
    "correctAnswer": 1,
    "explanation": "Microsoft Azure is Microsoft's cloud computing platform that provides services such as computing, storage, networking, and databases over the internet.",
    "difficulty": "Easy",
    "category": "Cloud Concepts"
  },
  {
    "id": 2,
    "question": "Which cloud model provides shared resources over the internet to multiple customers?",
    "options": [
      "Private Cloud",
      "Hybrid Cloud",
      "Public Cloud",
      "Local Cloud"
    ],
    "correctAnswer": 2,
    "explanation": "Public cloud services provide shared infrastructure and services over the internet to multiple organizations or customers.",
    "difficulty": "Easy",
    "category": "Cloud Concepts"
  },
  {
    "id": 3,
    "question": "Which Azure service is primarily used to create virtual machines?",
    "options": [
      "Azure Virtual Machines",
      "Azure Functions",
      "Azure DevOps",
      "Azure Logic Apps"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Virtual Machines allows users to deploy and run virtual servers in the cloud.",
    "difficulty": "Easy",
    "category": "Azure Compute"
  },
  {
    "id": 4,
    "question": "Which Azure service is used to store large amounts of unstructured data such as images and videos?",
    "options": [
      "Azure SQL Database",
      "Azure Blob Storage",
      "Azure Table Storage",
      "Azure Queue Storage"
    ],
    "correctAnswer": 1,
    "explanation": "Azure Blob Storage is designed to store massive amounts of unstructured data such as documents, images, videos, and backups.",
    "difficulty": "Easy",
    "category": "Azure Storage"
  },
  {
    "id": 5,
    "question": "What is the main benefit of cloud computing?",
    "options": [
      "Unlimited physical hardware",
      "Pay only for what you use",
      "No internet connection required",
      "No security management needed"
    ],
    "correctAnswer": 1,
    "explanation": "Cloud computing follows a pay-as-you-go model, meaning users only pay for the resources they consume.",
    "difficulty": "Easy",
    "category": "Cloud Benefits"
  },
  {
    "id": 6,
    "question": "Which Azure service helps manage user identities and access?",
    "options": [
      "Azure Active Directory",
      "Azure Monitor",
      "Azure Backup",
      "Azure Firewall"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Active Directory (Azure AD) is Microsoft's identity and access management service used for authentication and authorization.",
    "difficulty": "Easy",
    "category": "Security"
  },
  {
    "id": 7,
    "question": "Which cloud deployment model combines both public and private clouds?",
    "options": [
      "Hybrid Cloud",
      "Community Cloud",
      "Dedicated Cloud",
      "Distributed Cloud"
    ],
    "correctAnswer": 0,
    "explanation": "Hybrid cloud integrates both private and public cloud environments, allowing data and applications to move between them.",
    "difficulty": "Easy",
    "category": "Cloud Concepts"
  },
  {
    "id": 8,
    "question": "What does IaaS stand for in cloud computing?",
    "options": [
      "Infrastructure as a Service",
      "Internet as a Service",
      "Integration as a Service",
      "Interface as a Service"
    ],
    "correctAnswer": 0,
    "explanation": "Infrastructure as a Service (IaaS) provides virtualized computing resources such as virtual machines, networking, and storage over the internet.",
    "difficulty": "Easy",
    "category": "Cloud Service Models"
  },
  {
    "id": 9,
    "question": "Which Azure tool allows users to manage resources through a web interface?",
    "options": [
      "Azure Portal",
      "Azure CLI",
      "Azure SDK",
      "Azure PowerShell Script"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Portal is a browser-based interface that allows users to manage and monitor Azure services and resources.",
    "difficulty": "Easy",
    "category": "Azure Management"
  },
  {
    "id": 10,
    "question": "Which Azure service helps monitor application performance and availability?",
    "options": [
      "Azure Monitor",
      "Azure DevOps",
      "Azure Backup",
      "Azure DNS"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Monitor collects, analyzes, and acts on telemetry data from Azure resources and applications.",
    "difficulty": "Easy",
    "category": "Monitoring"
  },
  {
    "id": 11,
    "question": "What is the main purpose of Azure Regions?",
    "options": [
      "To organize billing accounts",
      "To provide geographically distributed data centers",
      "To manage programming languages",
      "To replace operating systems"
    ],
    "correctAnswer": 1,
    "explanation": "Azure Regions are geographic areas containing data centers used to host Azure services close to users for performance and compliance.",
    "difficulty": "Easy",
    "category": "Azure Infrastructure"
  },
  {
    "id": 12,
    "question": "Which pricing model allows users to pay only for the Azure resources they consume?",
    "options": [
      "Subscription model",
      "Pay-as-you-go model",
      "Fixed pricing model",
      "Annual license model"
    ],
    "correctAnswer": 1,
    "explanation": "Azure commonly uses the pay-as-you-go pricing model, meaning customers are billed only for the resources they use.",
    "difficulty": "Easy",
    "category": "Azure Pricing"
  },
  {
    "id": 13,
    "question": "Which Azure service is used to host web applications without managing servers?",
    "options": [
      "Azure Virtual Machines",
      "Azure App Service",
      "Azure Storage",
      "Azure Firewall"
    ],
    "correctAnswer": 1,
    "explanation": "Azure App Service is a fully managed platform for building, deploying, and scaling web apps without managing infrastructure.",
    "difficulty": "Easy",
    "category": "Azure Compute"
  },
  {
    "id": 14,
    "question": "Which Azure storage type is designed for message-based communication between application components?",
    "options": [
      "Blob Storage",
      "Queue Storage",
      "Disk Storage",
      "File Storage"
    ],
    "correctAnswer": 1,
    "explanation": "Azure Queue Storage is used for storing large numbers of messages that can be accessed from anywhere via authenticated HTTP or HTTPS calls.",
    "difficulty": "Easy",
    "category": "Azure Storage"
  },
  {
    "id": 15,
    "question": "Which Azure service helps protect applications from distributed denial-of-service attacks?",
    "options": [
      "Azure DDoS Protection",
      "Azure Monitor",
      "Azure DevTest Labs",
      "Azure Scheduler"
    ],
    "correctAnswer": 0,
    "explanation": "Azure DDoS Protection safeguards Azure resources from distributed denial-of-service attacks by detecting and mitigating malicious traffic.",
    "difficulty": "Easy",
    "category": "Security"
  },
  {
    "id": 16,
    "question": "Which Azure service allows you to store files that can be accessed via the SMB protocol?",
    "options": [
      "Azure File Storage",
      "Azure Blob Storage",
      "Azure Queue Storage",
      "Azure Table Storage"
    ],
    "correctAnswer": 0,
    "explanation": "Azure File Storage provides fully managed file shares in the cloud that are accessible via the SMB protocol.",
    "difficulty": "Easy",
    "category": "Azure Storage"
  },
  {
    "id": 17,
    "question": "Which Azure service is used to create and manage virtual networks in the cloud?",
    "options": [
      "Azure Virtual Network",
      "Azure DNS",
      "Azure ExpressRoute",
      "Azure Load Balancer"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Virtual Network allows resources such as virtual machines to securely communicate with each other and the internet.",
    "difficulty": "Easy",
    "category": "Networking"
  },
  {
    "id": 18,
    "question": "Which Azure tool allows you to manage resources using command-line commands?",
    "options": [
      "Azure CLI",
      "Azure Portal",
      "Azure Monitor",
      "Azure Advisor"
    ],
    "correctAnswer": 0,
    "explanation": "Azure CLI is a command-line interface used to create and manage Azure resources using commands.",
    "difficulty": "Easy",
    "category": "Azure Management"
  },
  {
    "id": 19,
    "question": "Which Azure service provides recommendations to optimize cost, performance, and security?",
    "options": [
      "Azure Advisor",
      "Azure DevOps",
      "Azure Logic Apps",
      "Azure Container Registry"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Advisor analyzes Azure configurations and usage telemetry to provide recommendations for improving performance, security, reliability, and cost.",
    "difficulty": "Easy",
    "category": "Azure Management"
  },
  {
    "id": 20,
    "question": "Which Azure service allows automatic scaling of applications based on demand?",
    "options": [
      "Azure App Service",
      "Azure Load Balancer",
      "Azure Autoscale",
      "Azure Monitor"
    ],
    "correctAnswer": 2,
    "explanation": "Azure Autoscale automatically adjusts the number of resources running your application based on demand.",
    "difficulty": "Easy",
    "category": "Azure Compute"
  },
  {
    "id": 21,
    "question": "Which Azure service is primarily used to manage containerized applications?",
    "options": [
      "Azure Kubernetes Service",
      "Azure SQL Database",
      "Azure Virtual Desktop",
      "Azure Storage Explorer"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Kubernetes Service (AKS) is used to deploy, manage, and scale containerized applications using Kubernetes.",
    "difficulty": "Easy",
    "category": "Containers"
  },
  {
    "id": 22,
    "question": "Which Azure service provides domain name resolution using Microsoft infrastructure?",
    "options": [
      "Azure DNS",
      "Azure Firewall",
      "Azure Bastion",
      "Azure Policy"
    ],
    "correctAnswer": 0,
    "explanation": "Azure DNS hosts DNS domains and provides name resolution using Microsoft Azure infrastructure.",
    "difficulty": "Easy",
    "category": "Networking"
  },
  {
    "id": 23,
    "question": "Which Azure service allows secure remote access to virtual machines through the Azure portal?",
    "options": [
      "Azure Bastion",
      "Azure DevOps",
      "Azure Storage",
      "Azure Functions"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Bastion allows secure RDP and SSH connectivity to virtual machines directly through the Azure portal without exposing public IP addresses.",
    "difficulty": "Easy",
    "category": "Security"
  },
  {
    "id": 24,
    "question": "Which Azure service is used for serverless event-driven computing?",
    "options": [
      "Azure Functions",
      "Azure Virtual Machines",
      "Azure SQL Database",
      "Azure Disk Storage"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Functions allows developers to run event-driven code without managing infrastructure, making it a serverless compute service.",
    "difficulty": "Easy",
    "category": "Serverless"
  },
  {
    "id": 25,
    "question": "Which Azure service is designed to automate workflows and integrate applications?",
    "options": [
      "Azure Logic Apps",
      "Azure Monitor",
      "Azure DevTest Labs",
      "Azure Container Instances"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Logic Apps helps automate workflows and integrate apps, data, services, and systems.",
    "difficulty": "Easy",
    "category": "Integration"
  },
  {
    "id": 26,
    "question": "Which Azure service allows developers to build, test, and deploy applications using integrated development tools?",
    "options": [
      "Azure DevOps",
      "Azure Storage",
      "Azure Sentinel",
      "Azure Firewall"
    ],
    "correctAnswer": 0,
    "explanation": "Azure DevOps provides development collaboration tools such as pipelines, repositories, and boards for building and deploying applications.",
    "difficulty": "Easy",
    "category": "DevOps"
  },
  {
    "id": 27,
    "question": "Which Azure service helps enforce organizational standards and compliance rules for resources?",
    "options": [
      "Azure Policy",
      "Azure Monitor",
      "Azure Functions",
      "Azure App Service"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Policy helps enforce rules and evaluate compliance across Azure resources.",
    "difficulty": "Easy",
    "category": "Governance"
  },
  {
    "id": 28,
    "question": "Which Azure feature helps group resources so they can be managed together?",
    "options": [
      "Resource Group",
      "Region",
      "Availability Zone",
      "Subscription Plan"
    ],
    "correctAnswer": 0,
    "explanation": "A Resource Group is a container that holds related Azure resources so they can be managed collectively.",
    "difficulty": "Easy",
    "category": "Azure Management"
  },
  {
    "id": 29,
    "question": "Which Azure service provides managed relational databases in the cloud?",
    "options": [
      "Azure SQL Database",
      "Azure Blob Storage",
      "Azure Queue Storage",
      "Azure CDN"
    ],
    "correctAnswer": 0,
    "explanation": "Azure SQL Database is a fully managed relational database service based on the SQL Server engine.",
    "difficulty": "Easy",
    "category": "Databases"
  },
  {
    "id": 30,
    "question": "Which Azure feature ensures high availability by spreading resources across multiple physical locations within a region?",
    "options": [
      "Availability Zones",
      "Resource Groups",
      "Subscriptions",
      "Management Groups"
    ],
    "correctAnswer": 0,
    "explanation": "Availability Zones are physically separate locations within an Azure region that protect applications and data from data center failures.",
    "difficulty": "Easy",
    "category": "Azure Infrastructure"
  },
  {
    "id": 31,
    "question": "Which Azure feature helps ensure that virtual machines are distributed across different hardware to increase availability?",
    "options": [
      "Availability Set",
      "Resource Group",
      "Azure Policy",
      "Azure Tag"
    ],
    "correctAnswer": 0,
    "explanation": "Availability Sets distribute virtual machines across multiple fault domains and update domains to improve application availability.",
    "difficulty": "Medium",
    "category": "Azure Infrastructure"
  },
  {
    "id": 32,
    "question": "Which Azure service allows organizations to create private connections between Azure data centers and on-premises infrastructure?",
    "options": [
      "Azure VPN Gateway",
      "Azure ExpressRoute",
      "Azure Front Door",
      "Azure Traffic Manager"
    ],
    "correctAnswer": 1,
    "explanation": "Azure ExpressRoute provides a private, dedicated connection between on-premises infrastructure and Azure datacenters without going through the public internet.",
    "difficulty": "Medium",
    "category": "Networking"
  },
  {
    "id": 33,
    "question": "Which Azure service is used to distribute incoming network traffic across multiple virtual machines?",
    "options": [
      "Azure Load Balancer",
      "Azure Monitor",
      "Azure Policy",
      "Azure Advisor"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Load Balancer distributes incoming traffic across multiple VMs to ensure high availability and reliability.",
    "difficulty": "Medium",
    "category": "Networking"
  },
  {
    "id": 34,
    "question": "Which Azure service is used to centrally manage security policies and compliance across multiple subscriptions?",
    "options": [
      "Azure Sentinel",
      "Azure Security Center",
      "Azure Defender",
      "Azure Firewall"
    ],
    "correctAnswer": 1,
    "explanation": "Azure Security Center provides unified security management and advanced threat protection across Azure workloads.",
    "difficulty": "Medium",
    "category": "Security"
  },
  {
    "id": 35,
    "question": "Which Azure storage redundancy option replicates data within a single datacenter in a region?",
    "options": [
      "Locally Redundant Storage (LRS)",
      "Zone-Redundant Storage (ZRS)",
      "Geo-Redundant Storage (GRS)",
      "Read-Access Geo-Redundant Storage (RA-GRS)"
    ],
    "correctAnswer": 0,
    "explanation": "LRS replicates data three times within a single physical location in a region to protect against hardware failure.",
    "difficulty": "Medium",
    "category": "Azure Storage"
  },
  {
    "id": 36,
    "question": "Which Azure service allows users to analyze large datasets using distributed computing?",
    "options": [
      "Azure Synapse Analytics",
      "Azure Logic Apps",
      "Azure DNS",
      "Azure Backup"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Synapse Analytics is designed for big data analytics and data warehousing using distributed processing.",
    "difficulty": "Medium",
    "category": "Analytics"
  },
  {
    "id": 37,
    "question": "Which Azure feature helps organizations logically organize subscriptions for governance purposes?",
    "options": [
      "Management Groups",
      "Resource Tags",
      "Resource Locks",
      "Availability Sets"
    ],
    "correctAnswer": 0,
    "explanation": "Management Groups help organize multiple Azure subscriptions into a hierarchy for governance and policy management.",
    "difficulty": "Medium",
    "category": "Governance"
  },
  {
    "id": 38,
    "question": "Which Azure service allows secure storage of secrets, certificates, and encryption keys?",
    "options": [
      "Azure Key Vault",
      "Azure Security Center",
      "Azure Backup",
      "Azure Sentinel"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Key Vault securely stores secrets, cryptographic keys, and certificates used by applications and services.",
    "difficulty": "Medium",
    "category": "Security"
  },
  {
    "id": 39,
    "question": "Which Azure service is used to globally distribute content to users with low latency?",
    "options": [
      "Azure Content Delivery Network",
      "Azure Virtual Network",
      "Azure Firewall",
      "Azure Policy"
    ],
    "correctAnswer": 0,
    "explanation": "Azure CDN caches content at edge locations worldwide to deliver faster access to users.",
    "difficulty": "Medium",
    "category": "Networking"
  },
  {
    "id": 40,
    "question": "Which Azure service helps developers deploy containerized applications without managing virtual machines?",
    "options": [
      "Azure Container Instances",
      "Azure DevOps",
      "Azure Monitor",
      "Azure Backup"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Container Instances allow users to run containers directly without managing servers or orchestration platforms.",
    "difficulty": "Medium",
    "category": "Containers"
  },
  {
    "id": 41,
    "question": "Which Azure monitoring feature helps collect logs and metrics from Azure resources?",
    "options": [
      "Azure Monitor Logs",
      "Azure DevOps Boards",
      "Azure Bastion",
      "Azure DNS Zones"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Monitor Logs collects and analyzes telemetry data from applications and infrastructure resources.",
    "difficulty": "Medium",
    "category": "Monitoring"
  },
  {
    "id": 42,
    "question": "Which Azure service provides a global HTTP load balancing and application acceleration service?",
    "options": [
      "Azure Front Door",
      "Azure Virtual Network",
      "Azure Policy",
      "Azure Backup"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Front Door provides global HTTP/HTTPS load balancing and application acceleration for web applications.",
    "difficulty": "Medium",
    "category": "Networking"
  },
  {
    "id": 43,
    "question": "Which Azure tool allows administrators to track spending and manage budgets for Azure services?",
    "options": [
      "Azure Cost Management",
      "Azure Advisor",
      "Azure Monitor",
      "Azure Policy"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Cost Management helps track usage, analyze costs, and set budgets to control cloud spending.",
    "difficulty": "Medium",
    "category": "Pricing and Cost Management"
  },
  {
    "id": 44,
    "question": "Which Azure service provides Security Information and Event Management (SIEM) capabilities?",
    "options": [
      "Azure Sentinel",
      "Azure Backup",
      "Azure DevTest Labs",
      "Azure Load Balancer"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Sentinel is a cloud-native SIEM solution that provides intelligent security analytics and threat detection.",
    "difficulty": "Medium",
    "category": "Security"
  },
  {
    "id": 45,
    "question": "Which Azure feature prevents accidental deletion or modification of critical resources?",
    "options": [
      "Resource Locks",
      "Tags",
      "Availability Zones",
      "Azure Monitor"
    ],
    "correctAnswer": 0,
    "explanation": "Resource Locks allow administrators to lock resources to prevent accidental deletion or modification.",
    "difficulty": "Medium",
    "category": "Governance"
  },
  {
    "id": 46,
    "question": "Which Azure feature allows organizations to apply metadata to resources for better organization and cost tracking?",
    "options": [
      "Azure Tags",
      "Azure Locks",
      "Azure Policies",
      "Azure Regions"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Tags allow users to assign key-value pairs to resources, making it easier to organize, track costs, and manage resources.",
    "difficulty": "Medium",
    "category": "Governance"
  },
  {
    "id": 47,
    "question": "Which Azure storage service is best suited for storing structured NoSQL data?",
    "options": [
      "Azure Table Storage",
      "Azure File Storage",
      "Azure Disk Storage",
      "Azure Blob Archive"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Table Storage provides a NoSQL key-value store for storing large amounts of structured data.",
    "difficulty": "Medium",
    "category": "Azure Storage"
  },
  {
    "id": 48,
    "question": "Which Azure service allows you to create automated deployment pipelines for applications?",
    "options": [
      "Azure Pipelines",
      "Azure Monitor",
      "Azure Firewall",
      "Azure Advisor"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Pipelines is part of Azure DevOps and allows automated build, test, and deployment pipelines for applications.",
    "difficulty": "Medium",
    "category": "DevOps"
  },
  {
    "id": 49,
    "question": "Which Azure networking feature allows filtering of inbound and outbound traffic to Azure resources?",
    "options": [
      "Network Security Group",
      "Azure Region",
      "Azure DNS Zone",
      "Azure Subscription"
    ],
    "correctAnswer": 0,
    "explanation": "Network Security Groups (NSGs) contain security rules that allow or deny network traffic to Azure resources.",
    "difficulty": "Medium",
    "category": "Networking"
  },
  {
    "id": 50,
    "question": "Which Azure service helps detect threats and suspicious activities across cloud workloads?",
    "options": [
      "Microsoft Defender for Cloud",
      "Azure DevTest Labs",
      "Azure Files",
      "Azure Data Factory"
    ],
    "correctAnswer": 0,
    "explanation": "Microsoft Defender for Cloud provides threat protection and security management for Azure resources.",
    "difficulty": "Medium",
    "category": "Security"
  },
  {
    "id": 51,
    "question": "Which Azure feature allows users to replicate data automatically to another Azure region for disaster recovery?",
    "options": [
      "Geo-Redundant Storage",
      "Locally Redundant Storage",
      "Premium Storage",
      "Azure File Sync"
    ],
    "correctAnswer": 0,
    "explanation": "Geo-Redundant Storage (GRS) replicates data to a secondary region to protect against regional outages.",
    "difficulty": "Medium",
    "category": "Azure Storage"
  },
  {
    "id": 52,
    "question": "Which Azure service enables orchestration and scheduling of data workflows?",
    "options": [
      "Azure Data Factory",
      "Azure Bastion",
      "Azure CDN",
      "Azure Backup"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Data Factory is used to create, schedule, and manage data integration workflows in the cloud.",
    "difficulty": "Medium",
    "category": "Data Integration"
  },
  {
    "id": 53,
    "question": "Which Azure service is designed to host and run microservices using containers and orchestration?",
    "options": [
      "Azure Kubernetes Service",
      "Azure SQL Managed Instance",
      "Azure Disk Storage",
      "Azure Monitor"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Kubernetes Service (AKS) provides container orchestration for deploying and managing microservices-based applications.",
    "difficulty": "Medium",
    "category": "Containers"
  },
  {
    "id": 54,
    "question": "Which Azure service helps automatically route user traffic to the nearest available endpoint?",
    "options": [
      "Azure Traffic Manager",
      "Azure Firewall",
      "Azure Storage",
      "Azure Bastion"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Traffic Manager uses DNS-based traffic routing to direct users to the closest or best-performing endpoint.",
    "difficulty": "Medium",
    "category": "Networking"
  },
  {
    "id": 55,
    "question": "Which Azure feature helps ensure compliance by restricting the types of resources that can be created?",
    "options": [
      "Azure Policy",
      "Azure Monitor",
      "Azure Queue Storage",
      "Azure Bastion"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Policy allows organizations to enforce rules and restrictions on Azure resources to maintain compliance.",
    "difficulty": "Medium",
    "category": "Governance"
  },
  {
    "id": 56,
    "question": "Which Azure service provides centralized log analytics for monitoring cloud resources?",
    "options": [
      "Azure Log Analytics",
      "Azure Files",
      "Azure Queue Storage",
      "Azure DevTest Labs"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Log Analytics helps collect and analyze log data from Azure resources for monitoring and troubleshooting.",
    "difficulty": "Medium",
    "category": "Monitoring"
  },
  {
    "id": 57,
    "question": "Which Azure storage tier is designed for long-term backup and rarely accessed data?",
    "options": [
      "Archive Tier",
      "Hot Tier",
      "Premium Tier",
      "Transaction Tier"
    ],
    "correctAnswer": 0,
    "explanation": "The Archive Tier is designed for data that is rarely accessed and requires low storage cost but higher retrieval time.",
    "difficulty": "Medium",
    "category": "Azure Storage"
  },
  {
    "id": 58,
    "question": "Which Azure service enables developers to deploy web APIs and mobile backends easily?",
    "options": [
      "Azure App Service",
      "Azure Firewall",
      "Azure CDN",
      "Azure Virtual Network"
    ],
    "correctAnswer": 0,
    "explanation": "Azure App Service provides a platform for hosting web apps, REST APIs, and mobile backends with built-in scaling and security.",
    "difficulty": "Medium",
    "category": "Azure Compute"
  },
  {
    "id": 59,
    "question": "Which Azure feature allows grouping multiple subscriptions under a single management hierarchy?",
    "options": [
      "Management Groups",
      "Resource Locks",
      "Availability Zones",
      "Network Security Groups"
    ],
    "correctAnswer": 0,
    "explanation": "Management Groups allow administrators to manage access, policies, and compliance across multiple subscriptions.",
    "difficulty": "Medium",
    "category": "Governance"
  },
  {
    "id": 60,
    "question": "Which Azure service provides backup and recovery capabilities for Azure resources and on-premises systems?",
    "options": [
      "Azure Backup",
      "Azure Bastion",
      "Azure CDN",
      "Azure Traffic Manager"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Backup provides secure and scalable backup solutions for protecting Azure and on-premises data.",
    "difficulty": "Medium",
    "category": "Backup and Recovery"
  },
  {
    "id": 61,
    "question": "Which Azure feature ensures that virtual machines are placed on different physical hardware within a datacenter to reduce the risk of hardware failure?",
    "options": [
      "Fault Domains",
      "Availability Zones",
      "Resource Groups",
      "Management Groups"
    ],
    "correctAnswer": 0,
    "explanation": "Fault Domains represent a group of hardware components that share a common power source and network switch. Placing VMs across multiple fault domains helps protect applications from hardware failures.",
    "difficulty": "Hard",
    "category": "Azure Infrastructure"
  },
  {
    "id": 62,
    "question": "Which Azure service provides policy-based governance to ensure resources comply with organizational standards during deployment?",
    "options": [
      "Azure Policy",
      "Azure Advisor",
      "Azure Monitor",
      "Azure DevTest Labs"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Policy enforces organizational standards and evaluates resources for compliance at deployment and runtime.",
    "difficulty": "Hard",
    "category": "Governance"
  },
  {
    "id": 63,
    "question": "Which Azure networking service provides private connectivity between Azure virtual networks without routing traffic over the public internet?",
    "options": [
      "VNet Peering",
      "Azure CDN",
      "Azure Traffic Manager",
      "Azure Front Door"
    ],
    "correctAnswer": 0,
    "explanation": "VNet Peering allows two Azure virtual networks to connect privately using Azure's backbone network without using the public internet.",
    "difficulty": "Hard",
    "category": "Networking"
  },
  {
    "id": 64,
    "question": "Which Azure redundancy option allows read access to replicated data in the secondary region during a regional outage?",
    "options": [
      "Read-Access Geo-Redundant Storage",
      "Zone-Redundant Storage",
      "Locally Redundant Storage",
      "Premium SSD Storage"
    ],
    "correctAnswer": 0,
    "explanation": "RA-GRS (Read-Access Geo-Redundant Storage) replicates data to another region and allows read access to the secondary location.",
    "difficulty": "Hard",
    "category": "Azure Storage"
  },
  {
    "id": 65,
    "question": "Which Azure feature allows administrators to prevent changes to critical resources while still allowing them to be viewed?",
    "options": [
      "ReadOnly Resource Lock",
      "Delete Lock",
      "Azure Policy Assignment",
      "Management Group Control"
    ],
    "correctAnswer": 0,
    "explanation": "A ReadOnly resource lock prevents any modification to a resource but still allows it to be viewed.",
    "difficulty": "Hard",
    "category": "Governance"
  },
  {
    "id": 66,
    "question": "Which Azure service provides application-layer load balancing based on HTTP and HTTPS traffic?",
    "options": [
      "Azure Application Gateway",
      "Azure Load Balancer",
      "Azure VPN Gateway",
      "Azure DNS"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Application Gateway operates at Layer 7 and provides application-level load balancing with features such as URL routing and Web Application Firewall.",
    "difficulty": "Hard",
    "category": "Networking"
  },
  {
    "id": 67,
    "question": "Which Azure service is primarily used for threat detection and security analytics using AI across enterprise environments?",
    "options": [
      "Azure Sentinel",
      "Azure DevOps",
      "Azure Files",
      "Azure Container Registry"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Sentinel is a cloud-native SIEM solution that uses AI and analytics to detect and investigate security threats.",
    "difficulty": "Hard",
    "category": "Security"
  },
  {
    "id": 68,
    "question": "Which Azure service allows organizations to extend on-premises Active Directory identities to the cloud?",
    "options": [
      "Azure AD Connect",
      "Azure Policy",
      "Azure Advisor",
      "Azure Backup"
    ],
    "correctAnswer": 0,
    "explanation": "Azure AD Connect synchronizes on-premises Active Directory identities with Azure Active Directory.",
    "difficulty": "Hard",
    "category": "Identity"
  },
  {
    "id": 69,
    "question": "Which Azure service provides scalable message queues for asynchronous communication between distributed applications?",
    "options": [
      "Azure Service Bus",
      "Azure Blob Storage",
      "Azure Files",
      "Azure Monitor"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Service Bus provides enterprise-grade messaging services for building loosely coupled distributed applications.",
    "difficulty": "Hard",
    "category": "Integration"
  },
  {
    "id": 70,
    "question": "Which Azure monitoring capability allows users to create alerts based on metrics and logs collected from Azure resources?",
    "options": [
      "Azure Monitor Alerts",
      "Azure Advisor Insights",
      "Azure Policy Evaluation",
      "Azure DevOps Boards"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Monitor Alerts notify users when specified conditions occur based on metrics or log data.",
    "difficulty": "Hard",
    "category": "Monitoring"
  },
  {
    "id": 71,
    "question": "Which Azure service enables secure communication between applications using private endpoints within a virtual network?",
    "options": [
      "Azure Private Link",
      "Azure CDN",
      "Azure Front Door",
      "Azure DNS"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Private Link allows access to Azure services over a private endpoint within a virtual network.",
    "difficulty": "Hard",
    "category": "Networking"
  },
  {
    "id": 72,
    "question": "Which Azure cost management feature allows users to define spending limits and receive alerts when budgets are exceeded?",
    "options": [
      "Azure Budgets",
      "Azure Tags",
      "Azure Monitor",
      "Azure Reservations"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Budgets allow organizations to set spending limits and receive alerts when usage approaches or exceeds the defined budget.",
    "difficulty": "Hard",
    "category": "Cost Management"
  },
  {
    "id": 73,
    "question": "Which Azure compute option is best suited for running short-lived container workloads without managing orchestration platforms?",
    "options": [
      "Azure Container Instances",
      "Azure Kubernetes Service",
      "Azure Virtual Machines",
      "Azure Batch"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Container Instances allow containers to run directly without requiring Kubernetes or VM management.",
    "difficulty": "Hard",
    "category": "Containers"
  },
  {
    "id": 74,
    "question": "Which Azure feature allows centralized monitoring and diagnostics across multiple subscriptions and resources?",
    "options": [
      "Azure Monitor",
      "Azure DNS",
      "Azure Bastion",
      "Azure Files"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Monitor provides a comprehensive solution for collecting, analyzing, and acting on telemetry data from multiple Azure resources.",
    "difficulty": "Hard",
    "category": "Monitoring"
  },
  {
    "id": 75,
    "question": "Which Azure storage feature allows frequently accessed data to be stored for low latency while rarely accessed data is automatically moved to lower-cost tiers?",
    "options": [
      "Lifecycle Management",
      "Geo-Replication",
      "Disk Encryption",
      "File Snapshot"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Storage Lifecycle Management automatically moves data between Hot, Cool, and Archive tiers based on access patterns.",
    "difficulty": "Hard",
    "category": "Azure Storage"
  },
  {
    "id": 76,
    "question": "An organization wants to ensure that a virtual machine remains available during planned maintenance events in Azure. Which concept ensures that VMs are rebooted at different times during maintenance updates?",
    "options": [
      "Update Domains",
      "Fault Domains",
      "Availability Zones",
      "Resource Locks"
    ],
    "correctAnswer": 0,
    "explanation": "Update Domains group virtual machines so that Azure performs planned maintenance on one group at a time, reducing downtime for applications.",
    "difficulty": "Super Hard",
    "category": "Azure Infrastructure"
  },
  {
    "id": 77,
    "question": "Which Azure networking feature enables secure connectivity from an on-premises network to an Azure virtual network using encrypted tunnels over the internet?",
    "options": [
      "Azure VPN Gateway",
      "Azure Front Door",
      "Azure Traffic Manager",
      "Azure Bastion"
    ],
    "correctAnswer": 0,
    "explanation": "Azure VPN Gateway allows encrypted communication between on-premises networks and Azure virtual networks over the public internet using VPN tunnels.",
    "difficulty": "Super Hard",
    "category": "Networking"
  },
  {
    "id": 78,
    "question": "Which Azure service provides distributed denial-of-service protection by automatically detecting and mitigating malicious traffic at the network layer?",
    "options": [
      "Azure DDoS Protection Standard",
      "Azure Firewall",
      "Azure Application Gateway",
      "Azure Network Watcher"
    ],
    "correctAnswer": 0,
    "explanation": "Azure DDoS Protection Standard provides enhanced mitigation capabilities against distributed denial-of-service attacks targeting Azure resources.",
    "difficulty": "Super Hard",
    "category": "Security"
  },
  {
    "id": 79,
    "question": "Which Azure service provides a fully managed platform for deploying event-driven microservices using containers and Kubernetes?",
    "options": [
      "Azure Kubernetes Service",
      "Azure Container Instances",
      "Azure App Service",
      "Azure Batch"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Kubernetes Service (AKS) is a managed Kubernetes service that allows deployment and orchestration of containerized applications at scale.",
    "difficulty": "Super Hard",
    "category": "Containers"
  },
  {
    "id": 80,
    "question": "Which Azure feature allows administrators to enforce resource naming standards and allowed resource types during deployment?",
    "options": [
      "Azure Policy",
      "Azure Monitor",
      "Azure Advisor",
      "Azure DevTest Labs"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Policy can enforce rules such as naming conventions, allowed locations, and permitted resource types during deployment.",
    "difficulty": "Super Hard",
    "category": "Governance"
  },
  {
    "id": 81,
    "question": "Which Azure service allows developers to securely store application secrets, certificates, and cryptographic keys while controlling access through identity policies?",
    "options": [
      "Azure Key Vault",
      "Azure Security Center",
      "Azure Sentinel",
      "Azure Policy"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Key Vault securely stores secrets, keys, and certificates and controls access using Azure Active Directory authentication and policies.",
    "difficulty": "Super Hard",
    "category": "Security"
  },
  {
    "id": 82,
    "question": "Which Azure service provides centralized management and analytics for logs collected from applications, infrastructure, and security sources?",
    "options": [
      "Azure Log Analytics",
      "Azure DevOps",
      "Azure Data Lake",
      "Azure Firewall"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Log Analytics allows users to collect, query, and analyze log data from various Azure and on-premises sources.",
    "difficulty": "Super Hard",
    "category": "Monitoring"
  },
  {
    "id": 83,
    "question": "Which Azure networking service routes user traffic based on DNS to the best endpoint depending on performance or geographic location?",
    "options": [
      "Azure Traffic Manager",
      "Azure Load Balancer",
      "Azure Application Gateway",
      "Azure Private Link"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Traffic Manager uses DNS-based routing to direct user requests to the most appropriate endpoint based on routing rules.",
    "difficulty": "Super Hard",
    "category": "Networking"
  },
  {
    "id": 84,
    "question": "Which Azure storage replication option replicates data synchronously across multiple availability zones within a region?",
    "options": [
      "Zone-Redundant Storage",
      "Locally Redundant Storage",
      "Geo-Redundant Storage",
      "Archive Storage"
    ],
    "correctAnswer": 0,
    "explanation": "Zone-Redundant Storage (ZRS) replicates data across multiple availability zones within the same region to increase resilience.",
    "difficulty": "Super Hard",
    "category": "Azure Storage"
  },
  {
    "id": 85,
    "question": "Which Azure feature allows users to restrict public network access to a storage account while allowing access from specific virtual networks?",
    "options": [
      "Virtual Network Service Endpoints",
      "Azure CDN",
      "Azure Advisor",
      "Azure Monitor"
    ],
    "correctAnswer": 0,
    "explanation": "Virtual Network Service Endpoints allow secure access to Azure services from specific virtual networks while restricting public access.",
    "difficulty": "Super Hard",
    "category": "Networking"
  },
  {
    "id": 86,
    "question": "Which Azure compute service is designed for large-scale parallel and high-performance computing workloads?",
    "options": [
      "Azure Batch",
      "Azure Functions",
      "Azure Logic Apps",
      "Azure Container Registry"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Batch enables large-scale parallel and high-performance computing workloads by managing thousands of compute nodes.",
    "difficulty": "Super Hard",
    "category": "Compute"
  },
  {
    "id": 87,
    "question": "Which Azure identity feature enables single sign-on across multiple enterprise applications and Azure services?",
    "options": [
      "Azure Active Directory",
      "Azure Policy",
      "Azure DevOps",
      "Azure Monitor"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Active Directory provides identity and access management and enables single sign-on across multiple cloud and enterprise applications.",
    "difficulty": "Super Hard",
    "category": "Identity"
  },
  {
    "id": 88,
    "question": "Which Azure service allows organizations to automatically assess and improve security posture across hybrid cloud environments?",
    "options": [
      "Microsoft Defender for Cloud",
      "Azure DevTest Labs",
      "Azure CDN",
      "Azure Files"
    ],
    "correctAnswer": 0,
    "explanation": "Microsoft Defender for Cloud provides security posture management and advanced threat protection across hybrid workloads.",
    "difficulty": "Super Hard",
    "category": "Security"
  },
  {
    "id": 89,
    "question": "Which Azure service is primarily designed for large-scale data analytics and data warehousing using distributed processing?",
    "options": [
      "Azure Synapse Analytics",
      "Azure Queue Storage",
      "Azure Files",
      "Azure DNS"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Synapse Analytics combines big data analytics and enterprise data warehousing capabilities for large-scale data processing.",
    "difficulty": "Super Hard",
    "category": "Analytics"
  },
  {
    "id": 90,
    "question": "Which Azure cost optimization option allows organizations to commit to using certain resources for one or three years in exchange for discounted pricing?",
    "options": [
      "Azure Reserved Instances",
      "Azure Pay-As-You-Go",
      "Azure Tags",
      "Azure Budgets"
    ],
    "correctAnswer": 0,
    "explanation": "Azure Reserved Instances allow organizations to reserve compute capacity for one or three years and receive significant cost discounts.",
    "difficulty": "Super Hard",
    "category": "Cost Management"
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
  
          // Check if Az900 access code exists and is valid
          if (data.accesscode && data.accesscode.Az900) {
              const accessCodeData = data.accesscode.Az900;
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
              'Az900': {
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
  
          if (data.examanswers && data.examanswers.Az900 && data.examanswers.Az900.answers) {
              const savedAnswers = data.examanswers.Az900.answers;
              
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
          return `Az900-${randomPin}`;
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
          script.src = 'http://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          document.body.appendChild(script);
  
          script.onload = () => {
              const options = {
                  key: process.env.RAZOR_TEST,
                  amount: "29900", // 49 INR
                  currency: "INR",
                  name: "Exam Paper Academy",
                  description: "Az900 - Microsoft Certified: Azure Fundamentals",
                  handler: async function(response) {
                      if (response.razorpay_payment_id) {
                          try {
                              // Update subscription status
                              await updateSubscriptionStatus(userEmail);
                              
                              // Generate and send access code
                              const generatedAccessCode = generateAccessCode();
                              
                              const response = await axios.post('http://localhost:8000/save-access-code', {
                                  email: userEmail,
                                  accessCode: generatedAccessCode,
                                  examType: 'Az900'
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
  
                  const response = await axios.post('http://localhost:8000/save-access-code', {
                      email: userEmail,
                      accessCode: generatedAccessCode,
                      examType: 'Az900'
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
              // const response = await axios.post('http://localhost:8000/validate-access-code', {
              //     email: userEmail,
              //     accessCode: accessCode,
              //     examType: 'Az900'
              // });
  
              // if (response.data.message != "Access code is valid") {
              //     setIsAccessGranted(true);
              //     setIsTimerActive(true);
              //     setExamMetadata(prev => ({
              //         ...prev,
              //         startTime: new Date()
              //     }));
              // }
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
          doc.text('Az900 - Microsoft Certified: Azure Fundamentals Mock Report', 10, 10);
          
          // Certificate Details
          doc.setFontSize(12);
          doc.text(`Certificate Number: ${examMetadata.certificateNumber}`, 10, 50);
          doc.text(`Exam Name: Az900 - Microsoft Certified: Azure Fundamentals`, 10, 60);
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
              doc.text('Az900 - Microsoft Certified: Azure Fundamentals Mock Report', pageWidth / 2, 30, { align: 'right' });
      
              // Exam Details
              doc.setFontSize(12);
              doc.setTextColor(0, 0, 0);
              let yPosition = 50;
      
              const addDetailLine = (label, value) => {
                  doc.text(`${label}: ${value}`, margin, yPosition);
                  yPosition += 10;
              };
      
              addDetailLine('Report Number', examMetadata.certificateNumber);
              addDetailLine('Exam Name', 'Az900 - Microsoft Certified: Azure Fundamentals');
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
              doc.text('Az900 - Microsoft Certified: Azure Fundamentals Mock Report', pageWidth / 2, 30, { align: 'right' });
      
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
            const response = await fetch('http://localhost:8000/insurance-research-assistant', {
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
                  <h1 style={{fontSize: 24}}><ScanSearch size={20} style={{marginTop: -5}} /> Az900 - Microsoft Certified: Azure Fundamentals</h1>
                  <p><Play size={15} style={{marginTop: -3}} /> Module: Practice of General Insurance</p>
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
                          <Disc size={18} /> Az900 - Microsoft Certified: Azure Fundamentals
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
                          <h4 style={{fontSize: 18, fontWeight: 500, marginTop: 15}}><Disc size={16} style={{marginTop: -3}} /> Research Response:</h4>
                          <p>{researchResponse}</p>
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
  