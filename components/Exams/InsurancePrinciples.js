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


export default function InsurancePrinciples() {
    const questions = [
        {
          id: 1,
          question: "What is the primary purpose of insurance?",
          options: [
            "To make profit",
            "To transfer risk",
            "To invest money",
            "To create employment"
          ],
          correctAnswer: 1,
          explanation: "Insurance primarily serves to transfer risk from an individual or entity to an insurance company in exchange for a premium.",
          difficulty: "Easy",
          category: "Insurance Basics"
        },
        {
          id: 2,
          question: "What is the principle of utmost good faith in insurance?",
          options: [
            "Hiding important information",
            "Complete disclosure of material facts",
            "Minimal communication with insurer",
            "Paying extra premium"
          ],
          correctAnswer: 1,
          explanation: "Utmost good faith requires both the insurer and the insured to disclose all material facts honestly and completely.",
          difficulty: "Easy",
          category: "Legal Principles"
        },
        {
          id: 3,
          question: "Which principle states that the insured should not profit from an insurance claim?",
          options: [
            "Indemnity",
            "Subrogation",
            "Insurable Interest",
            "Contribution"
          ],
          correctAnswer: 0,
          explanation: "The principle of indemnity ensures that the insured is compensated only for the actual financial loss incurred.",
          difficulty: "Easy",
          category: "Claims Management"
        },
        {
          id: 4,
          question: "What is insurable interest in insurance?",
          options: [
            "A financial stake in the subject matter",
            "A desire to obtain insurance",
            "A legal requirement for buying insurance",
            "A condition for getting discounts"
          ],
          correctAnswer: 0,
          explanation: "Insurable interest means the insured must have a financial stake in the subject matter of the insurance policy.",
          difficulty: "Easy",
          category: "Legal Principles"
        },
        {
          id: 5,
          question: "Which principle allows an insurer to recover claim payments from a third party responsible for the loss?",
          options: [
            "Contribution",
            "Subrogation",
            "Proximate Cause",
            "Indemnity"
          ],
          correctAnswer: 1,
          explanation: "The principle of subrogation allows the insurer to claim reimbursement from the third party responsible for the loss.",
          difficulty: "Easy",
          category: "Claims Management"
        },
        {
          id: 6,
          question: "Which term refers to the amount an insured pays for insurance coverage?",
          options: [
            "Premium",
            "Deductible",
            "Sum Insured",
            "Claim Amount"
          ],
          correctAnswer: 0,
          explanation: "A premium is the amount paid by the insured to the insurer for coverage under the insurance policy.",
          difficulty: "Easy",
          category: "Insurance Basics"
        },
        {
          id: 7,
          question: "Which principle prevents multiple recoveries from different insurers for the same loss?",
          options: [
            "Utmost Good Faith",
            "Contribution",
            "Subrogation",
            "Proximate Cause"
          ],
          correctAnswer: 1,
          explanation: "The principle of contribution prevents the insured from claiming more than the actual loss if multiple insurers are involved.",
          difficulty: "Easy",
          category: "Legal Principles"
        },
        {
          id: 8,
          question: "What is the term for the maximum amount an insurer will pay for a covered loss?",
          options: [
            "Premium",
            "Deductible",
            "Sum Insured",
            "Claim Settlement"
          ],
          correctAnswer: 2,
          explanation: "The sum insured is the maximum amount the insurer will pay in case of a claim.",
          difficulty: "Easy",
          category: "Insurance Basics"
        },
        {
          id: 9,
          question: "Which principle determines the immediate cause of a loss in insurance?",
          options: [
            "Indemnity",
            "Proximate Cause",
            "Subrogation",
            "Contribution"
          ],
          correctAnswer: 1,
          explanation: "Proximate cause helps in identifying the immediate, effective cause of the loss to determine coverage.",
          difficulty: "Easy",
          category: "Claims Management"
        },
        {
          id: 10,
          question: "Which type of insurance covers financial losses due to theft, fraud, or dishonesty?",
          options: [
            "Life Insurance",
            "Fire Insurance",
            "Fidelity Insurance",
            "Marine Insurance"
          ],
          correctAnswer: 2,
          explanation: "Fidelity insurance protects against losses due to theft, fraud, or dishonesty of employees.",
          difficulty: "Easy",
          category: "Insurance Types"
        },
        {
          id: 11,
          question: "What is the period during which an insurance policy remains valid?",
          options: [
            "Coverage Term",
            "Grace Period",
            "Free Look Period",
            "Cooling-off Period"
          ],
          correctAnswer: 0,
          explanation: "The coverage term is the duration for which the insurance policy remains active.",
          difficulty: "Easy",
          category: "Policy Terms"
        },
        {
          id: 12,
          question: "What is the waiting period in health insurance?",
          options: [
            "The time before coverage starts",
            "The time between policy renewal",
            "The period before a claim is paid",
            "The policy lapse period"
          ],
          correctAnswer: 0,
          explanation: "The waiting period is the initial time during which claims are not accepted for certain conditions.",
          difficulty: "Easy",
          category: "Health Insurance"
        },
        {
          id: 13,
          question: "Which type of insurance is compulsory for motor vehicles in India?",
          options: [
            "Comprehensive Insurance",
            "Third-party Insurance",
            "Fire Insurance",
            "Life Insurance"
          ],
          correctAnswer: 1,
          explanation: "Third-party motor insurance is mandatory in India to cover liabilities for damages to third parties.",
          difficulty: "Easy",
          category: "Motor Insurance"
        },
        {
          id: 14,
          question: "What is reinsurance?",
          options: [
            "Insurance for high-risk individuals",
            "Insurance purchased by insurers",
            "Government-backed insurance",
            "A form of fraud prevention"
          ],
          correctAnswer: 1,
          explanation: "Reinsurance is insurance taken by insurers to protect themselves from large claims.",
          difficulty: "Easy",
          category: "Insurance Industry"
        },
        {
          id: 15,
          question: "What is a deductible in insurance?",
          options: [
            "A refund from the insurer",
            "A discount on premiums",
            "An amount the policyholder pays before insurance kicks in",
            "The total claim amount"
          ],
          correctAnswer: 2,
          explanation: "A deductible is the portion of a loss that the insured must pay before the insurance coverage applies.",
          difficulty: "Easy",
          category: "Insurance Basics"
        },
        {
            id: 16,
            question: "Which principle states that the insurer should restore the insured to the same financial position as before the loss?",
            options: [
              "Indemnity",
              "Contribution",
              "Subrogation",
              "Utmost Good Faith"
            ],
            correctAnswer: 0,
            explanation: "The principle of indemnity ensures that the insured is compensated only for the actual loss suffered, not to make a profit.",
            difficulty: "Easy",
            category: "Insurance Principles"
          },
          {
            id: 17,
            question: "What is a claim in insurance?",
            options: [
              "A request for coverage by an insured",
              "A contract between insurer and insured",
              "An amount paid as a premium",
              "A legal dispute with an insurer"
            ],
            correctAnswer: 0,
            explanation: "A claim is a formal request made by an insured person to an insurer for compensation for a covered loss.",
            difficulty: "Easy",
            category: "Claims Management"
          },
          {
            id: 18,
            question: "Which insurance type provides financial security to a family in case of the policyholder's death?",
            options: [
              "Health Insurance",
              "Car Insurance",
              "Life Insurance",
              "Marine Insurance"
            ],
            correctAnswer: 2,
            explanation: "Life insurance provides financial support to the policyholder’s family in case of death.",
            difficulty: "Easy",
            category: "Insurance Types"
          },
          {
            id: 19,
            question: "What is the grace period in insurance?",
            options: [
              "Time before policy activation",
              "Extra time to pay a missed premium",
              "Waiting period for claims",
              "Duration of policy coverage"
            ],
            correctAnswer: 1,
            explanation: "The grace period allows policyholders to pay their premium after the due date without losing coverage.",
            difficulty: "Easy",
            category: "Policy Terms"
          },
          {
            id: 20,
            question: "Which factor affects the cost of an insurance premium?",
            options: [
              "Age of the insured",
              "Policyholder's income",
              "Number of claims the insurer received",
              "Government tax rates"
            ],
            correctAnswer: 0,
            explanation: "Factors like age, health, and risk level of the insured impact insurance premium costs.",
            difficulty: "Easy",
            category: "Insurance Basics"
          },
          {
            id: 21,
            question: "What is the free-look period in insurance?",
            options: [
              "Time to evaluate and cancel a policy",
              "Duration of insurance coverage",
              "Waiting period for a claim",
              "Grace period for premium payment"
            ],
            correctAnswer: 0,
            explanation: "The free-look period allows the policyholder to cancel the policy within a specified time and receive a refund.",
            difficulty: "Easy",
            category: "Policy Terms"
          },
          {
            id: 22,
            question: "Which insurance type covers businesses against financial losses due to unforeseen events?",
            options: [
              "Marine Insurance",
              "Business Insurance",
              "Health Insurance",
              "Fire Insurance"
            ],
            correctAnswer: 1,
            explanation: "Business insurance helps protect companies against financial risks and losses due to unforeseen events.",
            difficulty: "Easy",
            category: "Insurance Types"
          },
          {
            id: 23,
            question: "What is the role of an insurance agent?",
            options: [
              "Provide legal advice to policyholders",
              "Sell and service insurance policies",
              "Investigate fraudulent claims",
              "Approve insurance claims"
            ],
            correctAnswer: 1,
            explanation: "An insurance agent sells policies and helps customers with their insurance needs.",
            difficulty: "Easy",
            category: "Insurance Industry"
          },
          {
            id: 24,
            question: "Which insurance covers losses due to fire-related damage?",
            options: [
              "Motor Insurance",
              "Health Insurance",
              "Fire Insurance",
              "Life Insurance"
            ],
            correctAnswer: 2,
            explanation: "Fire insurance provides coverage for damages caused by fire-related incidents.",
            difficulty: "Easy",
            category: "Insurance Types"
          },
          {
            id: 25,
            question: "What is a nominee in an insurance policy?",
            options: [
              "A third-party insurer",
              "A person designated to receive benefits",
              "An insurance company representative",
              "A premium discount option"
            ],
            correctAnswer: 1,
            explanation: "A nominee is the person designated by the policyholder to receive insurance benefits in case of the insured’s death.",
            difficulty: "Easy",
            category: "Policy Terms"
          },
          {
            id: 26,
            question: "Which factor is NOT considered when determining life insurance premiums?",
            options: [
              "Age of the insured",
              "Health condition",
              "Annual income of the insured",
              "Vehicle type owned"
            ],
            correctAnswer: 3,
            explanation: "Vehicle type owned is not a determining factor for life insurance premiums.",
            difficulty: "Easy",
            category: "Insurance Basics"
          },
          {
            id: 27,
            question: "Which insurance type covers goods transported over water?",
            options: [
              "Fire Insurance",
              "Marine Insurance",
              "Life Insurance",
              "Health Insurance"
            ],
            correctAnswer: 1,
            explanation: "Marine insurance provides coverage for goods transported via waterways.",
            difficulty: "Easy",
            category: "Insurance Types"
          },
          {
            id: 28,
            question: "What is a policyholder?",
            options: [
              "An insurance agent",
              "A person who buys an insurance policy",
              "A company that provides insurance",
              "A claim investigator"
            ],
            correctAnswer: 1,
            explanation: "A policyholder is a person who purchases an insurance policy and is entitled to its benefits.",
            difficulty: "Easy",
            category: "Insurance Basics"
          },
          {
            id: 29,
            question: "Which document provides details of the terms and conditions of an insurance policy?",
            options: [
              "Insurance claim form",
              "Policy document",
              "Premium receipt",
              "Medical certificate"
            ],
            correctAnswer: 1,
            explanation: "A policy document contains all the terms, conditions, and coverage details of an insurance policy.",
            difficulty: "Easy",
            category: "Policy Terms"
          },
          {
            id: 30,
            question: "What is the sum assured in life insurance?",
            options: [
              "The actual claim amount",
              "The total premium paid",
              "The guaranteed amount payable on death or maturity",
              "The commission paid to agents"
            ],
            correctAnswer: 2,
            explanation: "The sum assured is the fixed amount that the insurer agrees to pay in case of the insured's death or policy maturity.",
            difficulty: "Easy",
            category: "Life Insurance"
          },
          {
            id: 31,
            question: "Which principle in insurance ensures that the insurer takes the rights of the insured after compensation?",
            options: [
              "Contribution",
              "Indemnity",
              "Subrogation",
              "Proximate Cause"
            ],
            correctAnswer: 2,
            explanation: "The principle of subrogation allows the insurer to take the rights of the insured to recover losses from a third party after compensation.",
            difficulty: "Medium",
            category: "Legal Principles"
          },
          {
            id: 32,
            question: "In insurance, what does the term 'moral hazard' refer to?",
            options: [
              "The risk of dishonest behavior by the insured",
              "The likelihood of natural disasters",
              "An increase in market risks",
              "The probability of accidents happening"
            ],
            correctAnswer: 0,
            explanation: "Moral hazard refers to the risk that the insured may act recklessly or dishonestly because they are covered by insurance.",
            difficulty: "Medium",
            category: "Risk Management"
          },
          {
            id: 33,
            question: "What is the primary reason for an insurer to include an exclusion clause in a policy?",
            options: [
              "To limit the number of claims filed",
              "To increase premium collections",
              "To clarify risks not covered",
              "To make policies complex"
            ],
            correctAnswer: 2,
            explanation: "Exclusion clauses are added to policies to define risks that are not covered under the contract.",
            difficulty: "Medium",
            category: "Policy Terms"
          },
          {
            id: 34,
            question: "Which insurance principle ensures that an insured does not profit from an insurance claim?",
            options: [
              "Subrogation",
              "Indemnity",
              "Utmost Good Faith",
              "Contribution"
            ],
            correctAnswer: 1,
            explanation: "Indemnity ensures that the insured is only compensated for the actual loss and does not profit from the claim.",
            difficulty: "Medium",
            category: "Insurance Principles"
          },
          {
            id: 35,
            question: "What is the purpose of the insurable interest principle?",
            options: [
              "To prevent fraud and gambling in insurance",
              "To maximize insurance profits",
              "To allow multiple policies for the same risk",
              "To ensure all claims are settled quickly"
            ],
            correctAnswer: 0,
            explanation: "The principle of insurable interest ensures that the insured has a legitimate financial stake in the subject matter of the insurance.",
            difficulty: "Medium",
            category: "Legal Principles"
          },
          {
            id: 36,
            question: "What is the significance of the principle of contribution in insurance?",
            options: [
              "It allows multiple claims on the same risk",
              "It prevents the insured from receiving excess compensation",
              "It guarantees full payment of a claim",
              "It determines the premium amount"
            ],
            correctAnswer: 1,
            explanation: "The principle of contribution ensures that if multiple insurers cover the same risk, each insurer contributes proportionally to the claim.",
            difficulty: "Medium",
            category: "Insurance Principles"
          },
          {
            id: 37,
            question: "Which factor is typically NOT used to calculate life insurance premiums?",
            options: [
              "Age of the insured",
              "Medical history",
              "Marital status",
              "Occupation"
            ],
            correctAnswer: 2,
            explanation: "Marital status is generally not a direct factor in life insurance premium calculation, while age, medical history, and occupation are.",
            difficulty: "Medium",
            category: "Insurance Basics"
          },
          {
            id: 38,
            question: "What does a reinstatement clause in an insurance policy allow?",
            options: [
              "The policyholder to reinstate a lapsed policy under certain conditions",
              "An increase in premium rates",
              "A new policy to be issued automatically",
              "The insurer to cancel the policy at any time"
            ],
            correctAnswer: 0,
            explanation: "A reinstatement clause allows the policyholder to restore a lapsed policy if they meet the insurer’s conditions.",
            difficulty: "Medium",
            category: "Policy Terms"
          },
          {
            id: 39,
            question: "Which type of insurance policy provides coverage for a specific period and does not build cash value?",
            options: [
              "Whole Life Insurance",
              "Endowment Policy",
              "Term Insurance",
              "Universal Life Insurance"
            ],
            correctAnswer: 2,
            explanation: "Term insurance provides coverage for a fixed period and does not have a cash value component.",
            difficulty: "Medium",
            category: "Insurance Types"
          },
          {
            id: 40,
            question: "What does the term 'underwriting' mean in the insurance industry?",
            options: [
              "The process of rejecting claims",
              "The assessment of risk and policy pricing",
              "The act of selling insurance policies",
              "The process of claim settlement"
            ],
            correctAnswer: 1,
            explanation: "Underwriting involves evaluating risk and determining appropriate premiums for insurance policies.",
            difficulty: "Medium",
            category: "Insurance Industry"
          },
          {
            id: 41,
            question: "What is the role of a reinsurance company?",
            options: [
              "To insure policyholders directly",
              "To provide financial backing to insurance companies",
              "To process claims faster",
              "To increase the cost of insurance policies"
            ],
            correctAnswer: 1,
            explanation: "A reinsurance company provides financial protection to primary insurers by sharing their risks.",
            difficulty: "Medium",
            category: "Insurance Industry"
          },
          {
            id: 42,
            question: "What does an insurance deductible represent?",
            options: [
              "The amount the insurer pays before coverage begins",
              "The portion of the claim the insured must pay before the insurer covers the rest",
              "The total claim amount paid by the insurer",
              "The amount refunded to the policyholder"
            ],
            correctAnswer: 1,
            explanation: "A deductible is the amount the policyholder must pay out-of-pocket before the insurer covers the remaining claim.",
            difficulty: "Medium",
            category: "Policy Terms"
          },
          {
            id: 43,
            question: "In insurance, what does the term 'endorsement' refer to?",
            options: [
              "A clause that extends or modifies coverage",
              "A recommendation from an insurance agent",
              "A refund on the premium paid",
              "A penalty for late premium payment"
            ],
            correctAnswer: 0,
            explanation: "An endorsement is an amendment to the insurance policy that alters coverage terms.",
            difficulty: "Medium",
            category: "Policy Terms"
          },
          {
            id: 44,
            question: "Which entity regulates insurance companies in India?",
            options: [
              "Reserve Bank of India (RBI)",
              "Securities and Exchange Board of India (SEBI)",
              "Insurance Regulatory and Development Authority of India (IRDAI)",
              "Ministry of Finance"
            ],
            correctAnswer: 2,
            explanation: "IRDAI is responsible for regulating and supervising insurance companies in India.",
            difficulty: "Medium",
            category: "Regulatory Bodies"
          },
          {
            id: 45,
            question: "What is a 'co-pay' in health insurance?",
            options: [
              "The full claim amount paid by the insurer",
              "A fixed amount the insured must pay for specific services",
              "The total premium amount",
              "An additional tax on insurance policies"
            ],
            correctAnswer: 1,
            explanation: "A co-pay is a fixed amount the insured pays for certain healthcare services before the insurer covers the rest.",
            difficulty: "Medium",
            category: "Health Insurance"
          },
          {
            id: 46,
            question: "Which type of insurance covers financial losses due to dishonesty by employees?",
            options: [
              "Liability Insurance",
              "Fidelity Insurance",
              "Property Insurance",
              "Health Insurance"
            ],
            correctAnswer: 1,
            explanation: "Fidelity insurance protects businesses against financial losses caused by fraudulent or dishonest acts of employees.",
            difficulty: "Medium",
            category: "Insurance Types"
          },
          {
            id: 47,
            question: "What does 'peril' mean in an insurance policy?",
            options: [
              "A condition that increases risk",
              "The premium amount paid",
              "A specific risk or cause of loss",
              "A clause in the policy contract"
            ],
            correctAnswer: 2,
            explanation: "A peril is a specific event or risk that causes a loss, such as fire, theft, or natural disaster.",
            difficulty: "Medium",
            category: "Risk Management"
          },
          {
            id: 48,
            question: "Which principle of insurance is used when multiple policies cover the same loss and insurers share the claim proportionally?",
            options: [
              "Indemnity",
              "Subrogation",
              "Contribution",
              "Proximate Cause"
            ],
            correctAnswer: 2,
            explanation: "The principle of contribution ensures that if multiple insurers cover the same risk, each pays a proportional share of the claim.",
            difficulty: "Medium",
            category: "Insurance Principles"
          },
          {
            id: 49,
            question: "Which document serves as evidence of the insurance contract between the insurer and the insured?",
            options: [
              "Proposal Form",
              "Claim Form",
              "Insurance Policy",
              "Premium Receipt"
            ],
            correctAnswer: 2,
            explanation: "An insurance policy is the legal document that serves as proof of the agreement between the insurer and the insured.",
            difficulty: "Medium",
            category: "Policy Terms"
          },
          {
            id: 50,
            question: "What is the key difference between a 'named peril' and an 'all-risk' insurance policy?",
            options: [
              "Named peril covers all risks, while all-risk covers specific perils",
              "Named peril covers specific risks listed in the policy, while all-risk covers all except exclusions",
              "All-risk policies require lower premiums than named peril policies",
              "There is no difference; both provide the same coverage"
            ],
            correctAnswer: 1,
            explanation: "A named peril policy covers only risks explicitly mentioned in the contract, whereas an all-risk policy covers all risks except those specifically excluded.",
            difficulty: "Medium",
            category: "Policy Coverage"
          },
          {
            id: 51,
            question: "Which of the following is NOT considered an insurable risk?",
            options: [
              "A factory's machinery breakdown",
              "A person's gambling loss",
              "A home damaged by a fire",
              "A company's loss due to employee theft"
            ],
            correctAnswer: 1,
            explanation: "Gambling losses are speculative risks and are not insurable, unlike property or financial risks.",
            difficulty: "Medium",
            category: "Risk Management"
          },
          {
            id: 52,
            question: "Which of the following is NOT a function of an insurance agent?",
            options: [
              "Selling insurance policies",
              "Underwriting risks",
              "Collecting premiums",
              "Providing policy information to customers"
            ],
            correctAnswer: 1,
            explanation: "Underwriting is the responsibility of the insurer, while agents are primarily responsible for sales and client interactions.",
            difficulty: "Medium",
            category: "Insurance Industry"
          },
          {
            id: 53,
            question: "Which type of insurance policy is designed to provide periodic payments to the insured after retirement?",
            options: [
              "Endowment Policy",
              "Whole Life Insurance",
              "Annuity Policy",
              "Term Insurance"
            ],
            correctAnswer: 2,
            explanation: "An annuity policy provides regular payments to the policyholder after retirement, ensuring financial stability.",
            difficulty: "Medium",
            category: "Insurance Types"
          },
          {
            id: 54,
            question: "What is the purpose of an 'exclusion clause' in an insurance policy?",
            options: [
              "To increase the scope of coverage",
              "To specify risks that are NOT covered",
              "To reduce the premium amount",
              "To extend the policy term"
            ],
            correctAnswer: 1,
            explanation: "Exclusion clauses define specific risks or conditions that are not covered by the insurance policy.",
            difficulty: "Medium",
            category: "Policy Terms"
          },
          {
            id: 55,
            question: "What is 'pro rata' in insurance?",
            options: [
              "A method of premium calculation based on coverage duration",
              "A type of insurance fraud",
              "A claim settlement process",
              "A mandatory co-payment clause"
            ],
            correctAnswer: 0,
            explanation: "Pro rata refers to adjusting premium or coverage based on the time or proportion of risk exposure.",
            difficulty: "Medium",
            category: "Premium Calculation"
          },
          {
            id: 56,
            question: "In liability insurance, what does 'third-party' refer to?",
            options: [
              "The insured",
              "The insurer",
              "Any person affected by the insured’s actions",
              "The insurance regulator"
            ],
            correctAnswer: 2,
            explanation: "In liability insurance, a third party is any individual or entity affected by the insured’s actions.",
            difficulty: "Medium",
            category: "Liability Insurance"
          },
          {
            id: 57,
            question: "Which type of life insurance provides coverage for a specific period but does not have a cash value?",
            options: [
              "Whole Life Insurance",
              "Endowment Policy",
              "Universal Life Insurance",
              "Term Life Insurance"
            ],
            correctAnswer: 3,
            explanation: "Term life insurance provides coverage for a fixed period without building a cash value.",
            difficulty: "Medium",
            category: "Life Insurance"
          },
          {
            id: 58,
            question: "What happens when an insurance policy lapses?",
            options: [
              "Coverage continues for 30 days",
              "The policyholder is refunded the premium",
              "Coverage is terminated due to non-payment of premiums",
              "The insurer pays the sum assured"
            ],
            correctAnswer: 2,
            explanation: "A lapsed policy means that coverage is no longer active because the policyholder did not pay the required premium.",
            difficulty: "Medium",
            category: "Policy Terms"
          },
          {
            id: 59,
            question: "What is the main benefit of reinsurance for an insurance company?",
            options: [
              "Reducing financial risk exposure",
              "Lowering premium rates for policyholders",
              "Providing direct insurance to customers",
              "Eliminating the need for underwriting"
            ],
            correctAnswer: 0,
            explanation: "Reinsurance helps insurers manage risk by transferring a portion of liabilities to another insurance company.",
            difficulty: "Medium",
            category: "Reinsurance"
          },
          {
            id: 60,
            question: "Which of the following is a key characteristic of insurance contracts?",
            options: [
              "They are wagering contracts",
              "They require utmost good faith",
              "They guarantee profit for the insured",
              "They are not legally binding"
            ],
            correctAnswer: 1,
            explanation: "Insurance contracts are based on the principle of utmost good faith, requiring honesty from both parties.",
            difficulty: "Medium",
            category: "Legal Principles"
          },
          {
            id: 61,
            question: "Which legal principle allows an insurer to step into the shoes of the insured to recover losses from a third party?",
            options: [
              "Indemnity",
              "Subrogation",
              "Contribution",
              "Proximate Cause"
            ],
            correctAnswer: 1,
            explanation: "Subrogation allows the insurer to recover losses from a responsible third party after paying the claim.",
            difficulty: "Hard",
            category: "Legal Principles"
          },
          {
            id: 62,
            question: "What is the primary purpose of reinsurance treaties?",
            options: [
              "To reduce operational costs",
              "To increase customer retention",
              "To spread risk among insurers",
              "To avoid paying large claims"
            ],
            correctAnswer: 2,
            explanation: "Reinsurance treaties are agreements that help spread risks among multiple insurers to avoid financial strain from large claims.",
            difficulty: "Hard",
            category: "Reinsurance"
          },
          {
            id: 63,
            question: "Which type of insurance covers losses due to forgery and counterfeit currency?",
            options: [
              "Liability Insurance",
              "Crime Insurance",
              "Fidelity Guarantee Insurance",
              "Property Insurance"
            ],
            correctAnswer: 1,
            explanation: "Crime insurance protects against losses from forgery, counterfeit currency, and employee fraud.",
            difficulty: "Hard",
            category: "Specialized Insurance"
          },
          {
            id: 64,
            question: "Which factor is NOT typically considered in life insurance underwriting?",
            options: [
              "Age",
              "Medical history",
              "Occupation",
              "Personal investments"
            ],
            correctAnswer: 3,
            explanation: "Personal investments are not a factor in life insurance underwriting, while age, health, and occupation impact risk assessment.",
            difficulty: "Hard",
            category: "Underwriting"
          },
          {
            id: 65,
            question: "What does 'moral hazard' refer to in insurance?",
            options: [
              "The probability of a natural disaster",
              "A situation where an insured takes more risks due to coverage",
              "The process of claim settlement",
              "The impact of inflation on insurance policies"
            ],
            correctAnswer: 1,
            explanation: "Moral hazard occurs when an insured person takes higher risks because they know they are covered by insurance.",
            difficulty: "Hard",
            category: "Risk Management"
          },
          {
            id: 66,
            question: "Which principle states that an insured should not benefit financially from a loss?",
            options: [
              "Contribution",
              "Insurable Interest",
              "Indemnity",
              "Subrogation"
            ],
            correctAnswer: 2,
            explanation: "The principle of indemnity ensures that insurance restores the insured's financial position without profit.",
            difficulty: "Hard",
            category: "Insurance Principles"
          },
          {
            id: 67,
            question: "Which act regulates the insurance industry in India?",
            options: [
              "Banking Regulation Act",
              "Insurance Act, 1938",
              "SEBI Act",
              "Contract Act, 1872"
            ],
            correctAnswer: 1,
            explanation: "The Insurance Act, 1938, governs the insurance sector in India, providing regulations for the industry.",
            difficulty: "Hard",
            category: "Insurance Regulations"
          },
          {
            id: 68,
            question: "What is the primary purpose of the 'Coinsurance Clause' in an insurance policy?",
            options: [
              "To reduce premiums by sharing risks between insurer and insured",
              "To eliminate fraud in claims processing",
              "To determine the policyholder's financial capacity",
              "To increase the sum assured on policies"
            ],
            correctAnswer: 0,
            explanation: "Coinsurance requires the insured to bear a portion of losses, ensuring they have a stake in risk management.",
            difficulty: "Hard",
            category: "Policy Provisions"
          },
          {
            id: 69,
            question: "What does 'proximate cause' refer to in claim settlement?",
            options: [
              "The most significant cause of loss leading to a claim",
              "The time frame in which a claim must be filed",
              "The policyholder's financial situation",
              "A minor contributing factor to an insurance claim"
            ],
            correctAnswer: 0,
            explanation: "Proximate cause is the dominant reason for a loss, determining whether a claim is valid.",
            difficulty: "Hard",
            category: "Claims Management"
          },
          {
            id: 70,
            question: "Which of the following is NOT an insurable risk?",
            options: [
              "Property damage from a fire",
              "Speculative business losses",
              "Health insurance for employees",
              "Liability coverage for product defects"
            ],
            correctAnswer: 1,
            explanation: "Speculative risks, such as business losses, are not insurable since they involve potential gains as well.",
            difficulty: "Hard",
            category: "Risk Management"
          },
          {
            id: 71,
            question: "What is a 'non-forfeiture clause' in a life insurance policy?",
            options: [
              "A provision that allows policyholders to recover some benefits if they lapse on premium payments",
              "A requirement for mandatory renewals",
              "A clause that cancels a policy if the insured changes occupations",
              "A rule that ensures beneficiaries cannot contest claims"
            ],
            correctAnswer: 0,
            explanation: "Non-forfeiture clauses allow policyholders to receive some benefits even if they default on premiums.",
            difficulty: "Hard",
            category: "Life Insurance"
          },
          {
            id: 72,
            question: "Which factor affects an insurer’s solvency margin?",
            options: [
              "Premium collection rate",
              "Claim settlement speed",
              "Market competition",
              "Risk-based capital requirements"
            ],
            correctAnswer: 3,
            explanation: "Solvency margins depend on risk-based capital requirements to ensure an insurer has sufficient reserves.",
            difficulty: "Hard",
            category: "Financial Management"
          },
          {
            id: 73,
            question: "Which of the following is NOT a type of liability insurance?",
            options: [
              "Professional Indemnity",
              "Public Liability",
              "Product Liability",
              "Fire Insurance"
            ],
            correctAnswer: 3,
            explanation: "Fire insurance covers property damage, whereas liability insurance covers legal claims.",
            difficulty: "Hard",
            category: "Liability Insurance"
          },
          {
            id: 74,
            question: "What is the primary reason for risk pooling in insurance?",
            options: [
              "To diversify investment portfolios",
              "To spread risk among many policyholders",
              "To maximize profit for insurers",
              "To eliminate fraudulent claims"
            ],
            correctAnswer: 1,
            explanation: "Risk pooling allows insurers to spread losses over a large group of policyholders, reducing financial impact.",
            difficulty: "Hard",
            category: "Risk Management"
          },
          {
            id: 75,
            question: "What is 'retrocession' in reinsurance?",
            options: [
              "A clause that prevents double claims",
              "The process of transferring risk from one reinsurer to another",
              "A financial penalty for non-payment",
              "A way to cancel reinsurance contracts"
            ],
            correctAnswer: 1,
            explanation: "Retrocession occurs when a reinsurer transfers some of its assumed risk to another reinsurer.",
            difficulty: "Hard",
            category: "Reinsurance"
          },
          {
            id: 76,
            question: "What is the 'waiting period' in health insurance?",
            options: [
              "The time before an insured person can file a claim",
              "The duration of policy coverage",
              "The cooling-off period for policy cancellation",
              "The period between claim approval and payment"
            ],
            correctAnswer: 0,
            explanation: "The waiting period is the time an insured must wait before being eligible to claim benefits.",
            difficulty: "Hard",
            category: "Health Insurance"
          },
          {
            id: 77,
            question: "Which of the following best defines 'adverse selection' in insurance?",
            options: [
              "When insurers select only low-risk applicants",
              "When high-risk individuals are more likely to buy insurance",
              "When insurance companies reject all risky applicants",
              "When policyholders cancel policies after claims"
            ],
            correctAnswer: 1,
            explanation: "Adverse selection occurs when high-risk individuals are more likely to purchase insurance, potentially leading to financial losses for insurers.",
            difficulty: "Hard",
            category: "Risk Management"
          },
          {
            id: 78,
            question: "What is the primary function of an actuary in an insurance company?",
            options: [
              "Marketing insurance policies",
              "Calculating premium rates and risk assessment",
              "Processing claims for policyholders",
              "Managing investment portfolios"
            ],
            correctAnswer: 1,
            explanation: "Actuaries analyze data to assess risks and calculate appropriate premium rates.",
            difficulty: "Hard",
            category: "Actuarial Science"
          },
          {
            id: 79,
            question: "Which principle of insurance prevents an insured from making a profit from their loss?",
            options: [
              "Indemnity",
              "Subrogation",
              "Contribution",
              "Insurable Interest"
            ],
            correctAnswer: 0,
            explanation: "The principle of indemnity ensures that the insured is only compensated for actual losses, not for profit.",
            difficulty: "Hard",
            category: "Insurance Principles"
          },
          {
            id: 80,
            question: "What does the term 'loss ratio' in insurance refer to?",
            options: [
              "The ratio of claims paid to premiums earned",
              "The ratio of net profit to total revenue",
              "The ratio of total policies sold to claims processed",
              "The percentage of fraudulent claims identified"
            ],
            correctAnswer: 0,
            explanation: "Loss ratio is a key metric in insurance that measures the proportion of claims paid relative to premiums collected.",
            difficulty: "Hard",
            category: "Insurance Finance"
          },
          {
            id: 81,
            question: "Which of the following is NOT a method used by insurers to manage risk?",
            options: [
              "Risk avoidance",
              "Risk retention",
              "Risk transfer",
              "Risk elimination"
            ],
            correctAnswer: 3,
            explanation: "Risk can never be completely eliminated, but it can be managed through avoidance, retention, or transfer.",
            difficulty: "Hard",
            category: "Risk Management"
          },
          {
            id: 82,
            question: "What is the primary purpose of an 'endorsement' in an insurance policy?",
            options: [
              "To modify or add coverage to an existing policy",
              "To cancel an insurance policy",
              "To transfer a policy to another insurer",
              "To increase the premium amount"
            ],
            correctAnswer: 0,
            explanation: "An endorsement is an amendment that alters the terms or coverage of an insurance policy.",
            difficulty: "Hard",
            category: "Policy Provisions"
          },
          {
            id: 83,
            question: "Which financial ratio is most commonly used to assess the financial strength of an insurance company?",
            options: [
              "Debt-to-equity ratio",
              "Solvency ratio",
              "Gross profit margin",
              "Liquidity ratio"
            ],
            correctAnswer: 1,
            explanation: "The solvency ratio measures an insurer's ability to meet long-term liabilities and claims obligations.",
            difficulty: "Hard",
            category: "Financial Management"
          },
          {
            id: 84,
            question: "In insurance, what does 'moral hazard' refer to?",
            options: [
              "A policyholder's intentional risk-taking due to coverage",
              "An insurance company’s reluctance to pay claims",
              "The effect of inflation on insurance premiums",
              "An error in policy documentation"
            ],
            correctAnswer: 0,
            explanation: "Moral hazard occurs when an insured individual takes higher risks because they are covered by insurance.",
            difficulty: "Hard",
            category: "Risk Management"
          },
          {
            id: 85,
            question: "Which of the following best describes 'pro rata reinsurance'?",
            options: [
              "The insurer retains all risks without sharing with reinsurers",
              "Risks and premiums are shared proportionally between the insurer and reinsurer",
              "Claims are settled on a first-come, first-served basis",
              "Only large claims are ceded to the reinsurer"
            ],
            correctAnswer: 1,
            explanation: "Pro rata reinsurance involves sharing risks and premiums proportionally between the insurer and reinsurer.",
            difficulty: "Hard",
            category: "Reinsurance"
          },
          {
            id: 86,
            question: "Which term describes the practice of obtaining multiple insurance policies to claim more than the actual loss?",
            options: [
              "Underwriting",
              "Over-insurance",
              "Double indemnity",
              "Moral hazard"
            ],
            correctAnswer: 1,
            explanation: "Over-insurance occurs when the sum insured exceeds the actual value of the insured property, leading to the potential for fraudulent claims.",
            difficulty: "Hard",
            category: "Fraud Prevention"
          },
          {
            id: 87,
            question: "What is the primary role of the Insurance Regulatory and Development Authority of India (IRDAI)?",
            options: [
              "To regulate and promote the insurance industry",
              "To provide direct insurance services to customers",
              "To settle disputes between insurers and policyholders",
              "To determine premium rates for all policies"
            ],
            correctAnswer: 0,
            explanation: "The IRDAI regulates and promotes the insurance industry to protect policyholders' interests.",
            difficulty: "Hard",
            category: "Regulatory Framework"
          },
          {
            id: 88,
            question: "Which of the following is NOT a type of reinsurance?",
            options: [
              "Facultative reinsurance",
              "Excess of loss reinsurance",
              "Comprehensive reinsurance",
              "Quota share reinsurance"
            ],
            correctAnswer: 2,
            explanation: "Comprehensive reinsurance is not a standard type; reinsurance mainly consists of facultative, excess of loss, and quota share agreements.",
            difficulty: "Hard",
            category: "Reinsurance"
          },
          {
            id: 89,
            question: "In group insurance policies, what is the main advantage for employers?",
            options: [
              "Lower premiums due to risk pooling",
              "Guaranteed individual underwriting",
              "Increased administrative costs",
              "Higher claim settlement ratios"
            ],
            correctAnswer: 0,
            explanation: "Group insurance policies offer lower premiums as the risk is spread across multiple insured members.",
            difficulty: "Hard",
            category: "Group Insurance"
          },
          {
            id: 90,
            question: "What is the significance of the 'Loss Adjustment Expense' in insurance claims?",
            options: [
              "It refers to the legal costs of claim settlements",
              "It covers the expenses related to investigating and processing claims",
              "It is the amount deducted from a policyholder’s claim",
              "It represents the profit margin of the insurer"
            ],
            correctAnswer: 1,
            explanation: "Loss adjustment expenses include costs incurred by insurers while investigating and settling claims.",
            difficulty: "Hard",
            category: "Claims Management"
          },
          {
            id: 91,
            question: "What is the primary difference between a 'binder' and a 'policy' in insurance?",
            options: [
              "A binder provides temporary coverage before the final policy is issued",
              "A binder is a physical copy of an insurance contract",
              "A policy includes legal clauses, whereas a binder does not",
              "Binders are only used in reinsurance contracts"
            ],
            correctAnswer: 0,
            explanation: "A binder is a temporary agreement that provides insurance coverage until the official policy is issued.",
            difficulty: "Hard",
            category: "Policy Provisions"
          },
          {
            id: 91,
            question: "In the context of insurance, what does 'ALE' stand for?",
            options: [
              "Accumulated Loss Evaluation",
              "Additional Loss Expenditure",
              "Allocated Loss Expense",
              "Alternative Liability Endorsement"
            ],
            correctAnswer: 2,
            explanation: "Allocated Loss Expense (ALE) refers to the costs directly associated with investigating and settling insurance claims.",
            difficulty: "Super Hard",
            category: "Claims Management"
          },
          {
            id: 92,
            question: "What is the primary function of 'parametric insurance'?",
            options: [
              "To cover pre-determined events based on measurable parameters",
              "To calculate risk using actuarial tables",
              "To cover uninsurable risks under traditional policies",
              "To provide universal health coverage"
            ],
            correctAnswer: 0,
            explanation: "Parametric insurance pays out when predefined parameters, such as earthquake magnitude or rainfall levels, are met, regardless of actual loss.",
            difficulty: "Super Hard",
            category: "Risk Management"
          },
          {
            id: 93,
            question: "Which accounting standard governs the reporting of insurance contracts under IFRS?",
            options: [
              "IFRS 7",
              "IFRS 17",
              "IAS 39",
              "IFRS 9"
            ],
            correctAnswer: 1,
            explanation: "IFRS 17 is the global accounting standard for insurance contracts, replacing IFRS 4 to improve transparency and comparability.",
            difficulty: "Super Hard",
            category: "Regulatory Framework"
          },
          {
            id: 94,
            question: "In marine insurance, which clause covers damage due to latent defects but excludes wear and tear?",
            options: [
              "Sue and Labor Clause",
              "Inherent Vice Clause",
              "Running Down Clause",
              "Institute Cargo Clause A"
            ],
            correctAnswer: 1,
            explanation: "The Inherent Vice Clause excludes coverage for losses caused by the natural deterioration of goods, though some policies may cover hidden defects.",
            difficulty: "Super Hard",
            category: "Marine Insurance"
          },
          {
            id: 95,
            question: "What is 'retrocession' in reinsurance?",
            options: [
              "A process where an insurer transfers risk to another insurer",
              "A reinsurance company transferring risk to another reinsurer",
              "A method of terminating a reinsurance treaty",
              "A claim settlement mechanism"
            ],
            correctAnswer: 1,
            explanation: "Retrocession occurs when a reinsurer further transfers some of its assumed risks to another reinsurer.",
            difficulty: "Super Hard",
            category: "Reinsurance"
          },
          {
            id: 96,
            question: "Which of the following best describes 'deductible aggregate stop-loss' insurance?",
            options: [
              "A policyholder is liable for losses up to a certain amount before coverage begins",
              "A policy covers losses only after the total deductible limit is reached",
              "Coverage is provided for all claims without any deductible",
              "It provides unlimited claims reimbursement"
            ],
            correctAnswer: 1,
            explanation: "In aggregate stop-loss insurance, coverage is triggered only after the cumulative claims exceed a specified deductible limit.",
            difficulty: "Super Hard",
            category: "Risk Management"
          },
          {
            id: 97,
            question: "In liability insurance, what is 'claims-made' coverage?",
            options: [
              "Covers claims filed during the policy period, regardless of when the event occurred",
              "Covers claims based on the occurrence of an event",
              "Only covers claims filed after policy expiration",
              "Provides coverage for unlimited past claims"
            ],
            correctAnswer: 0,
            explanation: "Claims-made policies cover claims filed during the active policy period, regardless of when the actual incident happened.",
            difficulty: "Super Hard",
            category: "Liability Insurance"
          },
          {
            id: 98,
            question: "What does 'MPL' (Maximum Probable Loss) indicate in insurance risk assessment?",
            options: [
              "The total potential loss from a single event",
              "The highest loss an insurer is likely to face under normal conditions",
              "The maximum amount an insured can claim",
              "The total sum insured for a policy"
            ],
            correctAnswer: 1,
            explanation: "Maximum Probable Loss (MPL) estimates the highest loss that could reasonably occur in an insured event.",
            difficulty: "Super Hard",
            category: "Risk Assessment"
          },
          {
            id: 99,
            question: "Which risk is generally NOT insurable under standard property insurance policies?",
            options: [
              "Earthquake damage",
              "Radioactive contamination",
              "Fire damage",
              "Theft losses"
            ],
            correctAnswer: 1,
            explanation: "Radioactive contamination is typically excluded from standard property insurance due to its catastrophic nature.",
            difficulty: "Super Hard",
            category: "Property Insurance"
          },
          {
            id: 100,
            question: "In treaty reinsurance, what is 'excess of loss' coverage?",
            options: [
              "The reinsurer covers losses exceeding a certain threshold",
              "The reinsurer shares risk on a proportional basis",
              "It is an alternative to facultative reinsurance",
              "It applies only to life insurance policies"
            ],
            correctAnswer: 0,
            explanation: "Excess of loss reinsurance protects insurers by covering claims that exceed a predefined limit.",
            difficulty: "Super Hard",
            category: "Reinsurance"
          },
          {
            id: 101,
            question: "What is the primary characteristic of a 'non-admitted' insurance company?",
            options: [
              "It operates without state licensing",
              "It does not pay claims",
              "It is exempt from underwriting regulations",
              "It only offers policies to government entities"
            ],
            correctAnswer: 0,
            explanation: "Non-admitted insurers operate without state licenses and typically provide surplus or specialty insurance coverage.",
            difficulty: "Super Hard",
            category: "Regulatory Framework"
          },
          {
            id: 102,
            question: "What is the main purpose of 'claims reserving' in insurance?",
            options: [
              "To set aside funds for future claims settlements",
              "To limit the number of claims a policyholder can file",
              "To adjust premium rates based on claims history",
              "To track fraudulent claims"
            ],
            correctAnswer: 0,
            explanation: "Claims reserving ensures that insurers allocate sufficient funds to pay future claims liabilities.",
            difficulty: "Super Hard",
            category: "Claims Management"
          },
          {
            id: 103,
            question: "Which risk classification method uses mathematical models to assess policyholder risk?",
            options: [
              "Underwriting by experience",
              "Judgmental underwriting",
              "Automated risk scoring",
              "Retrospective underwriting"
            ],
            correctAnswer: 2,
            explanation: "Automated risk scoring applies statistical models to assess risk and determine insurance premiums.",
            difficulty: "Super Hard",
            category: "Underwriting"
          },
          {
            id: 104,
            question: "What is the key difference between facultative and treaty reinsurance?",
            options: [
              "Facultative reinsurance covers specific risks individually, while treaty reinsurance covers all risks under a contract",
              "Treaty reinsurance is optional, while facultative reinsurance is mandatory",
              "Facultative reinsurance is limited to property insurance",
              "Treaty reinsurance is only used in liability insurance"
            ],
            correctAnswer: 0,
            explanation: "Facultative reinsurance allows insurers to negotiate coverage for specific risks, whereas treaty reinsurance covers all risks within the contract terms.",
            difficulty: "Super Hard",
            category: "Reinsurance"
          },
          {
            id: 105,
            question: "What is the purpose of an 'actuarial opinion' in insurance?",
            options: [
              "To provide financial statements",
              "To determine claim eligibility",
              "To evaluate an insurer's financial stability and reserve adequacy",
              "To calculate policyholder dividends"
            ],
            correctAnswer: 2,
            explanation: "An actuarial opinion assesses an insurer's reserves and financial health to ensure solvency and risk management compliance.",
            difficulty: "Super Hard",
            category: "Actuarial Science"
          },
          {
            id: 106,
            question: "What is 'loss triangulation' in insurance reserving?",
            options: [
              "A method to estimate future claims based on past claims development",
              "A process to identify fraudulent claims",
              "A method to underwrite high-risk policies",
              "A regulatory requirement for capital adequacy"
            ],
            correctAnswer: 0,
            explanation: "Loss triangulation analyzes past claims data to project future liabilities and ensure adequate reserves.",
            difficulty: "Super Hard",
            category: "Actuarial Science"
          },
          {
            id: 107,
            question: "In proportional reinsurance, what does 'quota share' mean?",
            options: [
              "A fixed percentage of each risk is shared between the insurer and reinsurer",
              "Only catastrophic losses are covered",
              "Premiums are based on historical claims experience",
              "The reinsurer covers all losses above a specific limit"
            ],
            correctAnswer: 0,
            explanation: "Quota share reinsurance distributes a fixed percentage of all premiums and claims between the insurer and reinsurer.",
            difficulty: "Super Hard",
            category: "Reinsurance"
          },
          {
            id: 108,
            question: "Which of the following best describes 'adverse selection' in insurance?",
            options: [
              "When insurers charge higher premiums for high-risk individuals",
              "When high-risk individuals are more likely to purchase insurance than low-risk individuals",
              "When an insurer refuses coverage based on claim history",
              "When policyholders intentionally cause loss to claim benefits"
            ],
            correctAnswer: 1,
            explanation: "Adverse selection occurs when those at higher risk are more likely to buy insurance, potentially leading to increased claims.",
            difficulty: "Super Hard",
            category: "Risk Assessment"
          },
          {
            id: 109,
            question: "What is the function of a 'contingent liability' policy?",
            options: [
              "To cover future liabilities that may arise unexpectedly",
              "To provide reinsurance for an insurer’s catastrophic losses",
              "To ensure financial institutions meet solvency requirements",
              "To protect against defamation claims"
            ],
            correctAnswer: 0,
            explanation: "A contingent liability policy covers unforeseen liabilities that may arise due to future events.",
            difficulty: "Super Hard",
            category: "Liability Insurance"
          },
          {
            id: 110,
            question: "What is 'stop-loss insurance' commonly used for?",
            options: [
              "To protect self-insured businesses from excessive claims",
              "To cover total losses beyond a fixed threshold",
              "To limit insurer exposure in case of market crashes",
              "To provide immediate liquidity during a claim process"
            ],
            correctAnswer: 0,
            explanation: "Stop-loss insurance is designed to protect self-insured entities by capping their financial liability from claims.",
            difficulty: "Super Hard",
            category: "Risk Management"
          },
          {
            id: 111,
            question: "In insurance accounting, what is 'unearned premium reserve' (UPR)?",
            options: [
              "The portion of premiums received but not yet earned",
              "A reserve held for expected claims payments",
              "A capital buffer for unexpected underwriting losses",
              "A fund for policyholder dividends"
            ],
            correctAnswer: 0,
            explanation: "Unearned premium reserve (UPR) represents the portion of written premiums that apply to future coverage periods.",
            difficulty: "Super Hard",
            category: "Insurance Accounting"
          },
          {
            id: 112,
            question: "What is the primary distinction between 'claims frequency' and 'claims severity'?",
            options: [
              "Frequency measures the number of claims, while severity measures the financial impact",
              "Frequency relates to catastrophic events, while severity relates to routine claims",
              "Frequency applies to liability insurance, while severity applies to property insurance",
              "Frequency determines solvency, while severity determines underwriting policy"
            ],
            correctAnswer: 0,
            explanation: "Claims frequency refers to the number of claims filed, while claims severity indicates the financial magnitude of claims.",
            difficulty: "Super Hard",
            category: "Claims Management"
          },
          {
            id: 113,
            question: "Which of the following factors does NOT directly influence an insurer’s solvency ratio?",
            options: [
              "Claim payout ratios",
              "Investment income",
              "Policyholder retention rates",
              "Reinsurance arrangements"
            ],
            correctAnswer: 2,
            explanation: "While policyholder retention affects long-term profitability, it does not directly impact solvency ratios.",
            difficulty: "Super Hard",
            category: "Insurance Finance"
          },
          {
            id: 114,
            question: "What is the role of an 'appointed actuary' in an insurance company?",
            options: [
              "To evaluate and certify the insurer’s financial health and reserves",
              "To approve policyholder claims",
              "To manage investment portfolios",
              "To ensure compliance with anti-money laundering regulations"
            ],
            correctAnswer: 0,
            explanation: "The appointed actuary assesses financial reserves, ensuring the insurer remains solvent and meets regulatory requirements.",
            difficulty: "Super Hard",
            category: "Actuarial Science"
          },
          {
            id: 115,
            question: "Which of the following best defines 'credit insurance'?",
            options: [
              "Insurance that protects lenders against borrower default",
              "Coverage for financial institutions in case of fraud",
              "Protection for businesses against cybercrime",
              "A policy that reimburses policyholders for investment losses"
            ],
            correctAnswer: 0,
            explanation: "Credit insurance protects lenders from financial loss if a borrower defaults on repayment.",
            difficulty: "Super Hard",
            category: "Specialty Insurance"
          },
          {
            id: 116,
            question: "What is a 'bancassurance' agreement?",
            options: [
              "A partnership between a bank and an insurance company to sell insurance products",
              "A contract between two insurers to reinsure each other’s risk",
              "A government-regulated financial protection scheme",
              "A hedge fund strategy for risk diversification"
            ],
            correctAnswer: 0,
            explanation: "Bancassurance is an arrangement where banks distribute insurance products, leveraging their customer base.",
            difficulty: "Super Hard",
            category: "Distribution Channels"
          },
          {
            id: 117,
            question: "Which of the following is an example of 'finite risk reinsurance'?",
            options: [
              "A reinsurer limits its exposure by covering only a portion of potential losses",
              "A contract where the insurer retains most of the risk, and the reinsurer provides limited coverage",
              "A policy that only covers a specific peril",
              "A short-term reinsurance agreement with automatic renewal"
            ],
            correctAnswer: 1,
            explanation: "Finite risk reinsurance is structured so the insurer retains most of the risk while transferring only a small portion to the reinsurer.",
            difficulty: "Super Hard",
            category: "Reinsurance"
          },
          {
            id: 118,
            question: "What does the term 'Lapse Ratio' refer to in life insurance?",
            options: [
              "The percentage of policies that are not renewed",
              "The ratio of claims paid to total policies",
              "The rate at which new policies are sold",
              "The proportion of fraudulent claims in a portfolio"
            ],
            correctAnswer: 0,
            explanation: "Lapse Ratio is the percentage of life insurance policies that are not renewed or discontinued before their maturity date.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 119,
            question: "Which regulatory body oversees reinsurance operations in India?",
            options: [
              "RBI (Reserve Bank of India)",
              "IRDAI (Insurance Regulatory and Development Authority of India)",
              "SEBI (Securities and Exchange Board of India)",
              "Ministry of Finance"
            ],
            correctAnswer: 1,
            explanation: "IRDAI is the regulatory authority responsible for overseeing insurance and reinsurance operations in India.",
            difficulty: "Super Hard",
            category: "Regulatory Framework"
          },
          {
            id: 120,
            question: "What is the primary purpose of a 'deductible corridor' in health insurance?",
            options: [
              "To create a secondary deductible after the initial deductible is met",
              "To eliminate out-of-pocket expenses",
              "To provide unlimited lifetime coverage",
              "To reduce the cost of catastrophic claims"
            ],
            correctAnswer: 0,
            explanation: "A deductible corridor is an additional deductible that applies after the initial deductible has been exhausted.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 121,
            question: "Rajiv owns a factory that was recently damaged in a fire. Upon filing a claim, the insurer finds that Rajiv had increased the sum insured significantly just a week before the fire. How is the insurer likely to respond under the principle of indemnity?",
            options: [
              "Pay the full claim amount as per the new sum insured",
              "Deny the claim entirely due to moral hazard",
              "Compensate only for the actual loss based on the previous valuation",
              "Ask Rajiv to provide proof of the necessity for the increased sum insured"
            ],
            correctAnswer: 2,
            explanation: "The principle of indemnity ensures compensation only for the actual financial loss, preventing profit from insurance.",
            difficulty: "Super Hard",
            category: "Indemnity Principle"
          },
          {
            id: 122,
            question: "A business owner, Priya, fails to disclose a pre-existing electrical issue in her warehouse while purchasing fire insurance. A fire occurs due to an electrical short circuit. What action can the insurer take based on the principle of utmost good faith?",
            options: [
              "Pay the claim as fire damage is covered under the policy",
              "Reject the claim due to non-disclosure of material facts",
              "Reduce the claim amount proportionally",
              "Allow Priya to renew the policy with a higher premium"
            ],
            correctAnswer: 1,
            explanation: "Under utmost good faith, both parties must disclose all material facts. Failure to disclose can lead to claim denial.",
            difficulty: "Super Hard",
            category: "Utmost Good Faith"
          },
          {
            id: 123,
            question: "Arun’s car is stolen, and he files a claim. However, investigation reveals that he also filed a similar claim five years ago for another car. How might the insurer apply the principle of contribution if Arun has multiple policies?",
            options: [
              "Each insurer will pay an equal share of the claim",
              "The first insurer contacted will settle the full claim",
              "The insurers will proportionately share the claim payout",
              "Arun will receive the full claim amount from all insurers"
            ],
            correctAnswer: 2,
            explanation: "Under the principle of contribution, multiple insurers proportionally share the claim payment.",
            difficulty: "Super Hard",
            category: "Contribution Principle"
          },
          {
            id: 124,
            question: "A hotelier, Suresh, has insurance for business interruption. A flood damages his hotel, but authorities also find that he was operating without a valid license. Will the insurer approve his claim?",
            options: [
              "Yes, because business interruption is covered in his policy",
              "No, because illegal operations void insurance claims",
              "Only partial compensation will be provided",
              "The insurer will seek clarification before settlement"
            ],
            correctAnswer: 1,
            explanation: "Illegal activities can void insurance contracts, making the claim inadmissible.",
            difficulty: "Super Hard",
            category: "Legal Aspects"
          },
          {
            id: 125,
            question: "Ramesh buys a health insurance policy but provides incorrect details about his smoking habit. He later suffers a heart attack and files a claim. What action can the insurer take?",
            options: [
              "Approve the claim since heart attacks are covered",
              "Reject the claim due to misrepresentation",
              "Charge an extra premium before processing the claim",
              "Partially pay the claim and increase future premiums"
            ],
            correctAnswer: 1,
            explanation: "Providing false information constitutes misrepresentation, leading to claim denial.",
            difficulty: "Super Hard",
            category: "Utmost Good Faith"
          },
          {
            id: 126,
            question: "A shipping company insures a cargo shipment. The ship sinks due to negligence by the crew. What principle determines whether the insurer is liable?",
            options: [
              "Subrogation",
              "Proximate Cause",
              "Indemnity",
              "Contribution"
            ],
            correctAnswer: 1,
            explanation: "The proximate cause principle determines whether the primary cause of loss is covered under the policy.",
            difficulty: "Super Hard",
            category: "Proximate Cause"
          },
          {
            id: 127,
            question: "John’s office is vandalized during a riot, and he files a claim under his property insurance. However, the insurer finds that his policy does not cover damages from civil unrest. What principle applies here?",
            options: [
              "Indemnity",
              "Subrogation",
              "Proximate Cause",
              "Contractual Exclusions"
            ],
            correctAnswer: 3,
            explanation: "If the policy excludes riot-related damages, the insurer is not liable to compensate.",
            difficulty: "Super Hard",
            category: "Policy Exclusions"
          },
          {
            id: 128,
            question: "A restaurant owner insures his property. After a fire, the insurer discovers that he had significantly reduced fire safety measures after policy issuance. What principle can the insurer invoke?",
            options: [
              "Utmost Good Faith",
              "Material Alteration",
              "Moral Hazard",
              "Doctrine of Waiver"
            ],
            correctAnswer: 2,
            explanation: "Moral hazard arises when an insured takes greater risks due to the presence of insurance.",
            difficulty: "Super Hard",
            category: "Moral Hazard"
          },
          {
            id: 129,
            question: "A person with an existing life insurance policy suddenly takes out multiple new policies and dies within a year under suspicious circumstances. How might insurers respond?",
            options: [
              "All policies will be paid out in full",
              "Claims will be rejected due to suspected fraud",
              "Only the first policy will be honored",
              "Payments will be made proportionately"
            ],
            correctAnswer: 1,
            explanation: "Multiple policies obtained under suspicious circumstances can indicate fraudulent intent.",
            difficulty: "Super Hard",
            category: "Fraud Prevention"
          },
          {
            id: 130,
            question: "A logistics company files a claim for lost goods. However, the goods were lost due to negligence by the warehouse staff. What principle determines the insurer’s liability?",
            options: [
              "Contribution",
              "Subrogation",
              "Proximate Cause",
              "Warranties"
            ],
            correctAnswer: 2,
            explanation: "The proximate cause principle evaluates if the primary reason for the loss is covered under the policy.",
            difficulty: "Super Hard",
            category: "Proximate Cause"
          },
          {
            id: 131,
            question: "An insured person is involved in an accident but does not report it to the insurer immediately. When he finally reports it months later, he is unable to provide sufficient documentation. What will the insurer likely do?",
            options: [
              "Deny the claim due to delay and lack of evidence",
              "Approve the claim if a valid policy exists",
              "Investigate the case further before making a decision",
              "Offer a lower settlement amount"
            ],
            correctAnswer: 0,
            explanation: "Delays in reporting can lead to claim rejection due to insufficient evidence and policy conditions.",
            difficulty: "Super Hard",
            category: "Claims Management"
          },
          {
            id: 132,
            question: "A policyholder dies in an accident, but post-mortem results show high alcohol levels. The policy excludes claims involving intoxication. What will the insurer likely do?",
            options: [
              "Reject the claim based on policy exclusion",
              "Pay the claim partially",
              "Investigate further before making a decision",
              "Pay the full claim to beneficiaries"
            ],
            correctAnswer: 0,
            explanation: "If the policy explicitly excludes intoxication-related claims, the insurer can deny the claim.",
            difficulty: "Super Hard",
            category: "Policy Exclusions"
          },
          {
            id: 133,
            question: "A businessman, Rajesh, owns a factory insured under a fire policy. A fire damages only 40% of the factory, but he files a claim stating total loss. Investigators find evidence of exaggeration. What will the insurer likely do?",
            options: [
              "Pay the full claim amount as per the sum insured",
              "Reject the claim entirely due to fraudulent intent",
              "Compensate only for the actual 40% damage and deny the rest",
              "Increase future premium but approve the current claim"
            ],
            correctAnswer: 2,
            explanation: "Only the actual loss is compensated under the indemnity principle. Exaggerating damages can lead to a partial or full denial of the claim.",
            difficulty: "Super Hard",
            category: "Fraud Prevention"
          },
          {
            id: 134,
            question: "A homeowner has insured his house for ₹50 lakh. Due to an earthquake, the house is severely damaged. The insurer finds that the homeowner also has earthquake coverage under a separate policy. What principle applies here?",
            options: [
              "Subrogation - The insurer will recover losses from another insurer",
              "Contribution - Each insurer will pay their proportionate share",
              "Indemnity - The total compensation will not exceed the actual loss",
              "Proximate Cause - The primary cause of damage is analyzed"
            ],
            correctAnswer: 1,
            explanation: "Under contribution, multiple insurers share the liability proportionally rather than paying the full amount separately.",
            difficulty: "Super Hard",
            category: "Contribution Principle"
          },
          {
            id: 135,
            question: "Meera purchases a health insurance policy but does not disclose her existing high blood pressure condition. A year later, she is hospitalized for a heart attack and files a claim. What will the insurer most likely do?",
            options: [
              "Pay the claim as a heart attack is covered",
              "Deny the claim due to non-disclosure of pre-existing conditions",
              "Partially pay the claim after applying a penalty",
              "Reject the claim but refund past premiums"
            ],
            correctAnswer: 1,
            explanation: "Failure to disclose pre-existing conditions breaches utmost good faith, leading to claim rejection.",
            difficulty: "Super Hard",
            category: "Utmost Good Faith"
          },
          {
            id: 136,
            question: "A warehouse storing electronics is insured for ₹1 crore. After a flood damages the stock, the insured claims the full amount. However, the inventory records show only ₹60 lakh worth of goods. What action will the insurer take?",
            options: [
              "Pay the full ₹1 crore claim as per the policy",
              "Deny the claim due to misrepresentation",
              "Pay ₹60 lakh as per the actual stock value",
              "Investigate further before processing the claim"
            ],
            correctAnswer: 2,
            explanation: "Insurance follows the indemnity principle, compensating only for actual loss, not the insured amount.",
            difficulty: "Super Hard",
            category: "Indemnity Principle"
          },
          {
            id: 137,
            question: "Sohan has a life insurance policy. He dies in a car accident, but his toxicology report shows high alcohol levels. The policy document does not mention exclusions for alcohol consumption. What is the insurer’s most likely course of action?",
            options: [
              "Reject the claim due to intoxication",
              "Approve the claim since no exclusions were mentioned",
              "Reduce the payout due to negligence",
              "Offer only a partial settlement"
            ],
            correctAnswer: 1,
            explanation: "If the policy does not explicitly exclude intoxication-related deaths, the insurer must approve the claim.",
            difficulty: "Super Hard",
            category: "Policy Exclusions"
          },
          {
            id: 138,
            question: "A company has insured its office building. The property is severely damaged due to a gas leak. However, the insurer finds that the gas line was not maintained properly. What will be the insurer’s response?",
            options: [
              "Reject the claim due to negligence",
              "Approve the claim as the policy covers gas explosions",
              "Pay only 50% of the claim",
              "Cancel the policy and refund previous premiums"
            ],
            correctAnswer: 1,
            explanation: "Negligence in maintaining the property does not automatically void the claim unless explicitly excluded.",
            difficulty: "Super Hard",
            category: "Claims Management"
          },
          {
            id: 139,
            question: "Ajay has a vehicle insurance policy. He meets with an accident but delays filing the claim for six months. The insurer denies the claim. What principle is applied here?",
            options: [
              "Indemnity",
              "Subrogation",
              "Doctrine of Laches",
              "Contribution"
            ],
            correctAnswer: 2,
            explanation: "The doctrine of laches states that unreasonable delays can lead to the denial of claims.",
            difficulty: "Super Hard",
            category: "Claims Processing"
          },
          {
            id: 140,
            question: "A logistics company insures its fleet of trucks. A truck driver causes an accident due to reckless driving. What principle determines the insurer’s liability?",
            options: [
              "Proximate Cause",
              "Subrogation",
              "Utmost Good Faith",
              "Indemnity"
            ],
            correctAnswer: 0,
            explanation: "The proximate cause principle helps determine whether reckless driving was the direct reason for the claim.",
            difficulty: "Super Hard",
            category: "Proximate Cause"
          },
          {
            id: 141,
            question: "Vikram takes a life insurance policy and nominates his wife. He later takes a large loan, and the lender claims the insurance payout after his death. What principle is involved?",
            options: [
              "Subrogation",
              "Contribution",
              "Insurable Interest",
              "Assignment"
            ],
            correctAnswer: 3,
            explanation: "Assignment allows policyholders to transfer rights to another party, but without it, the nominee receives the payout.",
            difficulty: "Super Hard",
            category: "Legal Principles"
          },
          {
            id: 142,
            question: "A company files a fire insurance claim for warehouse damage. Investigators find that the fire started due to faulty wiring that was never repaired despite warnings. How will the insurer respond?",
            options: [
              "Reject the claim citing negligence",
              "Pay only partial damages",
              "Approve the full claim as fire damage is covered",
              "Cancel the policy retrospectively"
            ],
            correctAnswer: 0,
            explanation: "Neglecting known risks can lead to claim rejection under the principle of reasonable care.",
            difficulty: "Super Hard",
            category: "Risk Management"
          },
          {
            id: 143,
            question: "A jeweler insures a diamond necklace. It is stolen during an armed robbery, but security footage shows the store’s vault was left open. What will the insurer likely do?",
            options: [
              "Deny the claim due to negligence",
              "Pay the full claim as robbery is covered",
              "Reduce the payout due to contributory negligence",
              "Investigate further before deciding"
            ],
            correctAnswer: 2,
            explanation: "Contributory negligence can reduce the claim payout but does not automatically void it.",
            difficulty: "Super Hard",
            category: "Negligence and Claims"
          },
          {
            id: 144,
            question: "A policyholder with health insurance undergoes a costly treatment. The insurer finds that a cheaper, equally effective treatment was available. What might the insurer do?",
            options: [
              "Approve the full claim amount",
              "Pay only the amount for the cheaper treatment",
              "Deny the claim for cost inefficiency",
              "Investigate before making a decision"
            ],
            correctAnswer: 1,
            explanation: "Insurance policies often include 'reasonable and customary charges' clauses, limiting coverage to standard costs.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 145,
            question: "A manufacturing company insures its plant. A major storm damages the facility, but an investigation shows the company ignored prior weather warnings. What is the likely insurer response?",
            options: [
              "Approve the claim fully",
              "Deny the claim due to failure to mitigate loss",
              "Pay only partial damages",
              "Require a third-party assessment before deciding"
            ],
            correctAnswer: 1,
            explanation: "Policyholders are expected to mitigate losses when risks are foreseeable.",
            difficulty: "Super Hard",
            category: "Claims Management"
          },
          {
            id: 146,
            question: "A shipping company insures a cargo shipment. The ship encounters rough weather, and some cargo is thrown overboard to stabilize the vessel. The insured claims full compensation. What principle applies?",
            options: [
              "Indemnity - The insurer compensates for the actual loss",
              "Subrogation - The insurer recovers from third parties",
              "General Average - Losses are shared among stakeholders",
              "Contribution - Multiple insurers pay proportionately"
            ],
            correctAnswer: 2,
            explanation: "In maritime law, General Average requires all parties involved to proportionally share the loss when cargo is sacrificed to save the vessel.",
            difficulty: "Super Hard",
            category: "Marine Insurance"
          },
          {
            id: 147,
            question: "A policyholder with a theft insurance policy leaves his car unlocked in a public place. The car is stolen, and he files a claim. How will the insurer likely respond?",
            options: [
              "Approve the claim fully",
              "Deny the claim due to negligence",
              "Pay only 50% of the claim",
              "Reject the claim but refund the premium"
            ],
            correctAnswer: 1,
            explanation: "Leaving the car unlocked may be considered contributory negligence, leading to a denial of the claim.",
            difficulty: "Super Hard",
            category: "Negligence in Claims"
          },
          {
            id: 148,
            question: "A hotel is insured against fire. A minor electrical fire breaks out in the kitchen but is quickly extinguished with minimal damage. However, the hotel reports extensive damage. What action will the insurer take?",
            options: [
              "Approve the claim based on fire coverage",
              "Investigate for possible fraud before approval",
              "Reject the claim outright due to exaggeration",
              "Pay only for the verified damages"
            ],
            correctAnswer: 1,
            explanation: "Exaggerated claims are investigated for fraud before approval to ensure only actual losses are compensated.",
            difficulty: "Super Hard",
            category: "Fraudulent Claims"
          },
          {
            id: 149,
            question: "A company insures its factory against fire and flood under separate policies with different insurers. A fire, followed by flooding from firefighting efforts, damages the factory. How will the insurers handle the claim?",
            options: [
              "The fire insurer pays for fire damage, and the flood insurer pays for water damage",
              "Only the fire insurer pays since fire was the proximate cause",
              "Both insurers share the liability equally",
              "The claim will be denied due to multiple causes"
            ],
            correctAnswer: 1,
            explanation: "Under proximate cause, the primary cause of damage is considered. Since fire led to water damage, the fire insurer is liable.",
            difficulty: "Super Hard",
            category: "Proximate Cause"
          },
          {
            id: 150,
            question: "A business purchases insurance for machinery. Six months later, it sells the machinery but keeps paying the premium. A year later, the new owner claims insurance for damage. What principle applies?",
            options: [
              "Indemnity - The original owner should be compensated",
              "Subrogation - The insurer can recover from the new owner",
              "Insurable Interest - The original policyholder has no right to claim",
              "Utmost Good Faith - The insurer must honor the claim"
            ],
            correctAnswer: 2,
            explanation: "Insurable interest must exist at the time of loss. Since the original owner sold the machinery, they have no insurable interest.",
            difficulty: "Super Hard",
            category: "Insurable Interest"
          },
          {
            id: 151,
            question: "A person takes a life insurance policy and assigns it to a bank as collateral for a loan. The person dies before repaying the loan. Who gets the insurance payout?",
            options: [
              "The bank, as it has the assigned rights",
              "The nominee, since they are legally named",
              "The deceased's legal heirs",
              "The insurer, as the policy is void due to unpaid loans"
            ],
            correctAnswer: 0,
            explanation: "Assigned policies transfer benefits to the assignee (bank) first, ensuring the loan is repaid.",
            difficulty: "Super Hard",
            category: "Policy Assignment"
          },
          {
            id: 152,
            question: "An insured individual buys home insurance but later shifts abroad, leaving the house unoccupied. A burglary occurs, and he files a claim. What will the insurer do?",
            options: [
              "Approve the claim fully",
              "Deny the claim citing increased risk",
              "Pay 50% of the claim",
              "Reduce the payout and increase future premiums"
            ],
            correctAnswer: 1,
            explanation: "Unoccupied properties carry higher risk, and non-disclosure of prolonged absence can lead to claim denial.",
            difficulty: "Super Hard",
            category: "Non-Disclosure"
          },
          {
            id: 153,
            question: "A factory owner insured his equipment against accidental damage. He replaces some old machines but does not inform the insurer. A fire destroys the factory, and he claims insurance. What principle applies?",
            options: [
              "Indemnity - The insurer compensates for loss",
              "Utmost Good Faith - Non-disclosure affects the claim",
              "Proximate Cause - Fire is the primary reason",
              "Contribution - Multiple insurers will share the loss"
            ],
            correctAnswer: 1,
            explanation: "Failing to inform the insurer about equipment changes violates utmost good faith, affecting the claim.",
            difficulty: "Super Hard",
            category: "Utmost Good Faith"
          },
          {
            id: 154,
            question: "A life insurance policyholder commits suicide after two years of policy inception. What will the insurer do?",
            options: [
              "Reject the claim under suicide clause",
              "Approve the claim as the policy has matured beyond the exclusion period",
              "Pay only a portion of the sum assured",
              "Refund the premiums but deny death benefit"
            ],
            correctAnswer: 1,
            explanation: "Most life insurance policies cover suicide after an initial exclusion period (typically one or two years).",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 155,
            question: "A car owner insures his vehicle. He later modifies it for racing but does not update the insurer. The car meets with an accident, and he files a claim. What is the insurer’s likely response?",
            options: [
              "Approve the claim fully",
              "Deny the claim due to change in risk",
              "Pay a reduced amount",
              "Increase the premium for future policies"
            ],
            correctAnswer: 1,
            explanation: "Modifying a vehicle without informing the insurer alters the risk profile, leading to claim rejection.",
            difficulty: "Super Hard",
            category: "Risk Disclosure"
          },
          {
            id: 156,
            question: "A businessman takes a keyman insurance policy on his CFO. The CFO resigns, but the businessman does not cancel the policy. A year later, the CFO dies, and a claim is filed. What happens?",
            options: [
              "The claim is approved as the policy was active",
              "The claim is denied due to loss of insurable interest",
              "Only partial compensation is paid",
              "The nominee of the CFO gets the claim amount"
            ],
            correctAnswer: 1,
            explanation: "Keyman insurance requires insurable interest at the time of claim. Since the CFO had left, the interest ceased.",
            difficulty: "Super Hard",
            category: "Keyman Insurance"
          },
          {
            id: 157,
            question: "A businessman with multiple life insurance policies dies in an accident. His heirs file claims with all insurers. How is the claim settled?",
            options: [
              "Each insurer pays the full amount separately",
              "Indemnity applies, so only actual loss is compensated",
              "All insurers pay as per their policy terms",
              "The claims are shared proportionately among insurers"
            ],
            correctAnswer: 2,
            explanation: "Life insurance is not subject to indemnity, so all insurers pay based on their policy terms.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 158,
            question: "An insured individual owns a shop that was damaged in a riot. The shop was covered under both a fire insurance policy and a riot protection endorsement. The insurer under the fire policy denies the claim, stating that the riot protection endorsement insurer should pay. What principle applies?",
            options: [
              "Subrogation - The insurer can claim from the other insurer",
              "Proximate Cause - The primary cause of damage determines the responsible insurer",
              "Contribution - Both insurers share the claim proportionally",
              "Indemnity - Only one insurer should pay based on policy terms"
            ],
            correctAnswer: 2,
            explanation: "When multiple policies cover the same risk, the principle of Contribution applies, ensuring proportional claim settlement.",
            difficulty: "Super Hard",
            category: "Multiple Policies"
          },
          {
            id: 159,
            question: "A company buys an insurance policy covering losses due to machinery breakdown. After three years, a covered machine breaks down due to wear and tear. The insurer denies the claim. What is the likely reason?",
            options: [
              "Proximate cause - The breakdown is due to an uninsured peril",
              "Utmost good faith - The policyholder did not disclose machine usage",
              "Subrogation - The insurer will recover from the manufacturer",
              "Contribution - The insurer will pay only part of the claim"
            ],
            correctAnswer: 0,
            explanation: "Wear and tear is a gradual process and is typically excluded from coverage, as policies cover sudden and unforeseen events.",
            difficulty: "Super Hard",
            category: "Machinery Breakdown Insurance"
          },
          {
            id: 160,
            question: "A car owner with comprehensive insurance meets with an accident. The repair cost is less than the deductible amount. What is the insurer's liability?",
            options: [
              "Pay the full amount",
              "Pay only the amount exceeding the deductible",
              "Reject the claim entirely",
              "Reimburse 50% of the cost"
            ],
            correctAnswer: 2,
            explanation: "If repair costs are below the deductible, the insurer is not liable to pay, as the policyholder must bear that portion.",
            difficulty: "Super Hard",
            category: "Deductibles in Insurance"
          },
          {
            id: 161,
            question: "A person with a health insurance policy is diagnosed with a pre-existing disease but was unaware of it at the time of buying the policy. He files a claim within the waiting period. How will the insurer respond?",
            options: [
              "Approve the claim since the disease was unknown",
              "Deny the claim due to the waiting period clause",
              "Pay a partial amount considering good faith",
              "Reject the claim but offer a refund"
            ],
            correctAnswer: 1,
            explanation: "Even if the policyholder was unaware, pre-existing conditions are subject to waiting periods before coverage begins.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 162,
            question: "A shipping company insures cargo against damage. The ship sinks due to a captain’s negligence. Will the insurer cover the loss?",
            options: [
              "Yes, as long as negligence was unintentional",
              "No, as negligence voids the policy",
              "Only if the captain was not at fault",
              "Only if the shipper was not informed of negligence"
            ],
            correctAnswer: 0,
            explanation: "Marine insurance covers losses even due to crew negligence, provided it was not intentional or fraudulent.",
            difficulty: "Super Hard",
            category: "Marine Insurance"
          },
          {
            id: 163,
            question: "A fire insurance policyholder under-declares the value of his property to save on premiums. A fire occurs, and the insurer finds the actual value is double what was declared. How will the claim be settled?",
            options: [
              "Pay the full claim amount",
              "Reject the claim entirely",
              "Apply the Average Clause and reduce the payout",
              "Compensate only for direct damages"
            ],
            correctAnswer: 2,
            explanation: "Under the Average Clause, if an insured under-declares value, the claim payout is proportionally reduced.",
            difficulty: "Super Hard",
            category: "Under-Insurance"
          },
          {
            id: 164,
            question: "A businessman buys life insurance and names his business partner as the nominee. The partner later leaves the business. The insured dies a year later. Who will receive the payout?",
            options: [
              "The nominee, as per policy records",
              "The insured’s legal heirs",
              "The insurer will decide based on policy terms",
              "The nominee and legal heirs will share equally"
            ],
            correctAnswer: 1,
            explanation: "A nominee is only a custodian of funds, not the ultimate beneficiary. Legal heirs will receive the payout unless specified otherwise.",
            difficulty: "Super Hard",
            category: "Nomination in Life Insurance"
          },
          {
            id: 165,
            question: "A vehicle owner files an insurance claim for flood damage. The insurer inspects and finds that the owner drove the car through deep water knowingly. How will the insurer respond?",
            options: [
              "Approve the claim as the car has flood cover",
              "Reject the claim due to willful exposure to risk",
              "Pay 50% of the claim amount",
              "Pay the full amount but increase future premiums"
            ],
            correctAnswer: 1,
            explanation: "Driving through deep water knowingly is considered reckless behavior, leading to claim rejection.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 166,
            question: "An insured business suffers losses due to a riot. However, the policyholder failed to take preventive measures despite warnings. Will the insurer pay the claim?",
            options: [
              "Yes, as riots are covered risks",
              "No, as negligence increases the risk",
              "Only a portion of the claim will be paid",
              "Yes, but future premiums will be higher"
            ],
            correctAnswer: 1,
            explanation: "Failure to mitigate risk after warnings can be considered negligence, affecting claim eligibility.",
            difficulty: "Super Hard",
            category: "Risk Management"
          },
          {
            id: 167,
            question: "A contractor buys an insurance policy for a construction site. After a storm, the foundation collapses. The insurer finds that substandard materials were used. Will the claim be paid?",
            options: [
              "Yes, as storms are covered",
              "No, as defective construction is an exclusion",
              "Partially, after assessing the damage",
              "Only if the contractor pays a penalty"
            ],
            correctAnswer: 1,
            explanation: "Construction defects are typically exclusions in insurance policies, making the claim invalid.",
            difficulty: "Super Hard",
            category: "Construction Insurance"
          },
          {
            id: 168,
            question: "A person takes two separate health insurance policies and submits claims to both insurers. How will the claim be processed?",
            options: [
              "Both insurers will pay full claims",
              "Only one insurer will pay the full claim",
              "Claims will be shared based on Contribution principle",
              "The second insurer will reject the claim"
            ],
            correctAnswer: 2,
            explanation: "Under the Contribution principle, insurers share liability in proportion when multiple policies exist.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 169,
            question: "A property is insured against theft. The owner moves abroad, leaving it unattended for a year. A theft occurs. Will the insurer compensate?",
            options: [
              "Yes, theft is covered",
              "No, prolonged vacancy voids the policy",
              "Only a percentage of the loss will be paid",
              "Yes, but future premiums will be increased"
            ],
            correctAnswer: 1,
            explanation: "Prolonged vacancy increases risk and often voids theft coverage unless declared to the insurer.",
            difficulty: "Super Hard",
            category: "Vacant Property Risk"
          },
          {
            id: 170,
            question: "A person purchases a travel insurance policy covering trip cancellations. He cancels a trip due to fear of bad weather. Can he claim reimbursement?",
            options: [
              "Yes, as cancellation is covered",
              "No, voluntary cancellations are not covered",
              "Only 50% of the trip cost will be reimbursed",
              "Yes, but future coverage may be denied"
            ],
            correctAnswer: 1,
            explanation: "Insurance covers cancellations due to unforeseen events, not personal fears or voluntary decisions.",
            difficulty: "Super Hard",
            category: "Travel Insurance"
          },
          {
            id: 171,
            question: "An insured business suffers a major fire, and the insurer discovers that the business had also taken out a fire insurance policy from another insurer without disclosing it. How will the claim be handled?",
            options: [
              "Both insurers will pay the full claim amount",
              "The claim will be rejected due to non-disclosure",
              "The Contribution principle will apply",
              "Only one insurer will pay, and the other will refund premiums"
            ],
            correctAnswer: 2,
            explanation: "The Contribution principle applies when multiple policies cover the same risk, and both insurers will proportionally share the claim.",
            difficulty: "Super Hard",
            category: "Multiple Policies"
          },
          {
            id: 172,
            question: "A factory's machinery is insured under a breakdown policy. The insured attempts unauthorized repairs before informing the insurer, worsening the damage. What is the insurer's likely response?",
            options: [
              "Approve the claim but deduct repair costs",
              "Reject the claim due to policy violation",
              "Pay 50% of the claim",
              "Approve the claim but increase future premiums"
            ],
            correctAnswer: 1,
            explanation: "Unauthorized repairs before informing the insurer breach policy terms and may result in claim rejection.",
            difficulty: "Super Hard",
            category: "Machinery Breakdown Insurance"
          },
          {
            id: 173,
            question: "A person takes a life insurance policy but dies during the policy's grace period without paying the last due premium. Will the insurer pay the death benefit?",
            options: [
              "Yes, the policy is still active in the grace period",
              "No, since the premium was unpaid",
              "Yes, but with premium deducted",
              "Only if the nominee agrees to pay the due premium"
            ],
            correctAnswer: 2,
            explanation: "Life insurance remains active during the grace period, but unpaid premiums are deducted from the claim payout.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 174,
            question: "An insured car is involved in an accident, but the driver was found to be under the influence of alcohol. Will the motor insurance policy cover the damage?",
            options: [
              "Yes, as long as the policy includes collision coverage",
              "No, since driving under the influence is an exclusion",
              "Only if the driver was not at fault",
              "Yes, but with a higher deductible"
            ],
            correctAnswer: 1,
            explanation: "Most motor insurance policies exclude coverage for accidents occurring while driving under the influence.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 175,
            question: "A building is insured for Rs. 50 lakhs, but its market value is Rs. 80 lakhs. If a partial loss of Rs. 20 lakhs occurs, how much will the insurer pay?",
            options: [
              "Full Rs. 20 lakhs",
              "Rs. 12.5 lakhs due to underinsurance",
              "Only Rs. 10 lakhs as a penalty",
              "Nothing, as the insured declared a lower value"
            ],
            correctAnswer: 1,
            explanation: "The Average Clause applies in underinsurance cases, reducing the payout in proportion to the insured value.",
            difficulty: "Super Hard",
            category: "Property Insurance"
          },
          {
            id: 176,
            question: "A corporate employee has employer-provided health insurance but also purchases a personal health policy. He files a hospitalization claim under both. How will it be handled?",
            options: [
              "Both insurers will pay full claims",
              "Only the employer’s policy will pay",
              "Both insurers will share the claim proportionally",
              "The personal policy will pay first"
            ],
            correctAnswer: 2,
            explanation: "Under the Contribution principle, insurers proportionally share liability when multiple policies exist.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 177,
            question: "A warehouse owner forgets to renew his fire insurance policy, and a fire occurs the next day. Can he still file a claim?",
            options: [
              "Yes, as long as renewal is done within a week",
              "No, as the policy was not active at the time of loss",
              "Yes, but with a penalty",
              "Only if the insurer agrees on compassionate grounds"
            ],
            correctAnswer: 1,
            explanation: "Insurance covers only active policy periods; a lapsed policy provides no coverage.",
            difficulty: "Super Hard",
            category: "Fire Insurance"
          },
          {
            id: 178,
            question: "A businessman names his friend as the nominee in his life insurance policy. Upon his death, who will receive the claim amount?",
            options: [
              "The nominee, as per policy terms",
              "His legal heirs, since the nominee is just a custodian",
              "The insurer will decide",
              "The nominee and legal heirs will share equally"
            ],
            correctAnswer: 1,
            explanation: "In life insurance, a nominee is usually a custodian of funds, and the legal heirs are the actual beneficiaries.",
            difficulty: "Super Hard",
            category: "Nomination in Life Insurance"
          },
          {
            id: 179,
            question: "An insured person makes fraudulent claims in the past but now files a legitimate claim. What is the insurer’s likely response?",
            options: [
              "Reject the claim due to past fraud",
              "Approve the claim but increase premiums",
              "Investigate further before deciding",
              "Approve with a warning"
            ],
            correctAnswer: 2,
            explanation: "Past fraud raises suspicion, and insurers will thoroughly investigate any future claims before processing them.",
            difficulty: "Super Hard",
            category: "Fraud Detection"
          },
          {
            id: 180,
            question: "A marine cargo owner insures goods in transit. The ship sinks, but it is later found that the goods were already damaged before shipment. Will the insurer pay?",
            options: [
              "Yes, since the ship sinking is a covered peril",
              "No, as the goods were already damaged",
              "Only if the owner proves damage was due to sinking",
              "The insurer will pay but recover from the shipping company"
            ],
            correctAnswer: 1,
            explanation: "Insurance covers new damages, not pre-existing ones. Claims based on pre-damaged goods are invalid.",
            difficulty: "Super Hard",
            category: "Marine Insurance"
          },
          {
            id: 181,
            question: "A factory owner with fire insurance starts another business in the same premises involving hazardous chemicals, increasing fire risk. What should the insurer do?",
            options: [
              "Cancel the policy for non-disclosure",
              "Increase the premium to reflect the new risk",
              "Continue the policy unchanged",
              "Only cover the previously declared risk"
            ],
            correctAnswer: 1,
            explanation: "Changes increasing risk should be disclosed, allowing insurers to adjust premiums accordingly.",
            difficulty: "Super Hard",
            category: "Risk Disclosure"
          },
          {
            id: 182,
            question: "A businessman takes a theft insurance policy but does not install security systems as required in the policy conditions. A theft occurs. Will the insurer pay?",
            options: [
              "Yes, as theft is covered",
              "No, since policy conditions were violated",
              "Only partial compensation",
              "Yes, but future claims may be denied"
            ],
            correctAnswer: 1,
            explanation: "Failure to comply with policy conditions, like security requirements, can result in claim denial.",
            difficulty: "Super Hard",
            category: "Policy Compliance"
          },
          {
            id: 183,
            question: "A farmer insures his crops against drought. However, due to unexpected rainfall, he harvests a good yield. Can he still claim compensation?",
            options: [
              "Yes, as the policy was purchased",
              "No, as no actual loss occurred",
              "Yes, but only for administrative costs",
              "Only if rainfall was below average"
            ],
            correctAnswer: 1,
            explanation: "Indemnity principle ensures claims are paid only for actual losses, not hypothetical risks.",
            difficulty: "Super Hard",
            category: "Agriculture Insurance"
          },
          {
            id: 184,
            question: "A person buys travel insurance but fails to declare a pre-existing heart condition. He suffers a heart attack while traveling. Will the insurer cover the medical expenses?",
            options: [
              "Yes, as travel insurance covers medical emergencies",
              "No, as non-disclosure of pre-existing conditions voids coverage",
              "Yes, but with reduced payout",
              "Only if the attack was unrelated to the condition"
            ],
            correctAnswer: 1,
            explanation: "Non-disclosure of pre-existing conditions can void medical coverage in travel insurance.",
            difficulty: "Super Hard",
            category: "Travel Insurance"
          },
          {
            id: 185,
            question: "A policyholder buys a health insurance policy but is diagnosed with a serious illness a week later. The illness was already developing before purchasing the policy but was not diagnosed. Will the insurer cover the treatment costs?",
            options: [
              "Yes, since it was not diagnosed at the time of policy purchase",
              "No, because it falls under pre-existing conditions",
              "Only if the policyholder had no prior symptoms",
              "Yes, but with a reduced payout"
            ],
            correctAnswer: 1,
            explanation: "Most insurers define pre-existing conditions based on symptoms, diagnosis, or treatment history. If undisclosed symptoms existed before policy purchase, the claim might be denied.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 186,
            question: "A person insures his house against fire but does not inform the insurer that part of the house is being used as a chemical storage facility. A fire occurs due to an unrelated electrical fault. Will the claim be settled?",
            options: [
              "Yes, since the fire was unrelated to the chemicals",
              "No, as the non-disclosure increases overall risk",
              "Yes, but with a penalty deduction",
              "Only if the insurer was previously notified"
            ],
            correctAnswer: 1,
            explanation: "Failure to disclose increased risks can lead to claim denial, even if the actual cause of damage is unrelated.",
            difficulty: "Super Hard",
            category: "Fire Insurance"
          },
          {
            id: 187,
            question: "A businessman takes marine cargo insurance but diverts the shipment to a different port without notifying the insurer. The cargo is lost at sea. How will the insurer respond?",
            options: [
              "Approve the claim fully",
              "Reject the claim due to policy violation",
              "Approve the claim but deduct penalties",
              "Only pay for partial loss"
            ],
            correctAnswer: 1,
            explanation: "Unauthorized route changes without insurer consent can lead to claim rejection under marine insurance.",
            difficulty: "Super Hard",
            category: "Marine Insurance"
          },
          {
            id: 188,
            question: "A vehicle owner lends his insured car to a friend, who then causes an accident. The insurer finds out that the driver was not listed in the policy. Will the insurer pay for the damages?",
            options: [
              "Yes, since the car is insured",
              "No, as an unlisted driver was using the vehicle",
              "Only if the friend had a valid driving license",
              "Yes, but with increased future premiums"
            ],
            correctAnswer: 1,
            explanation: "Some motor insurance policies restrict coverage based on listed drivers, leading to potential claim denial.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 189,
            question: "An insured factory suffers damage in an earthquake, but the owner had removed earthquake coverage from the policy to reduce premium costs. What will happen to the claim?",
            options: [
              "The insurer will pay as earthquake coverage is standard",
              "The claim will be rejected due to policy exclusion",
              "The insurer will pay but deduct an additional penalty",
              "The insurer will negotiate a reduced payout"
            ],
            correctAnswer: 1,
            explanation: "Optional coverage exclusions mean that specific risks, like earthquakes, are not covered unless explicitly included.",
            difficulty: "Super Hard",
            category: "Property Insurance"
          },
          {
            id: 190,
            question: "A life insurance policyholder commits suicide within six months of purchasing the policy. What will the insurer do?",
            options: [
              "Reject the claim due to suicide exclusion",
              "Pay the full sum assured",
              "Return the premiums paid but reject the claim",
              "Only pay if the nominee proves no foul play"
            ],
            correctAnswer: 1,
            explanation: "Most life insurance policies exclude suicide coverage within the first year to prevent fraudulent claims.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 191,
            question: "A corporate employee’s health insurance policy lapses, but he is hospitalized two days later. The company renews the policy retroactively. Will the insurer pay?",
            options: [
              "Yes, since the policy was renewed",
              "No, as the hospitalization occurred during the lapse",
              "Only if the premium was paid before hospitalization",
              "Yes, but with additional scrutiny"
            ],
            correctAnswer: 1,
            explanation: "Claims for events occurring during policy lapse are typically rejected, even if later renewed.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 192,
            question: "A ship owner insures his vessel but secretly uses it for illegal smuggling. During a storm, the ship sinks. What will the insurer do?",
            options: [
              "Pay the claim fully",
              "Reject the claim due to illegal activity",
              "Pay only for the legal cargo",
              "Negotiate a reduced settlement"
            ],
            correctAnswer: 1,
            explanation: "Illegal activities void insurance coverage, and insurers will deny claims in such cases.",
            difficulty: "Super Hard",
            category: "Marine Insurance"
          },
          {
            id: 193,
            question: "A homeowner insured his house but did not inform the insurer about an extension built recently, increasing its value. A fire destroys the house. How will the insurer handle the claim?",
            options: [
              "Pay only the originally insured value",
              "Pay full value including the extension",
              "Reject the claim due to non-disclosure",
              "Only pay if an assessment is done"
            ],
            correctAnswer: 1,
            explanation: "Insurance covers only declared property value, and undisclosed extensions may not be covered.",
            difficulty: "Super Hard",
            category: "Property Insurance"
          },
          {
            id: 194,
            question: "A businessman buys insurance for his stock but later moves the stock to another warehouse without notifying the insurer. The new warehouse catches fire. What happens to the claim?",
            options: [
              "The insurer will pay fully",
              "The insurer will reject the claim due to location change",
              "The insurer will pay partially",
              "The insurer will adjust the claim after investigation"
            ],
            correctAnswer: 1,
            explanation: "Changing insured property location without informing the insurer can lead to claim rejection.",
            difficulty: "Super Hard",
            category: "Fire Insurance"
          },
          {
            id: 195,
            question: "A person buys travel insurance but later learns he is terminally ill before traveling. He cancels the trip and files a claim for trip cancellation. Will the insurer cover it?",
            options: [
              "Yes, if trip cancellation due to illness is covered",
              "No, as it is a pre-existing condition",
              "Only if he proves he was unaware at purchase",
              "Yes, but only a partial refund"
            ],
            correctAnswer: 1,
            explanation: "Travel insurance policies usually exclude cancellations due to pre-existing illnesses.",
            difficulty: "Super Hard",
            category: "Travel Insurance"
          },
          {
            id: 196,
            question: "A company insures its employees under a group health plan, but an employee claims medical expenses for a dependent who is not listed under the policy. Will the insurer pay?",
            options: [
              "Yes, if dependents are covered",
              "No, as the dependent was not listed",
              "Yes, but only partially",
              "Only if the employee pays an extra premium"
            ],
            correctAnswer: 1,
            explanation: "Only listed dependents are covered under group health insurance policies.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 197,
            question: "A car owner has third-party insurance but claims for damages to his own vehicle in an accident. Will the insurer pay?",
            options: [
              "Yes, as it is an accident",
              "No, since third-party insurance does not cover own damages",
              "Only if the accident was not his fault",
              "Yes, but only 50% of the repair cost"
            ],
            correctAnswer: 1,
            explanation: "Third-party insurance covers liabilities to others, not the insured’s own damages.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 198,
            question: "A policyholder transfers his life insurance policy to a friend for money. The friend becomes the new beneficiary. Upon the insured's death, will the friend receive the sum assured?",
            options: [
              "Yes, since the policy was legally transferred",
              "No, as life insurance cannot be transferred",
              "Only if the insurer approves",
              "Yes, but only if it was notarized"
            ],
            correctAnswer: 1,
            explanation: "Life insurance policies are based on insurable interest and cannot be transferred like property.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 199,
            question: "A businessman takes a fire insurance policy for his warehouse but, to save costs, he under-declares the stock value. Later, a fire destroys the entire stock. How will the insurer respond?",
            options: [
              "Pay the full market value of the stock",
              "Pay only the insured declared value",
              "Reject the claim entirely due to misrepresentation",
              "Negotiate a payout based on actual loss"
            ],
            correctAnswer: 1,
            explanation: "Underinsurance leads to claims being settled only up to the declared value, even if the actual loss is higher.",
            difficulty: "Super Hard",
            category: "Fire Insurance"
          },
          {
            id: 200,
            question: "A person takes out a life insurance policy and assigns it to a bank as collateral for a loan. Before repaying the loan, the policyholder dies. Who will receive the sum assured?",
            options: [
              "The nominee mentioned in the policy",
              "The bank as the assignee",
              "The legal heirs of the policyholder",
              "Split between nominee and the bank"
            ],
            correctAnswer: 1,
            explanation: "When a policy is assigned to a bank, the bank has the first right to claim the sum assured to recover the loan.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 201,
            question: "A company takes a marine cargo insurance policy but ships its goods via an unregistered shipping carrier to reduce costs. The cargo is lost at sea. What will the insurer most likely do?",
            options: [
              "Pay the full claim as per the policy terms",
              "Reject the claim due to breach of policy conditions",
              "Partially pay based on the value of goods",
              "Recover losses from the shipping company"
            ],
            correctAnswer: 1,
            explanation: "Using an unregistered carrier may violate the policy terms, leading to claim rejection.",
            difficulty: "Super Hard",
            category: "Marine Insurance"
          },
          {
            id: 202,
            question: "A person with an active health insurance policy undergoes elective cosmetic surgery that results in complications requiring hospitalization. How will the insurer handle the claim?",
            options: [
              "Approve the claim under emergency treatment clause",
              "Reject the claim due to elective procedure exclusion",
              "Pay only a portion based on policy terms",
              "Approve the claim after deducting cosmetic surgery costs"
            ],
            correctAnswer: 1,
            explanation: "Elective procedures are typically excluded, and complications arising from them are usually not covered.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 203,
            question: "An insured person dies in an accident, but their death certificate states ‘natural causes.’ The nominee files a claim under an accidental death policy. What will the insurer most likely do?",
            options: [
              "Pay the claim based on the policy coverage",
              "Request further investigation before approving the claim",
              "Reject the claim citing cause of death as natural",
              "Pay only a partial benefit"
            ],
            correctAnswer: 1,
            explanation: "Accidental death policies require proof of accident; conflicting documentation will lead to an investigation.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 204,
            question: "A company buys business interruption insurance but does not maintain proper financial records. After a major fire, they file a claim. How will the insurer respond?",
            options: [
              "Approve the claim based on estimated revenue loss",
              "Reject the claim due to lack of financial proof",
              "Approve only a partial claim after independent assessment",
              "Pay the full claim based on market trends"
            ],
            correctAnswer: 1,
            explanation: "Business interruption claims require documented proof of financial loss; lack of records may lead to rejection or partial settlement.",
            difficulty: "Super Hard",
            category: "Business Insurance"
          },
          {
            id: 205,
            question: "A car owner has a comprehensive insurance policy but fails to update the insurer after modifying the vehicle for racing. If the car is damaged in a normal accident, what will happen?",
            options: [
              "The insurer will cover the full cost of repairs",
              "The claim may be reduced or rejected due to policy misrepresentation",
              "The insurer will pay based on pre-modification value",
              "The claim will be paid after deducting depreciation"
            ],
            correctAnswer: 1,
            explanation: "Undisclosed modifications can lead to claim rejection due to material misrepresentation.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 206,
            question: "A policyholder files a claim stating their insured diamond necklace was stolen, but no police report is filed. How will the insurer likely respond?",
            options: [
              "Approve the claim based on the insured’s statement",
              "Request additional proof before processing",
              "Reject the claim due to lack of official report",
              "Offer a partial settlement"
            ],
            correctAnswer: 1,
            explanation: "High-value theft claims typically require a police report for verification.",
            difficulty: "Super Hard",
            category: "Property Insurance"
          },
          {
            id: 207,
            question: "A corporate liability insurance policyholder gets sued for an act committed before purchasing the policy. Will the insurer cover the claim?",
            options: [
              "Yes, as the lawsuit occurred during policy term",
              "No, as the event predates policy inception",
              "Only if retroactive cover is included",
              "Only if the insurer is informed before the lawsuit"
            ],
            correctAnswer: 2,
            explanation: "Liability policies do not cover past events unless a retroactive clause exists.",
            difficulty: "Super Hard",
            category: "Liability Insurance"
          },
          {
            id: 208,
            question: "A businessman takes a keyman insurance policy for his company's CEO. The CEO resigns before passing away. What happens to the policy benefits?",
            options: [
              "The policy remains valid and pays out if death occurs",
              "The policy becomes void upon resignation",
              "The payout goes to the CEO’s legal heirs",
              "The insurer pays only a partial sum"
            ],
            correctAnswer: 1,
            explanation: "Keyman policies cover individuals as long as the policy remains active, regardless of employment status.",
            difficulty: "Super Hard",
            category: "Keyman Insurance"
          },
          {
            id: 209,
            question: "A health insurance policyholder gets treatment abroad, but their policy only covers treatments within their home country. How will the insurer respond?",
            options: [
              "Fully reimburse based on local treatment costs",
              "Reject the claim due to territorial limits",
              "Pay only emergency hospitalization expenses",
              "Approve the claim with extra deductions"
            ],
            correctAnswer: 1,
            explanation: "Health policies have geographic restrictions; claims outside the coverage area may be denied.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 210,
            question: "A person insures their house and later intentionally causes damage to claim compensation. What will happen if the insurer finds out?",
            options: [
              "The insurer will approve the claim as per policy terms",
              "The claim will be rejected, and legal action may follow",
              "The insurer will approve a partial amount",
              "The insurer will cancel the policy but pay the claim"
            ],
            correctAnswer: 1,
            explanation: "Intentional damage constitutes fraud and can lead to criminal charges.",
            difficulty: "Super Hard",
            category: "Fraud & Misrepresentation"
          },
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

        // Check if IC01 access code exists and is valid
        if (data.accesscode && data.accesscode.IC01) {
            const accessCodeData = data.accesscode.IC01;
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
            'IC01': {
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

        if (data.examanswers && data.examanswers.IC01 && data.examanswers.IC01.answers) {
            const savedAnswers = data.examanswers.IC01.answers;
            
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
        return `IC01-${randomPin}`;
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
                description: "IC-01 Insurance Principles Exam Access",
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
                                examType: 'IC01'
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
                    examType: 'IC01'
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
                examType: 'IC01'
            });

            if (response.data.message === "Access code is valid") {
                setIsAccessGranted(true);
                setIsTimerActive(true);
                setExamMetadata(prev => ({
                    ...prev,
                    startTime: new Date()
                }));
            }
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
        doc.text('III-IC 01: Insurance Principles Mock Report', 10, 10);
        
        // Certificate Details
        doc.setFontSize(12);
        doc.text(`Certificate Number: ${examMetadata.certificateNumber}`, 10, 50);
        doc.text(`Exam Name: Insurance Principles IC 01`, 10, 60);
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
            const logoResponse = await fetch('https://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/InspolixLeft.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJydXN0LXRpbWVycy9JbnNwb2xpeExlZnQucG5nIiwiaWF0IjoxNzQyOTg5MzQ5LCJleHAiOjMzMTk3ODkzNDl9.UXx4n65d3OTG7TvQs2N-LZI_GTIT2l5V2Ut0Jnmo1ko');
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
            doc.text('III-IC 01: Insurance Principles Mock Report', pageWidth / 2, 30, { align: 'right' });
    
            // Exam Details
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            let yPosition = 50;
    
            const addDetailLine = (label, value) => {
                doc.text(`${label}: ${value}`, margin, yPosition);
                yPosition += 10;
            };
    
            addDetailLine('Report Number', examMetadata.certificateNumber);
            addDetailLine('Exam Name', 'Insurance Principles IC 01');
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
            doc.text('III-IC 01: Insurance Principles Mock Report', pageWidth / 2, 30, { align: 'right' });
    
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
                <h1 style={{fontSize: 24}}><ScanSearch size={20} style={{marginTop: -5}} /> IRDAI: IC 01</h1>
                <p><Play size={15} style={{marginTop: -3}} /> Module: Principles of Insurance</p>
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
                    
                    {accessCodeError && (
                        <div className={styles.errorMessage}>
                            {accessCodeError}
                        </div>
                    )}
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
                        <Disc size={18} /> IC-01: Insurance Principles Exam
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
