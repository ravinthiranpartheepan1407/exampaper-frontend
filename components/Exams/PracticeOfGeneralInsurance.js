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


export default function PracticeOfGeneralInsurance() {
    const questions = [
        {
            id: 1,
            question: "Which of the following best describes the role of an insurer?",
            options: [
              "To bear all financial risks",
              "To distribute and manage risk",
              "To prevent losses from occurring",
              "To guarantee no losses to the insured"
            ],
            correctAnswer: 1,
            explanation: "The insurer's role is to distribute and manage risk, not bear all financial risks or prevent losses entirely.",
            difficulty: "Easy",
            category: "Insurance Basics"
          },
          {
            id: 2,
            question: "Which factor primarily determines the premium of a general insurance policy?",
            options: [
              "The insurer’s profit margin",
              "The sum insured only",
              "The risk profile and coverage",
              "The insured’s claim history only"
            ],
            correctAnswer: 2,
            explanation: "Premium is primarily determined by the risk profile and coverage, not just sum insured or claim history.",
            difficulty: "Easy",
            category: "Premium Calculation"
          },
          {
            id: 3,
            question: "In insurance, what does 'moral hazard' refer to?",
            options: [
              "The risk arising from dishonest behavior of the insured",
              "The danger of losing insurance benefits",
              "The possibility of a natural disaster",
              "The reduction of insurance claims"
            ],
            correctAnswer: 0,
            explanation: "Moral hazard refers to the risk that an insured may act dishonestly or carelessly after obtaining insurance.",
            difficulty: "Easy",
            category: "Risk and Hazards"
          },
          {
            id: 4,
            question: "Which of the following is NOT a principle of insurance?",
            options: [
              "Principle of Indemnity",
              "Principle of Utmost Good Faith",
              "Principle of Unlimited Gains",
              "Principle of Contribution"
            ],
            correctAnswer: 2,
            explanation: "Insurance does not follow the principle of unlimited gains; it is meant to compensate for actual loss only.",
            difficulty: "Easy",
            category: "Insurance Principles"
          },
          {
            id: 5,
            question: "Which is the primary function of an insurance contract?",
            options: [
              "To generate wealth for the insured",
              "To legally bind the insurer and insured",
              "To eliminate all risks",
              "To create uncertainty for the insured"
            ],
            correctAnswer: 1,
            explanation: "An insurance contract legally binds the insurer and insured to agreed terms, not to generate wealth or eliminate all risks.",
            difficulty: "Easy",
            category: "Contracts and Policies"
          },
          {
            id: 6,
            question: "Which document is the proof of an insurance contract?",
            options: [
              "Proposal form",
              "Premium receipt",
              "Insurance policy document",
              "Claim settlement report"
            ],
            correctAnswer: 2,
            explanation: "The insurance policy document serves as proof of the insurance contract, not the proposal form or receipt.",
            difficulty: "Easy",
            category: "Policy Documentation"
          },
          {
            id: 7,
            question: "Which of these is an example of insurable interest?",
            options: [
              "A person buying insurance for their friend’s car",
              "A person insuring their own home",
              "A business insuring a competitor’s assets",
              "A stranger insuring a random vehicle"
            ],
            correctAnswer: 1,
            explanation: "Insurable interest exists when a person benefits financially from the insured asset, like their own home.",
            difficulty: "Easy",
            category: "Insurance Basics"
          },
          {
            id: 8,
            question: "When does an insurance policy typically take effect?",
            options: [
              "When the insurer decides",
              "When the insured submits the proposal form",
              "When the premium is paid and the policy is issued",
              "After a claim is made"
            ],
            correctAnswer: 2,
            explanation: "A policy takes effect once the premium is paid and the policy is issued, not merely when a proposal is submitted.",
            difficulty: "Easy",
            category: "Policy Activation"
          },
          {
            id: 9,
            question: "Which of the following is NOT a type of general insurance?",
            options: [
              "Health Insurance",
              "Fire Insurance",
              "Life Insurance",
              "Motor Insurance"
            ],
            correctAnswer: 2,
            explanation: "Life insurance is not considered general insurance; it falls under life insurance policies.",
            difficulty: "Easy",
            category: "Types of Insurance"
          },
          {
            id: 10,
            question: "Which of these risks is typically NOT covered under a general insurance policy?",
            options: [
              "Fire damage",
              "Personal accident",
              "Intentional damage",
              "Theft"
            ],
            correctAnswer: 2,
            explanation: "Intentional damage is not covered by insurance as it is against the principles of indemnity.",
            difficulty: "Easy",
            category: "Policy Exclusions"
          },
          {
            id: 11,
            question: "Which of the following best describes 'third-party insurance'?",
            options: [
              "Insurance that covers the policyholder only",
              "Insurance that covers only third parties affected by the insured",
              "Insurance that benefits both the insurer and the insured",
              "Insurance that covers losses beyond the insured amount"
            ],
            correctAnswer: 1,
            explanation: "Third-party insurance covers damages caused by the insured to a third party, not the insured themselves.",
            difficulty: "Easy",
            category: "Motor Insurance"
          },
          {
            id: 12,
            question: "What is the primary objective of reinsurance?",
            options: [
              "To increase the profits of the insurer",
              "To transfer part of the risk to another insurer",
              "To reduce the insured’s premium",
              "To avoid claim settlements"
            ],
            correctAnswer: 1,
            explanation: "Reinsurance allows insurers to transfer part of their risk to another insurer to manage large claims.",
            difficulty: "Easy",
            category: "Reinsurance"
          },
          {
            id: 13,
            question: "What happens if an insured person under-declares the value of an asset?",
            options: [
              "The premium remains the same",
              "The claim will be paid in full",
              "The claim will be reduced proportionally",
              "The insurer will increase the coverage automatically"
            ],
            correctAnswer: 2,
            explanation: "Under-declaring an asset’s value leads to reduced claim payouts based on the proportionate rule.",
            difficulty: "Easy",
            category: "Underinsurance"
          },
          {
            id: 14,
            question: "Which factor determines whether a risk is insurable?",
            options: [
              "It must be uncertain and financially measurable",
              "It must be a personal choice",
              "It must be a frequent occurrence",
              "It must have no financial implications"
            ],
            correctAnswer: 0,
            explanation: "An insurable risk must be uncertain and financially measurable, not just frequent or personal.",
            difficulty: "Easy",
            category: "Risk Assessment"
          },
          {
            id: 15,
            question: "Which principle ensures that an insured person cannot make a profit from insurance?",
            options: [
              "Principle of Indemnity",
              "Principle of Contribution",
              "Principle of Proximate Cause",
              "Principle of Subrogation"
            ],
            correctAnswer: 0,
            explanation: "The principle of indemnity ensures that the insured is compensated only for the actual loss suffered.",
            difficulty: "Easy",
            category: "Insurance Principles"
          },
          {
            id: 16,
            question: "Which of the following best describes the purpose of a deductible in an insurance policy?",
            options: [
              "To increase the claim amount",
              "To reduce the insurer's liability",
              "To eliminate the need for claims",
              "To ensure the insured pays nothing"
            ],
            correctAnswer: 1,
            explanation: "A deductible reduces the insurer's liability by requiring the insured to bear part of the loss before a claim is paid.",
            difficulty: "Easy",
            category: "Claims Management"
          },
          {
            id: 17,
            question: "When can an insurance policy be considered void?",
            options: [
              "When the insured fails to renew it",
              "When a claim is made",
              "When the insured does not disclose material facts",
              "When the insurer pays out a claim"
            ],
            correctAnswer: 2,
            explanation: "A policy can be void if the insured does not disclose material facts, which is a violation of utmost good faith.",
            difficulty: "Easy",
            category: "Legal Principles"
          },
          {
            id: 18,
            question: "Which of the following is NOT an insurable risk?",
            options: [
              "Theft of a car",
              "Stock market loss",
              "Fire damage to a home",
              "Accidental injury"
            ],
            correctAnswer: 1,
            explanation: "Stock market losses are speculative and not insurable, while theft, fire, and injury risks are insurable.",
            difficulty: "Easy",
            category: "Risk Assessment"
          },
          {
            id: 19,
            question: "What happens if a policyholder pays a lower premium due to incorrect information?",
            options: [
              "The claim will be paid fully",
              "The insurer may reject the claim",
              "The insured will receive a bonus",
              "The premium will be adjusted after the claim"
            ],
            correctAnswer: 1,
            explanation: "If incorrect information leads to a lower premium, the insurer may reject or reduce the claim payout.",
            difficulty: "Easy",
            category: "Policy Compliance"
          },
          {
            id: 20,
            question: "Which situation demonstrates the principle of subrogation?",
            options: [
              "An insurer pays a claim and takes legal action against a third party",
              "An insured receives compensation and keeps the damaged asset",
              "An insurer increases the premium after a claim",
              "An insured files multiple claims for the same incident"
            ],
            correctAnswer: 0,
            explanation: "Subrogation allows an insurer to recover claim costs from a third party responsible for the loss.",
            difficulty: "Easy",
            category: "Legal Principles"
          },
          {
            id: 21,
            question: "If an insured person does NOT have an insurable interest in an asset, what happens?",
            options: [
              "The policy remains valid",
              "The claim is rejected",
              "The insurer increases coverage",
              "The insured can transfer the policy to someone else"
            ],
            correctAnswer: 1,
            explanation: "Without insurable interest, the policy is invalid, and any claim made would be rejected.",
            difficulty: "Easy",
            category: "Insurable Interest"
          },
          {
            id: 22,
            question: "Which of the following is an example of proximate cause in insurance?",
            options: [
              "A fire causes water damage from firefighting efforts",
              "An insured claims damage for a past accident",
              "A policyholder reports an unrelated incident",
              "An insurer pays a claim without verification"
            ],
            correctAnswer: 0,
            explanation: "Proximate cause determines the primary reason for loss, such as water damage due to firefighting efforts.",
            difficulty: "Easy",
            category: "Claims Management"
          },
          {
            id: 23,
            question: "What is the main difference between co-insurance and reinsurance?",
            options: [
              "Co-insurance involves multiple insurers sharing a policy, while reinsurance is between an insurer and a reinsurer",
              "Reinsurance is for small policies, co-insurance is for large policies",
              "Co-insurance is mandatory for all policies, reinsurance is optional",
              "Reinsurance is when the insured buys multiple policies"
            ],
            correctAnswer: 0,
            explanation: "Co-insurance involves multiple insurers sharing a policy, while reinsurance is when an insurer transfers risk to another insurer.",
            difficulty: "Easy",
            category: "Risk Management"
          },
          {
            id: 24,
            question: "If a policyholder submits a fraudulent claim, what can the insurer do?",
            options: [
              "Pay the claim and increase the premium",
              "Cancel the policy and take legal action",
              "Ignore the claim and continue coverage",
              "Reduce the claim payout"
            ],
            correctAnswer: 1,
            explanation: "A fraudulent claim can lead to policy cancellation and legal action against the policyholder.",
            difficulty: "Easy",
            category: "Fraud Prevention"
          },
          {
            id: 25,
            question: "How does an excess (deductible) in a policy impact claims?",
            options: [
              "The insurer covers the entire loss",
              "The insured bears part of the loss before the insurer pays",
              "The claim amount is doubled",
              "The insured receives full reimbursement"
            ],
            correctAnswer: 1,
            explanation: "An excess requires the insured to bear part of the loss before the insurer covers the remaining amount.",
            difficulty: "Easy",
            category: "Claims Processing"
          },
          {
            id: 26,
            question: "What is the primary purpose of co-pay in a health insurance policy?",
            options: [
              "To reduce insurer liability and prevent unnecessary claims",
              "To cover the full cost of medical treatment",
              "To allow insureds to claim more",
              "To let the insurer deny all claims"
            ],
            correctAnswer: 0,
            explanation: "Co-pay requires the insured to share medical costs, reducing insurer liability and discouraging unnecessary claims.",
            difficulty: "Easy",
            category: "Health Insurance"
          },
          {
            id: 27,
            question: "If an insured has multiple policies for the same risk, which principle applies?",
            options: [
              "Principle of Contribution",
              "Principle of Indemnity",
              "Principle of Subrogation",
              "Principle of Proximate Cause"
            ],
            correctAnswer: 0,
            explanation: "The principle of contribution ensures that multiple insurers share the claim payment proportionally.",
            difficulty: "Easy",
            category: "Multiple Policies"
          },
          {
            id: 28,
            question: "Which factor affects the sum insured for a property insurance policy?",
            options: [
              "Market value of the property",
              "Premium paid",
              "Policy term",
              "Number of claims filed"
            ],
            correctAnswer: 0,
            explanation: "The sum insured is based on the market value or reinstatement value of the property.",
            difficulty: "Easy",
            category: "Property Insurance"
          },
          {
            id: 29,
            question: "What happens if an insured person does not disclose a pre-existing condition?",
            options: [
              "The insurer may reject future claims",
              "The policy remains valid",
              "The insured pays lower premiums",
              "The insurer automatically adjusts coverage"
            ],
            correctAnswer: 0,
            explanation: "Non-disclosure of pre-existing conditions may lead to claim rejection or policy cancellation.",
            difficulty: "Easy",
            category: "Health Insurance"
          },
          {
            id: 30,
            question: "What is the role of an insurance broker?",
            options: [
              "To represent the insured and find suitable policies",
              "To underwrite policies on behalf of insurers",
              "To pay claims on behalf of insurers",
              "To set insurance regulations"
            ],
            correctAnswer: 0,
            explanation: "Insurance brokers act on behalf of the insured, helping them find the best policies from various insurers.",
            difficulty: "Easy",
            category: "Intermediaries"
          },
          {
            id: 31,
            question: "Which of the following best describes moral hazard in insurance?",
            options: [
              "Risk arising from external events",
              "Increase in risky behavior due to insurance coverage",
              "Unforeseen natural disasters",
              "Deliberate misrepresentation by the insurer"
            ],
            correctAnswer: 1,
            explanation: "Moral hazard refers to the tendency of the insured to take more risks because they have insurance coverage.",
            difficulty: "Medium",
            category: "Risk Management"
          },
          {
            id: 32,
            question: "Which situation violates the principle of contribution in insurance?",
            options: [
              "Insuring a car with two companies and claiming full amount from one",
              "Having multiple health insurance policies",
              "Paying premiums to two different insurers",
              "Getting a policy from a third party"
            ],
            correctAnswer: 0,
            explanation: "The principle of contribution ensures that multiple insurers share the claim payment proportionally.",
            difficulty: "Medium",
            category: "Multiple Policies"
          },
          {
            id: 33,
            question: "What happens when an insured claims higher than the actual loss under an indemnity policy?",
            options: [
              "Insurer pays the full claim",
              "Insurer rejects the claim",
              "Insurer compensates only for the actual loss",
              "Insurer increases the premium"
            ],
            correctAnswer: 2,
            explanation: "Indemnity ensures that the insured is compensated only for the actual financial loss and not for more.",
            difficulty: "Medium",
            category: "Claims Management"
          },
          {
            id: 34,
            question: "If an insurer delays claim settlement without a valid reason, which legal principle is affected?",
            options: [
              "Utmost Good Faith",
              "Proximate Cause",
              "Subrogation",
              "Insurable Interest"
            ],
            correctAnswer: 0,
            explanation: "Utmost good faith requires both parties to act in a fair and honest manner, including timely claim settlement.",
            difficulty: "Medium",
            category: "Legal Principles"
          },
          {
            id: 35,
            question: "Which of the following does NOT impact the premium of a general insurance policy?",
            options: [
              "Level of risk involved",
              "Sum insured",
              "Number of claims made",
              "Number of family members"
            ],
            correctAnswer: 3,
            explanation: "While risk level, sum insured, and claims history impact premiums, the number of family members does not directly affect general insurance premiums.",
            difficulty: "Medium",
            category: "Premium Calculation"
          },
          {
            id: 36,
            question: "If an insured property is underinsured and suffers partial damage, what is the insurer’s likely action?",
            options: [
              "Pay the full sum insured",
              "Pay a proportionate amount of the claim",
              "Reject the claim entirely",
              "Increase the insured amount automatically"
            ],
            correctAnswer: 1,
            explanation: "Underinsurance leads to application of the average clause, where the insurer pays only a proportionate amount of the claim.",
            difficulty: "Medium",
            category: "Claims Management"
          },
          {
            id: 37,
            question: "A person intentionally damages their insured property to claim compensation. Which type of hazard does this represent?",
            options: [
              "Physical Hazard",
              "Moral Hazard",
              "Legal Hazard",
              "Economic Hazard"
            ],
            correctAnswer: 1,
            explanation: "Moral hazard refers to dishonest behavior by an insured to gain financial benefits from insurance.",
            difficulty: "Medium",
            category: "Risk Management"
          },
          {
            id: 38,
            question: "If a policyholder forgets to disclose a minor pre-existing illness while buying health insurance, what can happen?",
            options: [
              "The claim for that illness may be rejected",
              "The entire policy becomes invalid",
              "The insurer will still pay the full claim",
              "The insured must take a new policy"
            ],
            correctAnswer: 0,
            explanation: "Non-disclosure of a pre-existing illness can lead to claim rejection for that specific condition.",
            difficulty: "Medium",
            category: "Policy Compliance"
          },
          {
            id: 39,
            question: "Which of the following is NOT a characteristic of insurable risks?",
            options: [
              "Loss must be accidental",
              "Loss must be measurable",
              "Loss must be caused by intentional actions",
              "Loss must be financially significant"
            ],
            correctAnswer: 2,
            explanation: "Insurance covers accidental losses, not intentional actions by the insured.",
            difficulty: "Medium",
            category: "Risk Assessment"
          },
          {
            id: 40,
            question: "What is the impact of under-declaring the value of insured goods in marine insurance?",
            options: [
              "Full claim is paid",
              "Claim is rejected",
              "Claim is paid proportionately",
              "Insurer increases the insured amount"
            ],
            correctAnswer: 2,
            explanation: "Under-declaring value results in proportional claim payments based on the insured amount.",
            difficulty: "Medium",
            category: "Marine Insurance"
          },
          {
            id: 41,
            question: "Which of the following best describes proximate cause in insurance claims?",
            options: [
              "The most direct, effective cause of loss",
              "A minor contributing factor in loss",
              "The legal interpretation of a claim",
              "A delay in claim processing"
            ],
            correctAnswer: 0,
            explanation: "Proximate cause refers to the most direct and dominant reason for a loss in an insurance claim.",
            difficulty: "Medium",
            category: "Claims Management"
          },
          {
            id: 42,
            question: "If an insured person takes an insurance policy just before undergoing a major surgery, which principle is violated?",
            options: [
              "Principle of Subrogation",
              "Principle of Indemnity",
              "Principle of Utmost Good Faith",
              "Principle of Contribution"
            ],
            correctAnswer: 2,
            explanation: "The insured must disclose all material facts, including impending medical procedures, to uphold the principle of utmost good faith.",
            difficulty: "Medium",
            category: "Legal Principles"
          },
          {
            id: 43,
            question: "What does the 'waiting period' in a health insurance policy mean?",
            options: [
              "The time taken for a claim to be processed",
              "The period before coverage starts for certain illnesses",
              "The insurer's response time to a claim",
              "The time for policy renewal"
            ],
            correctAnswer: 1,
            explanation: "A waiting period is the time before an insurance policy starts covering certain illnesses or conditions.",
            difficulty: "Medium",
            category: "Health Insurance"
          },
          {
            id: 44,
            question: "Why is insurable interest required at the time of policy inception?",
            options: [
              "To prevent speculative insurance purchases",
              "To ensure claims are paid faster",
              "To increase insurer profits",
              "To allow any person to insure anything"
            ],
            correctAnswer: 0,
            explanation: "Insurable interest prevents people from insuring things in which they have no financial stake, avoiding speculative insurance purchases.",
            difficulty: "Medium",
            category: "Insurable Interest"
          },
          {
            id: 45,
            question: "Which of the following statements about the surrender value of an insurance policy is correct?",
            options: [
              "Surrender value is payable only for term insurance",
              "Surrender value is the amount paid when a policy is voluntarily terminated before maturity",
              "Surrender value is always equal to the sum insured",
              "Surrender value is the additional bonus in all policies"
            ],
            correctAnswer: 1,
            explanation: "Surrender value is the amount paid to the policyholder if the policy is terminated before maturity.",
            difficulty: "Medium",
            category: "Policy Termination"
          },
          {
            id: 46,
            question: "What happens if an insured person deliberately withholds critical health information while purchasing a policy?",
            options: [
              "The policy remains valid but claims may be reduced",
              "The policy remains valid and claims are honored fully",
              "The insurer can void the policy if non-disclosure is discovered",
              "The insurer can charge additional premium retroactively"
            ],
            correctAnswer: 2,
            explanation: "If an insured withholds crucial information, the insurer can void the policy based on the principle of utmost good faith.",
            difficulty: "Medium",
            category: "Policy Compliance"
          },
          {
            id: 47,
            question: "An insured has two fire insurance policies covering the same property and claims full compensation from one insurer. What principle is violated?",
            options: [
              "Principle of Subrogation",
              "Principle of Contribution",
              "Principle of Indemnity",
              "Principle of Proximate Cause"
            ],
            correctAnswer: 1,
            explanation: "The principle of contribution ensures that multiple insurers share the loss proportionally.",
            difficulty: "Medium",
            category: "Multiple Policies"
          },
          {
            id: 48,
            question: "A vehicle owner transfers ownership but does not inform the insurer. What will happen if the vehicle meets with an accident?",
            options: [
              "The claim will be paid to the new owner",
              "The claim will be rejected due to lack of insurable interest",
              "The old owner can claim the insurance",
              "The insurer will adjust the premium for the new owner"
            ],
            correctAnswer: 1,
            explanation: "Insurance contracts require insurable interest; once ownership changes, the original policyholder loses insurable interest.",
            difficulty: "Medium",
            category: "Motor Insurance"
          },
          {
            id: 49,
            question: "A factory catches fire due to an electrical short circuit, but the insurance policy excludes electrical faults. What will happen?",
            options: [
              "Claim is payable as fire is covered",
              "Claim is partially payable after investigation",
              "Claim is rejected as per policy terms",
              "Claim is paid but with a penalty deduction"
            ],
            correctAnswer: 2,
            explanation: "If the policy explicitly excludes electrical faults, the claim will be rejected.",
            difficulty: "Medium",
            category: "Claims Management"
          },
          {
            id: 50,
            question: "Which of these best describes the principle of subrogation in insurance?",
            options: [
              "Insurer recovers claim amount from a third party responsible for the loss",
              "Insurer allows the insured to claim from multiple sources",
              "Insurer and insured share the claim amount equally",
              "Insured can transfer the claim amount to another person"
            ],
            correctAnswer: 0,
            explanation: "Subrogation allows the insurer to recover the claim amount from a third party responsible for the damage.",
            difficulty: "Medium",
            category: "Legal Principles"
          },
          {
            id: 51,
            question: "A health insurance policyholder files a claim for a pre-existing condition that was not disclosed at policy inception. What is the most likely outcome?",
            options: [
              "Claim will be fully paid",
              "Claim will be partially paid based on insurer discretion",
              "Claim will be rejected",
              "Claim will be paid after an additional premium is charged"
            ],
            correctAnswer: 2,
            explanation: "Non-disclosure of pre-existing conditions can lead to claim rejection under the principle of utmost good faith.",
            difficulty: "Medium",
            category: "Health Insurance"
          },
          {
            id: 52,
            question: "What happens if an insured does not pay the premium within the grace period?",
            options: [
              "Policy remains valid but claims are limited",
              "Policy lapses and requires revival",
              "Insurer will deduct the unpaid premium from future claims",
              "Policy remains active with a penalty charge"
            ],
            correctAnswer: 1,
            explanation: "If premium is not paid within the grace period, the policy lapses and may require revival.",
            difficulty: "Medium",
            category: "Policy Management"
          },
          {
            id: 53,
            question: "A customer buys a travel insurance policy but cancels their trip before departure. What is the most likely outcome?",
            options: [
              "Premium is refunded in full",
              "Premium is partially refunded",
              "Policy remains valid for future trips",
              "No refund is provided"
            ],
            correctAnswer: 1,
            explanation: "Most travel insurance policies offer partial refunds if the trip is canceled before departure, subject to policy terms.",
            difficulty: "Medium",
            category: "Travel Insurance"
          },
          {
            id: 54,
            question: "In a motor insurance policy, what does 'No Claim Bonus' (NCB) mean?",
            options: [
              "A bonus payment made to the insured",
              "A discount on future premiums for not making claims",
              "A penalty for not claiming insurance",
              "An increase in coverage after a claim-free year"
            ],
            correctAnswer: 1,
            explanation: "NCB provides a discount on future premiums for policyholders who do not make claims.",
            difficulty: "Medium",
            category: "Motor Insurance"
          },
          {
            id: 55,
            question: "A person insures their spouse’s car but does not use it themselves. Is this valid under insurance principles?",
            options: [
              "Yes, if both are in the same family",
              "No, as there is no insurable interest",
              "Yes, if they pay the premium",
              "No, unless they are a co-owner"
            ],
            correctAnswer: 1,
            explanation: "Insurable interest is required to insure an asset, and merely being a spouse does not automatically grant it.",
            difficulty: "Medium",
            category: "Insurable Interest"
          },
          {
            id: 56,
            question: "If an insured’s warehouse is destroyed by a flood, but their policy excludes flood damage, what will happen?",
            options: [
              "Claim will be rejected",
              "Insurer will pay half the claim amount",
              "Insurer will pay and charge extra premium later",
              "Insurer will adjust the claim with another covered peril"
            ],
            correctAnswer: 0,
            explanation: "If flood damage is excluded in the policy, the insurer is not liable to pay the claim.",
            difficulty: "Medium",
            category: "Claims Management"
          },
          {
            id: 57,
            question: "A person buys an insurance policy and immediately files a claim for an event that occurred before purchasing the policy. What is the likely insurer response?",
            options: [
              "Pay the claim fully",
              "Reject the claim due to pre-existing loss",
              "Investigate and then pay partially",
              "Adjust the premium retroactively"
            ],
            correctAnswer: 1,
            explanation: "Insurance does not cover losses that occurred before policy purchase, as it violates the principle of utmost good faith.",
            difficulty: "Medium",
            category: "Fraud Detection"
          },
          {
            id: 58,
            question: "A policyholder submits false documents to inflate a claim amount. What principle is being violated?",
            options: [
              "Principle of Contribution",
              "Principle of Subrogation",
              "Principle of Utmost Good Faith",
              "Principle of Proximate Cause"
            ],
            correctAnswer: 2,
            explanation: "Submitting false documents breaches the principle of utmost good faith, leading to possible claim rejection and legal action.",
            difficulty: "Medium",
            category: "Fraud Detection"
          },
          {
            id: 59,
            question: "A factory owner insures a building for less than its market value. What will happen in case of a partial loss?",
            options: [
              "Claim will be paid in full",
              "Claim will be rejected",
              "Claim will be paid proportionally",
              "Claim will be adjusted for depreciation"
            ],
            correctAnswer: 2,
            explanation: "Underinsurance leads to application of the average clause, where the insurer pays only a proportionate amount of the claim.",
            difficulty: "Medium",
            category: "Property Insurance"
          },
          {
            id: 60,
            question: "What is the primary function of a deductible in an insurance policy?",
            options: [
              "To increase the insurer’s liability",
              "To reduce minor claims and promote responsible behavior",
              "To increase claim payouts",
              "To provide additional benefits to policyholders"
            ],
            correctAnswer: 1,
            explanation: "A deductible reduces minor claims and encourages policyholders to take precautions against risks.",
            difficulty: "Medium",
            category: "Premium Calculation"
          },
          {
            id: 61,
            question: "An insured person files a claim for an accidental injury that occurred after the policy expired. What is the insurer most likely to do?",
            options: [
              "Reject the claim as the policy was not active",
              "Accept the claim as accidents are unforeseeable",
              "Adjust the claim with a new policy",
              "Approve the claim but charge a penalty"
            ],
            correctAnswer: 0,
            explanation: "Insurance coverage is valid only during the policy period; claims for events after expiration are not covered.",
            difficulty: "Medium",
            category: "Policy Validity"
          },
          {
            id: 62,
            question: "A business owner insures a warehouse against fire but does not install fire safety equipment despite being required by policy terms. What will happen if a fire occurs?",
            options: [
              "Claim will be paid in full",
              "Claim will be reduced or denied due to policy violation",
              "Claim will be approved with higher premium next time",
              "Claim will be delayed but eventually paid"
            ],
            correctAnswer: 1,
            explanation: "Failure to follow safety measures specified in the policy may lead to claim reduction or rejection.",
            difficulty: "Medium",
            category: "Risk Compliance"
          },
          {
            id: 63,
            question: "A person buys life insurance and dies within the free-look period. What will the insurer do?",
            options: [
              "Reject the claim as the free-look period was active",
              "Pay the claim fully",
              "Refund only the premium paid",
              "Pay the claim after an investigation"
            ],
            correctAnswer: 3,
            explanation: "If a death occurs within the free-look period, insurers usually investigate for fraud before deciding on the payout.",
            difficulty: "Medium",
            category: "Life Insurance"
          },
          {
            id: 64,
            question: "An insured person sells their insured vehicle but does not transfer the insurance. What will happen if the new owner has an accident?",
            options: [
              "The old owner can claim the insurance",
              "The claim will be rejected due to lack of insurable interest",
              "The claim will be paid to the new owner",
              "The insurer will adjust the policy accordingly"
            ],
            correctAnswer: 1,
            explanation: "Once the ownership changes, the original insured loses insurable interest, making the claim invalid.",
            difficulty: "Medium",
            category: "Motor Insurance"
          },
          {
            id: 65,
            question: "A fire insurance policy covers a shop that was intentionally set on fire by the shop owner. What will happen?",
            options: [
              "The claim will be rejected due to fraud",
              "The claim will be paid as per policy terms",
              "The claim will be partially paid",
              "The insurer will negotiate a reduced payout"
            ],
            correctAnswer: 0,
            explanation: "Insurance does not cover intentional losses caused by the policyholder.",
            difficulty: "Medium",
            category: "Fraud Prevention"
          },
          {
            id: 66,
            question: "An insured buys a travel insurance policy but forgets to carry the policy details while traveling. What will happen in case of a claim?",
            options: [
              "Claim will be rejected",
              "Claim can still be processed with verification",
              "Claim will be paid partially",
              "Insurer will issue a new policy"
            ],
            correctAnswer: 1,
            explanation: "Insurance is still valid, and claims can be processed with verification of details.",
            difficulty: "Medium",
            category: "Travel Insurance"
          },
          {
            id: 67,
            question: "If an insured business suffers loss due to an earthquake, but the policy does not explicitly mention earthquake coverage, what happens?",
            options: [
              "Claim is paid as a natural disaster",
              "Claim is rejected as earthquake coverage was not specified",
              "Claim is adjusted with other covered losses",
              "Claim is delayed for assessment"
            ],
            correctAnswer: 1,
            explanation: "Unless explicitly covered, earthquake damage is not compensated under general property insurance policies.",
            difficulty: "Medium",
            category: "Property Insurance"
          },
          {
            id: 68,
            question: "A policyholder intentionally provides incorrect age details to get a lower premium. What happens if they file a claim?",
            options: [
              "Claim will be fully honored",
              "Claim will be adjusted based on actual age",
              "Policy will be terminated, and claim rejected",
              "Claim will be delayed but eventually paid"
            ],
            correctAnswer: 2,
            explanation: "Providing false information breaches the principle of utmost good faith, leading to claim rejection or policy termination.",
            difficulty: "Medium",
            category: "Fraud Detection"
          },
          {
            id: 69,
            question: "A person buys health insurance but later finds out the policy has an initial waiting period. What does this mean?",
            options: [
              "No claims can be made during this period",
              "Only partial claims can be made",
              "Claims will be paid but with deductions",
              "Claims will be processed at insurer's discretion"
            ],
            correctAnswer: 0,
            explanation: "Many health insurance policies have an initial waiting period during which no claims are entertained.",
            difficulty: "Medium",
            category: "Health Insurance"
          },
          {
            id: 70,
            question: "If a person has multiple health insurance policies, how will a claim be processed?",
            options: [
              "Claim can be made under all policies for full reimbursement",
              "Claim must be distributed proportionally among insurers",
              "Only one insurer will pay the claim",
              "The insured can choose which insurer pays the claim"
            ],
            correctAnswer: 1,
            explanation: "Under the principle of contribution, multiple insurers share the claim proportionally.",
            difficulty: "Medium",
            category: "Multiple Policies"
          },
          {
            id: 71,
            question: "A factory owner adds new machinery but does not inform the insurer. What happens in case of a machinery breakdown?",
            options: [
              "Claim is fully covered",
              "Claim is rejected as machinery was not disclosed",
              "Insurer will cover partial loss",
              "Policy premium will be adjusted after the claim"
            ],
            correctAnswer: 1,
            explanation: "If a significant asset is not disclosed, the insurer may reject claims related to it.",
            difficulty: "Medium",
            category: "Risk Compliance"
          },
          {
            id: 72,
            question: "A customer pays an insurance premium but the transaction fails due to a banking error. What happens?",
            options: [
              "Policy remains active until the issue is resolved",
              "Policy lapses due to non-payment",
              "Insurer will issue a temporary cover",
              "Insurer adjusts the payment in the next cycle"
            ],
            correctAnswer: 1,
            explanation: "If premium payment fails, the policy may lapse unless rectified within the grace period.",
            difficulty: "Medium",
            category: "Policy Payment"
          },
          {
            id: 73,
            question: "A life insurance policyholder takes a loan against the policy but dies before repaying it. What happens to the claim?",
            options: [
              "Claim is rejected",
              "Claim is paid after deducting the loan amount",
              "Claim is paid in full",
              "Claim is delayed for loan settlement"
            ],
            correctAnswer: 1,
            explanation: "If there is an outstanding loan, the insurer deducts the amount from the claim payout.",
            difficulty: "Medium",
            category: "Life Insurance"
          },
          {
            id: 74,
            question: "A vehicle owner modifies their car significantly after purchasing insurance but does not inform the insurer. What happens if the car is in an accident?",
            options: [
              "Claim is paid fully",
              "Claim is reduced or denied due to non-disclosure",
              "Claim is delayed but paid later",
              "Claim is paid after a fine is imposed"
            ],
            correctAnswer: 1,
            explanation: "Failure to inform the insurer about modifications can lead to claim reduction or rejection.",
            difficulty: "Medium",
            category: "Motor Insurance"
          },
          {
            id: 75,
            question: "What is the key difference between ‘named perils’ and ‘all-risk’ insurance policies?",
            options: [
              "Named perils cover specified risks, while all-risk covers everything except exclusions",
              "Both cover the same risks",
              "All-risk policies cover future unknown risks",
              "Named perils require special approval"
            ],
            correctAnswer: 0,
            explanation: "Named perils policies specify covered risks, while all-risk covers all except listed exclusions.",
            difficulty: "Medium",
            category: "Policy Types"
          },
          {
            id: 76,
            question: "An insured person files a health insurance claim for a pre-existing condition that was not disclosed. What is the insurer likely to do?",
            options: [
              "Approve the claim after verifying medical history",
              "Reject the claim due to non-disclosure",
              "Approve but with a penalty on future premiums",
              "Partially pay based on available coverage"
            ],
            correctAnswer: 1,
            explanation: "Non-disclosure of pre-existing conditions breaches the principle of utmost good faith, leading to claim rejection.",
            difficulty: "Hard",
            category: "Health Insurance"
          },
          {
            id: 77,
            question: "A factory is insured under a fire policy but suffers water damage from firefighting efforts. What happens?",
            options: [
              "Claim is denied as fire policy does not cover water damage",
              "Claim is accepted since the water damage is a consequence of fire",
              "Claim is partially paid after assessment",
              "Claim is rejected unless fire damage is severe"
            ],
            correctAnswer: 1,
            explanation: "Fire policies usually cover consequential damages like water damage from firefighting.",
            difficulty: "Hard",
            category: "Property Insurance"
          },
          {
            id: 78,
            question: "A vehicle owner renews their motor insurance but forgets to mention that the car was modified for racing. What happens if the car is in an accident?",
            options: [
              "Claim is fully paid",
              "Claim is denied due to non-disclosure of modifications",
              "Claim is paid with a fine imposed",
              "Claim is partially approved"
            ],
            correctAnswer: 1,
            explanation: "Non-disclosure of modifications that affect risk profile can lead to claim denial.",
            difficulty: "Hard",
            category: "Motor Insurance"
          },
          {
            id: 79,
            question: "A person insured their jewelry under a home insurance policy, but loses it while traveling abroad. What will the insurer do?",
            options: [
              "Approve the claim as jewelry is covered under home insurance",
              "Reject the claim as loss occurred outside home premises",
              "Approve after deducting depreciation",
              "Approve the claim but at a lower sum insured"
            ],
            correctAnswer: 1,
            explanation: "Standard home insurance covers losses within the insured premises, unless a specific rider for external coverage is included.",
            difficulty: "Hard",
            category: "Home Insurance"
          },
          {
            id: 80,
            question: "A life insurance policyholder dies in a foreign country under mysterious circumstances. What is the insurer's likely response?",
            options: [
              "Immediately approve the claim",
              "Reject the claim due to location of death",
              "Investigate the claim before approval",
              "Approve partially depending on the region of death"
            ],
            correctAnswer: 2,
            explanation: "Suspicious or foreign deaths often require investigation before claim settlement.",
            difficulty: "Hard",
            category: "Life Insurance"
          },
          {
            id: 81,
            question: "A person cancels their policy and later meets with an accident before the refund is processed. Can they claim coverage?",
            options: [
              "Yes, because the premium is still with the insurer",
              "No, because the policy was canceled before the accident",
              "Yes, but only for a partial claim",
              "Depends on insurer discretion"
            ],
            correctAnswer: 1,
            explanation: "Once a policy is canceled, coverage ceases, regardless of refund processing status.",
            difficulty: "Hard",
            category: "Policy Cancellation"
          },
          {
            id: 82,
            question: "A business insured under a property policy relocates its office but does not inform the insurer. What happens if a loss occurs at the new location?",
            options: [
              "Claim is rejected due to non-disclosure of location change",
              "Claim is approved since the business is still operational",
              "Claim is partially paid after adjustment",
              "Claim is delayed but eventually paid"
            ],
            correctAnswer: 0,
            explanation: "Insurers must be informed of location changes, as policies are tied to specific premises.",
            difficulty: "Hard",
            category: "Risk Disclosure"
          },
          {
            id: 83,
            question: "An insured person buys two health insurance policies and claims full reimbursement from both. What will happen?",
            options: [
              "Both insurers will pay in full",
              "Claim is distributed proportionally among insurers",
              "One insurer will pay, the other will reject",
              "Claim is rejected due to duplicate coverage"
            ],
            correctAnswer: 1,
            explanation: "Under the contribution principle, claims are shared proportionally among insurers.",
            difficulty: "Hard",
            category: "Multiple Policies"
          },
          {
            id: 84,
            question: "An insured person with a term life insurance policy commits suicide after two years of policy issuance. What will the insurer do?",
            options: [
              "Reject the claim as suicide is not covered",
              "Pay the claim since the suicide clause period has passed",
              "Partially pay based on policy conditions",
              "Delay the claim until full investigation"
            ],
            correctAnswer: 1,
            explanation: "Many life insurance policies cover suicide after an initial exclusion period (usually 1-2 years).",
            difficulty: "Hard",
            category: "Life Insurance"
          },
          {
            id: 85,
            question: "A person purchases travel insurance and gets sick on the trip due to a pre-existing condition. Will the claim be approved?",
            options: [
              "Yes, if the sickness was unforeseen",
              "No, as pre-existing conditions are usually excluded",
              "Partially approved with a deductible",
              "Only if the illness is declared before travel"
            ],
            correctAnswer: 1,
            explanation: "Pre-existing conditions are typically excluded from travel insurance coverage.",
            difficulty: "Hard",
            category: "Travel Insurance"
          },
          {
            id: 86,
            question: "A policyholder misrepresents their occupation as a desk job instead of a high-risk job. What happens at the time of claim?",
            options: [
              "Claim is fully paid",
              "Claim is denied due to material misrepresentation",
              "Claim is adjusted based on actual risk",
              "Claim is delayed but processed"
            ],
            correctAnswer: 1,
            explanation: "Misrepresentation of risk factors like occupation can lead to claim denial.",
            difficulty: "Hard",
            category: "Fraud Detection"
          },
          {
            id: 87,
            question: "An insured building is damaged by a flood, but the policy only covers fire. What happens to the claim?",
            options: [
              "Claim is paid in full",
              "Claim is denied due to lack of flood coverage",
              "Claim is adjusted under general risk coverage",
              "Claim is approved but with deductions"
            ],
            correctAnswer: 1,
            explanation: "Policies cover only listed perils, and floods need separate coverage under specific riders.",
            difficulty: "Hard",
            category: "Property Insurance"
          },
          {
            id: 88,
            question: "An insured vehicle is used for commercial purposes despite being insured under a private policy. What happens in case of an accident?",
            options: [
              "Claim is fully paid",
              "Claim is denied due to improper policy type",
              "Claim is paid after imposing a fine",
              "Claim is delayed but processed"
            ],
            correctAnswer: 1,
            explanation: "Private insurance does not cover commercial use, leading to claim rejection.",
            difficulty: "Hard",
            category: "Motor Insurance"
          },
          {
            id: 89,
            question: "A policyholder dies in an act of war. What will the life insurance company do?",
            options: [
              "Pay the full claim",
              "Reject the claim as war exclusions apply",
              "Partially pay based on policy conditions",
              "Hold the claim for government intervention"
            ],
            correctAnswer: 1,
            explanation: "Most life insurance policies exclude deaths caused by war.",
            difficulty: "Hard",
            category: "Life Insurance Exclusions"
          },
          {
            id: 90,
            question: "A business insures inventory against theft but fails to install security measures required by the policy. What happens after a theft?",
            options: [
              "Claim is fully approved",
              "Claim is denied due to non-compliance with policy conditions",
              "Claim is paid after deducting penalties",
              "Claim is delayed for investigation"
            ],
            correctAnswer: 1,
            explanation: "Failure to comply with mandatory security measures may lead to claim rejection.",
            difficulty: "Hard",
            category: "Risk Compliance"
          },
          {
            id: 91,
            question: "A person insures their house for full value but deliberately undervalues the contents inside. What happens during a claim for content loss?",
            options: [
              "Claim is fully paid as per home policy",
              "Claim is partially paid based on declared content value",
              "Claim is denied due to misrepresentation",
              "Claim is paid but with heavy depreciation"
            ],
            correctAnswer: 2,
            explanation: "Misrepresenting content value breaches the principle of utmost good faith and may lead to claim denial.",
            difficulty: "Hard",
            category: "Home Insurance"
          },
          {
            id: 92,
            question: "A policyholder dies, but the nominee mentioned in the policy has also passed away before the claim. What will the insurer do?",
            options: [
              "Distribute claim among legal heirs",
              "Reject claim due to lack of nominee",
              "Transfer amount to government",
              "Ask for a new nominee to be assigned"
            ],
            correctAnswer: 0,
            explanation: "In the absence of a living nominee, the claim is settled as per the legal heir's succession rights.",
            difficulty: "Hard",
            category: "Life Insurance"
          },
          {
            id: 93,
            question: "A vehicle insured under a personal motor policy is stolen, but the insured did not inform authorities for a week. What happens to the claim?",
            options: [
              "Claim is approved after standard investigation",
              "Claim is denied due to late reporting",
              "Claim is partially paid with penalty",
              "Claim is approved but delayed"
            ],
            correctAnswer: 1,
            explanation: "Failure to report a stolen vehicle promptly raises concerns about fraudulent claims, often leading to denial.",
            difficulty: "Hard",
            category: "Motor Insurance"
          },
          {
            id: 94,
            question: "A corporate group buys insurance for their entire fleet of trucks under a single policy. One of the trucks is used for illegal activities and meets with an accident. What happens?",
            options: [
              "Claim is paid for all vehicles under the policy",
              "Claim is denied for the involved vehicle only",
              "Claim is denied for all vehicles in the policy",
              "Claim is partially paid after investigation"
            ],
            correctAnswer: 1,
            explanation: "Illegal use of a vehicle results in denial of its claim, but does not necessarily void the entire policy.",
            difficulty: "Hard",
            category: "Commercial Insurance"
          },
          {
            id: 95,
            question: "A person holding two separate health insurance policies files a claim under both policies but with different hospitals for the same treatment. What happens?",
            options: [
              "Both claims are rejected for fraud",
              "One claim is approved, and the other is denied",
              "Both claims are partially paid",
              "Both claims are approved after verification"
            ],
            correctAnswer: 0,
            explanation: "Filing two claims for the same expense under different policies constitutes fraud, leading to rejection.",
            difficulty: "Hard",
            category: "Health Insurance"
          },
          {
            id: 96,
            question: "A fire destroys a factory covered by insurance, but the insured had failed to renew the mandatory fire safety certificate. What will the insurer do?",
            options: [
              "Approve claim after verifying cause",
              "Reject claim due to lack of safety compliance",
              "Approve partial claim with penalty",
              "Approve claim with future premium hike"
            ],
            correctAnswer: 1,
            explanation: "Failure to comply with mandatory safety requirements can result in claim rejection.",
            difficulty: "Hard",
            category: "Fire Insurance"
          },
          {
            id: 97,
            question: "An individual with critical illness insurance is diagnosed with cancer but had an active smoking habit undisclosed in the proposal form. What happens?",
            options: [
              "Claim is rejected due to non-disclosure",
              "Claim is fully approved",
              "Claim is partially paid",
              "Claim is approved but with exclusions"
            ],
            correctAnswer: 0,
            explanation: "Non-disclosure of smoking, which is a material fact, can lead to claim rejection.",
            difficulty: "Hard",
            category: "Health Insurance"
          },
          {
            id: 98,
            question: "A policyholder buys an accidental death cover but dies due to a pre-existing heart condition. What will the insurer do?",
            options: [
              "Approve claim fully",
              "Reject claim as death was not accidental",
              "Approve partial claim",
              "Approve after a long investigation"
            ],
            correctAnswer: 1,
            explanation: "Accidental death policies only cover deaths caused by accidents, not health conditions.",
            difficulty: "Hard",
            category: "Accident Insurance"
          },
          {
            id: 99,
            question: "A commercial insurance policyholder underinsures their warehouse by 50%. A partial loss occurs. How will the claim be settled?",
            options: [
              "Claim is fully paid",
              "Claim is paid proportionally based on underinsurance",
              "Claim is denied",
              "Claim is approved but future coverage is increased"
            ],
            correctAnswer: 1,
            explanation: "Underinsurance leads to proportional claim settlement under the 'average clause.'",
            difficulty: "Hard",
            category: "Commercial Insurance"
          },
          {
            id: 100,
            question: "A person claims reimbursement for a stolen insured mobile phone but has no purchase invoice. What is likely to happen?",
            options: [
              "Claim is rejected due to lack of proof",
              "Claim is partially approved based on estimated value",
              "Claim is paid after detailed assessment",
              "Claim is approved with depreciation"
            ],
            correctAnswer: 0,
            explanation: "Without purchase proof, claim verification is difficult, often leading to rejection.",
            difficulty: "Hard",
            category: "Gadget Insurance"
          },
          {
            id: 101,
            question: "A customer purchases travel insurance and falls ill due to excessive alcohol consumption abroad. What happens?",
            options: [
              "Claim is denied due to policy exclusions",
              "Claim is approved with medical bill limits",
              "Claim is fully approved",
              "Claim is partially approved after medical evaluation"
            ],
            correctAnswer: 0,
            explanation: "Most travel insurance policies exclude claims arising from alcohol or drug consumption.",
            difficulty: "Hard",
            category: "Travel Insurance"
          },
          {
            id: 102,
            question: "A homeowner's policy covers theft, but the insured left their main door unlocked. What will the insurer do?",
            options: [
              "Fully approve claim",
              "Partially approve claim",
              "Reject claim due to negligence",
              "Approve claim with penalty"
            ],
            correctAnswer: 2,
            explanation: "Leaving doors unlocked may be considered negligence, potentially leading to claim rejection.",
            difficulty: "Hard",
            category: "Home Insurance"
          },
          {
            id: 103,
            question: "An insured car meets with an accident, but the driver was unlicensed. What will the insurer likely do?",
            options: [
              "Approve the claim",
              "Deny the claim due to policy violation",
              "Partially approve claim with penalty",
              "Delay claim for verification"
            ],
            correctAnswer: 1,
            explanation: "Driving without a valid license violates policy terms, leading to claim rejection.",
            difficulty: "Hard",
            category: "Motor Insurance"
          },
          {
            id: 104,
            question: "A policyholder switches from one health insurer to another but does not disclose their previous claims history. What happens when they make a new claim?",
            options: [
              "Claim is fully approved",
              "Claim is denied due to non-disclosure",
              "Claim is partially paid",
              "Claim is delayed for investigation"
            ],
            correctAnswer: 1,
            explanation: "Non-disclosure of previous claims can result in claim rejection for misrepresentation.",
            difficulty: "Hard",
            category: "Health Insurance"
          },
          {
            id: 105,
            question: "A bank takes a life insurance policy as collateral for a loan. The borrower dies, and the bank claims the sum insured. What happens?",
            options: [
              "Bank gets the full payout",
              "Nominee receives the sum insured",
              "Bank is repaid the loan balance, nominee gets remaining",
              "Claim is denied"
            ],
            correctAnswer: 2,
            explanation: "When a policy is assigned to a lender, the lender recovers outstanding dues first.",
            difficulty: "Hard",
            category: "Life Insurance"
          },
          {
            id: 106,
            question: "A policyholder insures their factory for Rs. 5 crores but later adds high-value machinery worth Rs. 2 crores without informing the insurer. A fire destroys part of the factory, including the new machinery. How will the insurer settle the claim?",
            options: [
              "Full claim is paid as per the original sum insured",
              "Partial claim is settled based on the proportion of declared value",
              "Claim is rejected for non-disclosure of material change",
              "Claim is settled only for the originally declared assets"
            ],
            correctAnswer: 2,
            explanation: "Non-disclosure of material changes in the insured asset may lead to claim rejection or underpayment.",
            difficulty: "Super Hard",
            category: "Fire Insurance"
          },
          {
            id: 107,
            question: "A car owner buys a motor insurance policy and transfers ownership to another person. The new owner meets with an accident and files a claim under the original policy. What will happen?",
            options: [
              "Claim is rejected as policyholder has changed",
              "Claim is approved after ownership verification",
              "Claim is paid after a higher deductible is applied",
              "Claim is approved but with an ownership transfer penalty"
            ],
            correctAnswer: 0,
            explanation: "Motor insurance policies are not automatically transferable; a fresh policy is required after ownership change.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 108,
            question: "A person insured under a critical illness policy is diagnosed with an illness listed in the policy but recovers fully before filing a claim. What will happen?",
            options: [
              "Claim is fully paid as the illness was covered",
              "Claim is partially paid for medical expenses",
              "Claim is denied as critical illness policies pay only for permanent conditions",
              "Claim is settled after investigation of recovery duration"
            ],
            correctAnswer: 2,
            explanation: "Critical illness policies typically pay only for severe, life-altering conditions, not temporary recoverable illnesses.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 109,
            question: "A home insurance policyholder intentionally sets fire to their house to claim insurance money. However, strong winds spread the fire, damaging neighboring houses. What will the insurer do?",
            options: [
              "Reject the claim for the insured house but pay for neighbors’ damages",
              "Reject all claims due to fraudulent intent",
              "Approve partial claims under public liability",
              "Approve the entire claim but penalize the insured"
            ],
            correctAnswer: 0,
            explanation: "Insurance fraud voids the personal claim, but liability cover for third-party damage may still apply.",
            difficulty: "Super Hard",
            category: "Home Insurance"
          },
          {
            id: 110,
            question: "An insured person undergoes a pre-approved surgery but later finds out the hospital charged for an additional procedure not covered by the policy. What will happen?",
            options: [
              "Full claim is approved as it was pre-approved",
              "Claim is partially paid excluding the non-covered procedure",
              "Claim is rejected for policy violation",
              "Claim is paid with a penalty for the extra procedure"
            ],
            correctAnswer: 1,
            explanation: "Insurance will cover only pre-approved expenses; additional, uncovered procedures will not be paid.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 111,
            question: "A business insured for cyber fraud experiences a data breach but delays reporting it to the insurer by three months. What will happen?",
            options: [
              "Claim is approved with no penalties",
              "Claim is denied for delay in reporting",
              "Claim is approved after increased scrutiny",
              "Claim is paid partially for preventable losses only"
            ],
            correctAnswer: 1,
            explanation: "Most cyber insurance policies require prompt reporting; delays may lead to claim denial.",
            difficulty: "Super Hard",
            category: "Cyber Insurance"
          },
          {
            id: 112,
            question: "An insured person passes away, but their nominee has also died. The legal heirs are in dispute. Who receives the sum insured?",
            options: [
              "The nominee’s family automatically",
              "The legal heirs as per court decision",
              "The insurer keeps the sum until dispute is resolved",
              "The claim is forfeited due to no nominee"
            ],
            correctAnswer: 1,
            explanation: "If a nominee is deceased, the legal heirs inherit the claim as per succession laws.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 113,
            question: "A policyholder with an all-risk insurance policy loses a diamond ring while traveling abroad. What determines the claim approval?",
            options: [
              "Whether travel was declared in the policy",
              "The ring’s purchase invoice and photographs",
              "The police report confirming theft or loss",
              "All of the above"
            ],
            correctAnswer: 3,
            explanation: "All-risk policies require proof of ownership, event documentation, and policy compliance for claim approval.",
            difficulty: "Super Hard",
            category: "Jewelry Insurance"
          },
          {
            id: 114,
            question: "A factory insured under business interruption coverage faces losses due to a flood. However, no physical damage occurs to the property. What will the insurer do?",
            options: [
              "Approve claim for lost income",
              "Reject claim as no direct damage occurred",
              "Approve partial claim for indirect loss",
              "Approve claim only after verifying financial records"
            ],
            correctAnswer: 1,
            explanation: "Business interruption insurance typically requires physical damage for claims to be valid.",
            difficulty: "Super Hard",
            category: "Commercial Insurance"
          },
          {
            id: 115,
            question: "A vehicle owner purchases insurance and modifies the engine to increase horsepower. Later, the car meets with an accident. How will the claim be processed?",
            options: [
              "Full claim is approved",
              "Claim is denied for non-disclosure of modifications",
              "Claim is partially paid after deducting modification-related risks",
              "Claim is approved after insurer charges an extra premium"
            ],
            correctAnswer: 1,
            explanation: "Non-disclosure of major modifications can lead to claim rejection.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 116,
            question: "A corporate employee covered under group health insurance resigns but continues using the policy for a few months. What happens when they file a claim?",
            options: [
              "Claim is denied as coverage ended with employment",
              "Claim is partially paid with an individual premium adjustment",
              "Claim is paid after former employer’s approval",
              "Claim is approved but with future restrictions"
            ],
            correctAnswer: 0,
            explanation: "Group health insurance is employer-linked and ends when employment ceases.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 117,
            question: "An insured factory owner regularly underreports revenue to the insurer for lower premiums. A fire causes total damage. What happens?",
            options: [
              "Claim is paid as per sum insured",
              "Claim is denied for misrepresentation",
              "Claim is partially paid based on reported revenue",
              "Claim is approved but with investigation delays"
            ],
            correctAnswer: 1,
            explanation: "Deliberate misrepresentation of financials can result in claim rejection.",
            difficulty: "Super Hard",
            category: "Commercial Insurance"
          },
          {
            id: 118,
            question: "A life insurance policyholder names their minor child as a nominee. What happens if the policyholder dies while the child is still a minor?",
            options: [
              "Claim is put on hold until nominee turns 18",
              "Claim is paid to the minor’s legal guardian",
              "Claim is transferred to the court",
              "Claim is paid to the next legal heir"
            ],
            correctAnswer: 1,
            explanation: "If the nominee is a minor, the legal guardian receives the claim amount.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 119,
            question: "A policyholder has a health insurance policy with a co-payment clause of 20%. They undergo a surgery costing Rs. 5 lakhs, but the insurer finds discrepancies in the hospital's billing. How will the claim be settled?",
            options: [
              "80% of Rs. 5 lakhs is paid after verifying the claim",
              "Only 80% of the justified amount is paid after removing discrepancies",
              "Claim is rejected entirely due to billing discrepancies",
              "Claim is approved in full, as the surgery was necessary"
            ],
            correctAnswer: 1,
            explanation: "Insurance companies pay only the justified claim amount, applying co-payment accordingly.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 120,
            question: "A vehicle owner forgets to renew their motor insurance policy and meets with an accident the next day. What will the insurer do?",
            options: [
              "Approve the claim under the grace period",
              "Reject the claim as the policy had lapsed",
              "Approve the claim with a penalty for late renewal",
              "Reject the claim but allow coverage if renewed immediately"
            ],
            correctAnswer: 1,
            explanation: "Motor insurance does not have a grace period; if the policy lapses, no coverage is provided.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 121,
            question: "An insured business suffers flood damage, but the policy covers only fire risks. The business owner claims that their agent verbally assured them of flood coverage. How will the insurer handle the claim?",
            options: [
              "Reject the claim as verbal assurances are not legally binding",
              "Approve the claim as verbal agreements hold weight",
              "Approve partial claim as a goodwill gesture",
              "Approve the claim but deduct a penalty for miscommunication"
            ],
            correctAnswer: 0,
            explanation: "Insurance policies cover only explicitly mentioned risks; verbal assurances are not legally enforceable.",
            difficulty: "Super Hard",
            category: "Commercial Insurance"
          },
          {
            id: 122,
            question: "A policyholder has two active health insurance policies and gets hospitalized. They file a claim under only one policy. What happens if the insurer finds out about the second policy?",
            options: [
              "Claim is paid as per the first policy, ignoring the second",
              "Claim is rejected for non-disclosure of dual insurance",
              "Claim is partially approved based on contribution clause",
              "Claim is approved but adjusted across both insurers"
            ],
            correctAnswer: 2,
            explanation: "When multiple policies exist, insurers apply the contribution clause to share liability.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 123,
            question: "A house insured under a fire policy is damaged in an earthquake. The owner insists that the fire started due to post-earthquake wiring damage. How will the insurer decide?",
            options: [
              "Approve the claim since fire occurred",
              "Reject the claim as earthquake was the root cause",
              "Approve partial claim only for non-earthquake damages",
              "Approve claim after verifying fire’s independent cause"
            ],
            correctAnswer: 3,
            explanation: "If the fire is proven to be independent of the earthquake, the claim may be valid.",
            difficulty: "Super Hard",
            category: "Home Insurance"
          },
          {
            id: 124,
            question: "A person buys travel insurance covering trip cancellations. They cancel their trip due to a personal emergency but do not provide any documentation. What will the insurer do?",
            options: [
              "Approve the claim as the trip was canceled",
              "Reject the claim due to lack of proof",
              "Approve partial reimbursement",
              "Approve the claim but impose future restrictions"
            ],
            correctAnswer: 1,
            explanation: "Travel insurance claims require valid supporting documents for approval.",
            difficulty: "Super Hard",
            category: "Travel Insurance"
          },
          {
            id: 125,
            question: "A factory owner insures their machinery under an all-risk policy. A machine breaks down due to gradual wear and tear. What will the insurer do?",
            options: [
              "Approve the claim in full",
              "Reject the claim as wear and tear is excluded",
              "Approve partial claim based on depreciation",
              "Approve the claim after applying extra deductible"
            ],
            correctAnswer: 1,
            explanation: "Gradual wear and tear is generally excluded from all-risk policies.",
            difficulty: "Super Hard",
            category: "Commercial Insurance"
          },
          {
            id: 126,
            question: "A vehicle owner files a claim for total loss due to theft, but the stolen car is recovered a month later in usable condition. What will the insurer do?",
            options: [
              "Reject the claim since the vehicle is recovered",
              "Approve claim but deduct depreciation",
              "Approve full claim as theft occurred",
              "Approve claim but take ownership of the vehicle"
            ],
            correctAnswer: 3,
            explanation: "In case of total loss payout, insurers may take ownership of recovered vehicles.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 127,
            question: "A health insurance policyholder is diagnosed with a pre-existing disease within the waiting period. How will the insurer handle the claim?",
            options: [
              "Approve claim for full amount",
              "Reject claim as waiting period is in effect",
              "Approve partial claim for general treatment costs",
              "Approve claim with a higher deductible"
            ],
            correctAnswer: 1,
            explanation: "Claims related to pre-existing diseases during the waiting period are typically denied.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 128,
            question: "A business suffers losses due to a city-wide power outage. Their business interruption insurance does not explicitly mention power failures. What will happen?",
            options: [
              "Claim is approved if power outage is due to insured peril",
              "Claim is rejected unless power failure is covered",
              "Claim is approved partially for indirect losses",
              "Claim is settled after verifying actual financial impact"
            ],
            correctAnswer: 1,
            explanation: "Business interruption claims require explicit coverage for power outages.",
            difficulty: "Super Hard",
            category: "Commercial Insurance"
          },
          {
            id: 129,
            question: "A policyholder increases their home insurance sum insured significantly without property upgrades. How will the insurer assess a claim?",
            options: [
              "Approve the claim based on sum insured",
              "Reject claim due to over-insurance suspicion",
              "Approve claim after valuation review",
              "Approve claim but impose depreciation"
            ],
            correctAnswer: 2,
            explanation: "Insurers review valuations before claim approval to prevent over-insurance fraud.",
            difficulty: "Super Hard",
            category: "Home Insurance"
          },
          {
            id: 130,
            question: "A vehicle owner sells their insured car but does not transfer the insurance. The buyer meets with an accident. What happens to the claim?",
            options: [
              "Claim is paid since the policy was active",
              "Claim is denied as insurance was not transferred",
              "Claim is partially paid with extra premium",
              "Claim is approved but settlement goes to previous owner"
            ],
            correctAnswer: 1,
            explanation: "Insurance policies do not automatically transfer with vehicle ownership.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 131,
            question: "A life insurance policyholder dies, but their nominee had predeceased them. There is no secondary nominee. Who gets the claim?",
            options: [
              "The insurer retains the sum",
              "The legal heirs as per succession law",
              "The government claims the money",
              "The insurance company redistributes it"
            ],
            correctAnswer: 1,
            explanation: "If no nominee exists, legal heirs receive the claim as per succession law.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 132,
            question: "A company insures a fleet of cars but does not disclose that some are used for racing. If one meets with an accident during a race, how will the claim be processed?",
            options: [
              "Claim is approved since it was an insured vehicle",
              "Claim is denied due to non-disclosure of high-risk use",
              "Claim is partially paid after applying extra premium",
              "Claim is paid but future coverage is restricted"
            ],
            correctAnswer: 1,
            explanation: "Failure to disclose high-risk vehicle use can lead to claim rejection.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 133,
            question: "A policyholder with a comprehensive motor insurance policy meets with an accident due to driving under the influence of alcohol. The vehicle suffers major damage. What will the insurer do?",
            options: [
              "Approve the claim after deducting a penalty",
              "Reject the claim due to policy violation",
              "Approve the claim but only for third-party damages",
              "Approve partial claim considering unavoidable circumstances"
            ],
            correctAnswer: 1,
            explanation: "Driving under the influence is an exclusion in motor insurance policies, leading to claim rejection.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 134,
            question: "A person takes a fire insurance policy for their shop but stocks hazardous chemicals without informing the insurer. A fire breaks out due to spontaneous combustion. How will the claim be processed?",
            options: [
              "Approved since fire is a covered peril",
              "Rejected due to non-disclosure of hazardous materials",
              "Partially approved after applying additional premium",
              "Approved only if fire was caused by external factors"
            ],
            correctAnswer: 1,
            explanation: "Non-disclosure of hazardous material affects risk assessment, leading to claim rejection.",
            difficulty: "Super Hard",
            category: "Fire Insurance"
          },
          {
            id: 135,
            question: "A factory owner insures their equipment for Rs. 50 lakhs but its actual value is Rs. 30 lakhs. The equipment is completely destroyed. What amount will the insurer pay?",
            options: [
              "Rs. 50 lakhs as per the sum insured",
              "Rs. 30 lakhs as per actual value",
              "Average clause will apply and reduce payout",
              "Insurer will reject the claim for over-insurance"
            ],
            correctAnswer: 1,
            explanation: "Indemnity principle ensures compensation is limited to actual loss, preventing profit from insurance.",
            difficulty: "Super Hard",
            category: "Property Insurance"
          },
          {
            id: 136,
            question: "A business owner has a burglary insurance policy but leaves their store unlocked overnight. A theft occurs. How will the insurer assess the claim?",
            options: [
              "Approve the claim fully",
              "Reject the claim due to negligence",
              "Approve partial claim after investigation",
              "Approve only if a police complaint is filed"
            ],
            correctAnswer: 1,
            explanation: "Negligence by the insured can lead to claim rejection in burglary insurance.",
            difficulty: "Super Hard",
            category: "Commercial Insurance"
          },
          {
            id: 137,
            question: "A person buys health insurance and is diagnosed with a critical illness within the first month. The policy has a 90-day waiting period for critical illness coverage. What happens?",
            options: [
              "Full claim is approved since the policy is active",
              "Claim is denied due to the waiting period",
              "Partial claim is approved under general coverage",
              "Claim is approved but with higher deductible"
            ],
            correctAnswer: 1,
            explanation: "Waiting periods apply to certain coverages, and claims within this period are not payable.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 138,
            question: "A ship owner takes marine insurance but fails to maintain the vessel, leading to mechanical failure at sea. A large cargo loss occurs. What will the insurer do?",
            options: [
              "Approve the claim as cargo was lost",
              "Reject the claim due to lack of maintenance",
              "Approve partial claim after deducting negligence factor",
              "Approve claim only for damages beyond control"
            ],
            correctAnswer: 1,
            explanation: "Lack of vessel maintenance constitutes negligence, affecting claim approval.",
            difficulty: "Super Hard",
            category: "Marine Insurance"
          },
          {
            id: 139,
            question: "An individual takes travel insurance but misses their flight due to oversleeping. They file a claim under trip cancellation coverage. What will the insurer do?",
            options: [
              "Approve claim as the trip was missed",
              "Reject claim since oversleeping is not covered",
              "Approve partial claim for non-refundable charges",
              "Approve claim if an official reason is provided"
            ],
            correctAnswer: 1,
            explanation: "Trip cancellation coverage applies to unforeseen events, not negligence like oversleeping.",
            difficulty: "Super Hard",
            category: "Travel Insurance"
          },
          {
            id: 140,
            question: "A person takes an employer-provided health insurance policy and later buys an individual health policy without disclosing the employer coverage. They file claims under both policies. What happens?",
            options: [
              "Both insurers will pay the full claim amount",
              "Claim will be split between both insurers",
              "One insurer will reject the claim due to non-disclosure",
              "Only the first policy will cover the claim"
            ],
            correctAnswer: 1,
            explanation: "Contribution clause applies when multiple insurers cover the same risk.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 141,
            question: "A person takes a home insurance policy but rents out their property without informing the insurer. A major fire occurs. How will the insurer handle the claim?",
            options: [
              "Approve the claim fully",
              "Reject the claim due to non-disclosure of tenancy",
              "Approve claim but apply higher deductible",
              "Approve partial claim for structural damage only"
            ],
            correctAnswer: 1,
            explanation: "Change in occupancy can affect risk assessment, leading to claim rejection.",
            difficulty: "Super Hard",
            category: "Home Insurance"
          },
          {
            id: 142,
            question: "A policyholder takes a life insurance policy but dies in a foreign country due to war. The policy does not explicitly exclude war-related deaths. What will happen?",
            options: [
              "Claim is rejected as war-related deaths are typically excluded",
              "Claim is approved since exclusion is not explicitly mentioned",
              "Claim is approved partially after detailed investigation",
              "Claim is approved only if death was not directly due to war"
            ],
            correctAnswer: 1,
            explanation: "If war-related deaths are not explicitly excluded, the claim may be payable.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 143,
            question: "An insured farmer suffers crop damage due to delayed monsoon but their policy covers only excessive rainfall. What will the insurer do?",
            options: [
              "Approve claim under general agricultural loss",
              "Reject claim as delayed monsoon is not covered",
              "Approve claim partially as a goodwill gesture",
              "Approve claim if loss is proven significant"
            ],
            correctAnswer: 1,
            explanation: "Crop insurance policies cover only specific risks as mentioned in the policy.",
            difficulty: "Super Hard",
            category: "Agricultural Insurance"
          },
          {
            id: 144,
            question: "A vehicle owner takes a third-party-only insurance policy but meets with an accident causing damage to their own car. What will the insurer do?",
            options: [
              "Approve claim under special consideration",
              "Reject claim as own damage is not covered",
              "Approve partial claim after deductible",
              "Approve claim if third party was also involved"
            ],
            correctAnswer: 1,
            explanation: "Third-party insurance does not cover own vehicle damages.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 145,
            question: "A person takes life insurance but later engages in a high-risk occupation without informing the insurer. They die in a work-related accident. How will the claim be handled?",
            options: [
              "Claim is fully approved",
              "Claim is rejected due to non-disclosure",
              "Claim is partially approved with higher deduction",
              "Claim is approved only if the occupation was not a major risk factor"
            ],
            correctAnswer: 1,
            explanation: "Non-disclosure of high-risk occupations can impact claim approval.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 146,
          question: "A company has taken a group health insurance policy covering all employees. An employee resigns and is hospitalized the next day for a pre-existing illness. How will the claim be processed?",
          options: [
            "Fully approved as policy was active during employment",
            "Rejected as policy coverage ends upon resignation",
            "Partially approved considering employment period",
            "Approved only if treatment was planned before resignation"
          ],
          correctAnswer: 1,
          explanation: "Group insurance coverage typically ceases upon resignation, leading to claim rejection.",
          difficulty: "Super Hard",
          category: "Health Insurance"
        },
        {
          id: 147,
          question: "An insured individual meets with an accident while driving a vehicle registered under their friend's name. They have a personal motor insurance policy. What will the insurer do?",
          options: [
            "Approve claim as insured was driving the vehicle",
            "Reject claim as policy covers only owned vehicles",
            "Approve partial claim under third-party coverage",
            "Approve claim if friend consents to transfer benefits"
          ],
          correctAnswer: 1,
          explanation: "Personal motor insurance applies only to the vehicle owned by the insured.",
          difficulty: "Super Hard",
          category: "Motor Insurance"
        },
        {
          id: 148,
          question: "A cargo ship carrying perishable goods gets stranded due to mechanical failure. The cargo is spoiled. The marine insurance policy does not mention perishable exclusions. What happens?",
          options: [
            "Full claim approved since exclusions were not specified",
            "Claim rejected due to inherent perishability",
            "Partial claim approved after depreciation assessment",
            "Approved only if spoilage was due to external peril"
          ],
          correctAnswer: 1,
          explanation: "Perishability is an inherent risk, and marine policies often do not cover it.",
          difficulty: "Super Hard",
          category: "Marine Insurance"
        },
        {
          id: 149,
          question: "A homeowner insures their house against fire. They later store explosive materials in their garage without informing the insurer. A fire occurs. What happens?",
          options: [
            "Full claim is approved since fire is a covered peril",
            "Claim is denied due to increased risk without disclosure",
            "Partial claim approved for structure but not contents",
            "Approved only if explosion was not the cause of fire"
          ],
          correctAnswer: 1,
          explanation: "Material change in risk due to undisclosed hazardous storage can lead to claim denial.",
          difficulty: "Super Hard",
          category: "Fire Insurance"
        },
        {
          id: 150,
          question: "A business owner has a burglary insurance policy. A robbery occurs with no forced entry signs. How will the insurer process the claim?",
          options: [
            "Fully approved as burglary is covered",
            "Rejected due to lack of visible forced entry",
            "Partial claim approved after verification",
            "Approved if police confirm an internal security breach"
          ],
          correctAnswer: 1,
          explanation: "Burglary claims typically require evidence of forced entry unless otherwise covered.",
          difficulty: "Super Hard",
          category: "Commercial Insurance"
        },
        {
          id: 151,
          question: "A person with a critical illness insurance policy is diagnosed with cancer. However, they started experiencing symptoms before purchasing the policy. How will the claim be handled?",
          options: [
            "Fully approved since diagnosis happened after policy start",
            "Rejected due to pre-existing condition non-disclosure",
            "Approved partially based on waiting period conditions",
            "Approved only if symptoms were not medically recorded earlier"
          ],
          correctAnswer: 1,
          explanation: "Pre-existing conditions, if not disclosed, can lead to claim rejection.",
          difficulty: "Super Hard",
          category: "Health Insurance"
        },
        {
          id: 152,
          question: "A person has a travel insurance policy covering lost baggage. They lose their luggage but do not report it to the airline or local authorities. Can they claim?",
          options: [
            "Yes, since baggage loss is covered",
            "No, as official loss proof is required",
            "Yes, but only for essential item reimbursement",
            "No, unless they can show purchase receipts"
          ],
          correctAnswer: 1,
          explanation: "Travel insurance requires proof of loss, which includes airline or police reports.",
          difficulty: "Super Hard",
          category: "Travel Insurance"
        },
        {
          id: 153,
          question: "An individual takes life insurance but later changes their smoking habits, increasing health risks. They do not inform the insurer. What happens if they die due to a smoking-related illness?",
          options: [
            "Claim is fully approved as policy was active",
            "Claim is rejected due to material change non-disclosure",
            "Partial claim is approved after applying additional loading",
            "Claim is approved only if original policy terms cover it"
          ],
          correctAnswer: 1,
          explanation: "Significant risk changes require disclosure; non-disclosure can lead to claim rejection.",
          difficulty: "Super Hard",
          category: "Life Insurance"
        },
        {
          id: 154,
          question: "A factory takes property insurance covering machinery. They fail to conduct routine maintenance, leading to a breakdown. How will the claim be processed?",
          options: [
            "Fully approved as machinery was insured",
            "Rejected due to lack of maintenance",
            "Approved after depreciation deduction",
            "Approved only if accidental damage is proven"
          ],
          correctAnswer: 1,
          explanation: "Mechanical failure due to lack of maintenance is not covered under standard property insurance.",
          difficulty: "Super Hard",
          category: "Property Insurance"
        },
        {
          id: 155,
          question: "A person purchases a vehicle insurance policy but does not transfer ownership after buying a second-hand car. They meet with an accident. What happens?",
          options: [
            "Claim is fully approved as policyholder is the driver",
            "Rejected since insurance must be in the owner's name",
            "Partial claim is approved after ownership proof",
            "Approved if seller provides an authorization letter"
          ],
          correctAnswer: 1,
          explanation: "Insurance must be in the name of the registered vehicle owner for a valid claim.",
          difficulty: "Super Hard",
          category: "Motor Insurance"
        },
        {
          id: 156,
          question: "A policyholder insures their factory against earthquakes. Their building collapses due to weak foundation and not due to an earthquake. What will the insurer do?",
          options: [
            "Approve the claim as collapse occurred",
            "Reject claim since the cause was poor construction",
            "Approve claim partially after site inspection",
            "Approve claim only if earthquake was a contributing factor"
          ],
          correctAnswer: 1,
          explanation: "Earthquake insurance covers only damage due to earthquakes, not poor construction.",
          difficulty: "Super Hard",
          category: "Property Insurance"
        },
        {
          id: 157,
          question: "A bank insures a loan borrower’s life under a group life insurance policy. The borrower defaults on payments and later passes away. Can the bank claim insurance benefits?",
          options: [
            "Yes, as long as policy was active",
            "No, since the loan was in default",
            "Yes, but only for outstanding dues",
            "No, unless the bank proves financial loss"
          ],
          correctAnswer: 1,
          explanation: "Lenders can claim life insurance benefits for outstanding dues if the policy covers it.",
          difficulty: "Super Hard",
          category: "Life Insurance"
        },
        {
          id: 158,
          question: "A business owner takes business interruption insurance but fails to keep financial records. A fire halts operations, and they file a claim. What will the insurer do?",
          options: [
            "Approve claim based on estimated loss",
            "Reject claim due to lack of financial proof",
            "Approve partial claim using industry benchmarks",
            "Approve claim if tax returns show revenue trends"
          ],
          correctAnswer: 1,
          explanation: "Business interruption claims require documented financial proof of loss.",
          difficulty: "Super Hard",
          category: "Commercial Insurance"
        },
        {
          id: 159,
          question: "An individual buys a health insurance policy with a sub-limit of Rs. 50,000 for hospitalization but incurs Rs. 1 lakh in expenses. How much will the insurer pay?",
          options: [
            "Full Rs. 1 lakh",
            "Only Rs. 50,000 as per sub-limit",
            "Partial payment based on total bill size",
            "Approved if additional coverage exists"
          ],
          correctAnswer: 1,
          explanation: "Sub-limits cap the maximum payout for specific medical expenses.",
          difficulty: "Super Hard",
          category: "Health Insurance"
        },
        {
            id: 160,
            question: "A person holds two health insurance policies from different insurers and files a claim with both for the same hospitalization. What is the most likely outcome?",
            options: [
              "Both insurers will share the claim proportionally",
              "Only one insurer will pay, and the other will reject",
              "The insured will be reimbursed twice for the same expense",
              "The insurer who receives the claim first will process it fully"
            ],
            correctAnswer: 1,
            explanation: "Under the principle of contribution, insurers share the claim proportionally.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 161,
            question: "A vehicle owner forgets to renew their motor insurance, and the policy lapses at midnight. The next morning, before renewing, they meet with an accident. What happens to the claim?",
            options: [
              "Fully approved as grace period applies",
              "Rejected due to policy lapse",
              "Approved partially after penalty deduction",
              "Approved only if renewal is done on the same day"
            ],
            correctAnswer: 1,
            explanation: "If the policy has lapsed, coverage ceases, and claims are not payable.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 162,
            question: "An insured business suffers losses due to a government-mandated shutdown. The business interruption policy does not explicitly exclude government actions. What will the insurer do?",
            options: [
              "Approve the claim as shutdown is an operational loss",
              "Reject the claim since government orders are not covered",
              "Approve partial compensation for essential expenses",
              "Approve only if there is a legal challenge to the shutdown"
            ],
            correctAnswer: 1,
            explanation: "Government-mandated shutdowns are typically not covered unless specified.",
            difficulty: "Super Hard",
            category: "Business Interruption Insurance"
          },
          {
            id: 163,
            question: "A life insurance policyholder dies in an accident, but the nominee is unaware of the policy. What happens if no claim is filed?",
            options: [
              "Insurer proactively reaches out to nominees",
              "Claim is rejected due to non-submission",
              "Policy matures and payout goes to insurer",
              "Claim is settled only after a statutory period"
            ],
            correctAnswer: 1,
            explanation: "Insurance claims must be filed by nominees; insurers do not initiate payouts automatically.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 164,
            question: "An insured person suffers an injury abroad but their health policy only covers treatment in India. What happens if they seek treatment overseas?",
            options: [
              "Claim is fully reimbursed as medical necessity applies",
              "Rejected as treatment occurred outside coverage region",
              "Approved up to domestic treatment equivalent costs",
              "Approved only if insurer has international tie-ups"
            ],
            correctAnswer: 1,
            explanation: "Health insurance policies generally specify geographic limitations.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 165,
            question: "An insured factory gets damaged due to flooding, but its flood protection system was not operational at the time of the disaster. How will the insurer handle the claim?",
            options: [
              "Approve fully as flood is a covered peril",
              "Reject due to lack of preventive measures",
              "Approve partially after risk assessment",
              "Approve only if flood insurance rider exists"
            ],
            correctAnswer: 1,
            explanation: "Failure to use preventive measures can affect claim approval depending on policy terms.",
            difficulty: "Super Hard",
            category: "Property Insurance"
          },
          {
            id: 166,
            question: "A car is insured under a comprehensive policy, but its engine gets damaged due to hydrostatic lock during a flood. How will the insurer process the claim?",
            options: [
              "Fully approved under comprehensive coverage",
              "Rejected as mechanical failure is not covered",
              "Approved only if engine protection add-on exists",
              "Partially approved after depreciation deduction"
            ],
            correctAnswer: 1,
            explanation: "Engine damage due to hydrostatic lock requires a special add-on for coverage.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 167,
            question: "A life insurance policyholder commits suicide within 9 months of policy issuance. How will the claim be handled?",
            options: [
              "Fully approved under life coverage",
              "Rejected as suicide is excluded in the first year",
              "Partially approved for premium refund",
              "Approved only if the policy has no suicide exclusion"
            ],
            correctAnswer: 1,
            explanation: "Most life insurance policies exclude suicide claims within the first year.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 168,
            question: "A corporate health insurance policy covers an employee’s spouse. The spouse undergoes elective cosmetic surgery. Can they claim reimbursement?",
            options: [
              "Yes, as spouse is covered under the policy",
              "No, as cosmetic procedures are typically excluded",
              "Yes, but only if a pre-authorization was obtained",
              "No, unless medically necessary due to an accident"
            ],
            correctAnswer: 1,
            explanation: "Cosmetic procedures are not covered unless medically necessary.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 169,
            question: "A business owner increases their sum insured just before a fire incident and then files a claim. How will the insurer assess the claim?",
            options: [
              "Approve fully as the sum insured is valid",
              "Reject due to suspected moral hazard",
              "Approve partially after verifying loss history",
              "Approve only if policy duration exceeds a minimum period"
            ],
            correctAnswer: 1,
            explanation: "Sudden increase in sum insured before a loss raises moral hazard concerns.",
            difficulty: "Super Hard",
            category: "Fire Insurance"
          },
          {
            id: 170,
            question: "A person purchases a travel insurance policy but forgets to mention a pre-existing heart condition. They suffer a heart attack abroad. What will happen?",
            options: [
              "Claim is fully approved as travel emergencies are covered",
              "Rejected due to non-disclosure of pre-existing illness",
              "Approved partially based on medical necessity",
              "Approved only if the heart condition was stable before travel"
            ],
            correctAnswer: 1,
            explanation: "Non-disclosure of pre-existing conditions can lead to claim rejection.",
            difficulty: "Super Hard",
            category: "Travel Insurance"
          },
          {
            id: 171,
            question: "An individual with a home insurance policy moves out of the insured house and rents it out. They do not inform the insurer. A theft occurs. How will the claim be processed?",
            options: [
              "Fully approved as theft is covered",
              "Rejected due to non-disclosure of occupancy change",
              "Approved partially after risk assessment",
              "Approved only if theft occurred due to forced entry"
            ],
            correctAnswer: 1,
            explanation: "Changes in occupancy affect risk assessment and must be disclosed.",
            difficulty: "Super Hard",
            category: "Home Insurance"
          },
          {
            id: 172,
            question: "A company takes professional indemnity insurance. An employee commits fraud, leading to client losses. How will the insurer handle the claim?",
            options: [
              "Fully approved as fraud is a financial loss",
              "Rejected as fraud is a deliberate act",
              "Approved partially if employee acted negligently",
              "Approved only if fraud was unintentional"
            ],
            correctAnswer: 1,
            explanation: "Fraud is typically excluded unless covered by a fidelity guarantee policy.",
            difficulty: "Super Hard",
            category: "Professional Indemnity"
          },
          {
            id: 173,
            question: "A vehicle owner lends their insured car to a friend, who gets into an accident. The friend is not listed as a driver in the policy. What happens to the claim?",
            options: [
              "Fully approved as vehicle is insured",
              "Rejected as unauthorized driver was involved",
              "Approved partially based on third-party damage",
              "Approved only if the friend had a valid driving license"
            ],
            correctAnswer: 1,
            explanation: "Coverage depends on whether the policy permits unnamed drivers.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 174,
          question: "A person purchases a personal accident policy and dies due to a pre-existing heart condition while driving. How will the insurer process the claim?",
          options: [
            "Fully approved as death occurred while driving",
            "Rejected since death was due to a pre-existing condition",
            "Approved partially based on accidental impact",
            "Approved only if the heart condition was declared in advance"
          ],
          correctAnswer: 1,
          explanation: "Personal accident insurance covers accidental deaths, but natural causes may not be included.",
          difficulty: "Super Hard",
          category: "Personal Accident Insurance"
        },
        {
          id: 175,
          question: "An insured house suffers structural damage due to an earthquake, but the policyholder had opted out of the earthquake cover. What will the insurer do?",
          options: [
            "Approve fully since it is a natural disaster",
            "Reject the claim as the earthquake cover was not taken",
            "Approve partially for incidental damages",
            "Approve only if local authorities declare a disaster"
          ],
          correctAnswer: 1,
          explanation: "If earthquake cover is not included, damage due to earthquakes is not covered.",
          difficulty: "Super Hard",
          category: "Home Insurance"
        },
        {
          id: 176,
          question: "A cargo shipment is insured for marine transit, but it is delayed due to a port strike. The insured claims compensation for financial losses. What will the insurer do?",
          options: [
            "Approve fully since the loss was due to a delay",
            "Reject since marine insurance does not cover delays",
            "Approve partially for incidental damages",
            "Approve only if the strike was unforeseen"
          ],
          correctAnswer: 1,
          explanation: "Marine insurance does not cover financial losses due to delays unless explicitly mentioned.",
          difficulty: "Super Hard",
          category: "Marine Insurance"
        },
        {
          id: 177,
          question: "An individual is diagnosed with a critical illness but has already exceeded the policy's sum insured for the year. Can they still claim additional treatment costs?",
          options: [
            "Yes, as the illness is covered under critical illness",
            "No, since the sum insured is exhausted",
            "Yes, but only for emergency hospitalization",
            "No, unless there is a restoration benefit"
          ],
          correctAnswer: 1,
          explanation: "Once the sum insured is exhausted, claims cannot be made unless a restoration benefit exists.",
          difficulty: "Super Hard",
          category: "Health Insurance"
        },
        {
          id: 178,
          question: "A factory has fire insurance, but the owner deliberately sets fire to the premises for an insurance claim. How will the insurer respond?",
          options: [
            "Approve since fire is a covered peril",
            "Reject due to fraud and possible criminal charges",
            "Approve partially for collateral damage",
            "Approve only if the fire spread unintentionally"
          ],
          correctAnswer: 1,
          explanation: "Deliberate damage is considered fraud and leads to claim rejection.",
          difficulty: "Super Hard",
          category: "Fire Insurance"
        },
        {
          id: 179,
          question: "A company purchases cyber insurance but fails to update its security software. A cyberattack occurs. What happens to the claim?",
          options: [
            "Fully approved as cyber risks are covered",
            "Rejected due to negligence in security maintenance",
            "Approved partially after forensic analysis",
            "Approved only if the insurer was notified before the attack"
          ],
          correctAnswer: 1,
          explanation: "Failure to maintain basic security protocols can lead to claim rejection.",
          difficulty: "Super Hard",
          category: "Cyber Insurance"
        },
        {
          id: 180,
          question: "A person insures their car under a third-party policy but gets into an accident that damages their own vehicle. What will happen?",
          options: [
            "Fully approved since the vehicle is insured",
            "Rejected since third-party insurance does not cover own damage",
            "Approved partially based on depreciation",
            "Approved only if the vehicle was not at fault"
          ],
          correctAnswer: 1,
          explanation: "Third-party insurance covers only liability towards others, not own damages.",
          difficulty: "Super Hard",
          category: "Motor Insurance"
        },
        {
          id: 181,
          question: "An insured farmer suffers crop losses due to unseasonal rain, but the insurance payout is lower than expected. What could be the reason?",
          options: [
            "Claim settlement is based on weather patterns",
            "Payout is calculated based on pre-fixed parameters",
            "Losses are covered only if declared by authorities",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Crop insurance uses fixed parameters and government declarations for payouts.",
          difficulty: "Super Hard",
          category: "Agricultural Insurance"
        },
        {
          id: 182,
          question: "A construction company takes liability insurance, but a worker is injured due to unsafe practices. Will the insurer pay the claim?",
          options: [
            "Fully approved as worker injury is covered",
            "Rejected if negligence is proven",
            "Approved only if safety audits were conducted",
            "Approved partially after legal assessment"
          ],
          correctAnswer: 1,
          explanation: "Negligence can impact claim settlements in liability insurance.",
          difficulty: "Super Hard",
          category: "Liability Insurance"
        },
        {
          id: 183,
          question: "An individual claims hospitalization costs under their health insurance policy, but the treatment was experimental. How will the insurer handle this?",
          options: [
            "Fully approved as health coverage applies",
            "Rejected since experimental treatments are excluded",
            "Approved partially based on medical necessity",
            "Approved only if treatment is FDA-approved"
          ],
          correctAnswer: 1,
          explanation: "Experimental treatments are often excluded unless specifically covered.",
          difficulty: "Super Hard",
          category: "Health Insurance"
        },
        {
          id: 184,
          question: "A company purchases employee group insurance. One employee quits but does not buy a separate policy. A month later, they fall ill. What happens?",
          options: [
            "Claim is fully approved under the previous group policy",
            "Rejected since group coverage ended upon leaving the job",
            "Approved partially for emergency hospitalization",
            "Approved only if conversion to individual policy was done"
          ],
          correctAnswer: 1,
          explanation: "Group insurance covers employees only while they are part of the organization.",
          difficulty: "Super Hard",
          category: "Group Insurance"
        },
        {
          id: 185,
          question: "A vehicle owner does not inform the insurer about major car modifications. Later, they file a claim for an accident. What will the insurer do?",
          options: [
            "Approve fully since the vehicle was insured",
            "Reject due to non-disclosure of modifications",
            "Approve partially after depreciation",
            "Approve only if modifications did not cause the accident"
          ],
          correctAnswer: 1,
          explanation: "Failure to disclose modifications can lead to claim rejection.",
          difficulty: "Super Hard",
          category: "Motor Insurance"
        },
        {
          id: 186,
          question: "A policyholder forgets to renew their travel insurance before an international trip. They fall sick abroad and try to buy insurance mid-trip. What happens?",
          options: [
            "Claim is fully approved under the new policy",
            "Rejected as policies do not cover pre-existing events",
            "Approved partially based on new symptoms",
            "Approved only if the illness started after policy purchase"
          ],
          correctAnswer: 1,
          explanation: "Insurance does not cover events that occurred before policy purchase.",
          difficulty: "Super Hard",
          category: "Travel Insurance"
        },
        {
          id: 187,
          question: "An insured individual's house is destroyed in a natural disaster, but the policy has an underinsurance clause. What will happen?",
          options: [
            "Full claim is paid since the loss is total",
            "Claim is reduced proportionally due to underinsurance",
            "Claim is rejected due to inadequate coverage",
            "Claim is approved only if declared a government disaster"
          ],
          correctAnswer: 1,
          explanation: "Underinsurance can lead to proportional claim reductions.",
          difficulty: "Super Hard",
          category: "Home Insurance"
        },
        {
            id: 188,
            question: "A vehicle owner has a comprehensive motor insurance policy but fails to inform the insurer about a change in their address. Later, they meet with an accident in the new location. What will the insurer do?",
            options: [
              "Fully approve the claim since location does not affect coverage",
              "Reject the claim due to non-disclosure of a material fact",
              "Approve partially, deducting a penalty for non-disclosure",
              "Approve only if the new location does not increase risk"
            ],
            correctAnswer: 1,
            explanation: "Failure to disclose a change in address can lead to claim complications, depending on whether risk factors are altered.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 189,
            question: "A fire insurance policyholder underreports the value of their property to reduce premiums. If a fire destroys the property, how will the insurer respond?",
            options: [
              "Fully approve the claim based on the sum insured",
              "Reject the claim due to misrepresentation",
              "Approve partially as per the average clause",
              "Approve only if the underreporting was within tolerance limits"
            ],
            correctAnswer: 2,
            explanation: "Underinsurance leads to proportional claim reductions as per the average clause.",
            difficulty: "Super Hard",
            category: "Fire Insurance"
          },
          {
            id: 190,
            question: "A cargo shipment covered under marine insurance is damaged due to improper packaging. What will happen?",
            options: [
              "Fully approve the claim since damage occurred in transit",
              "Reject the claim due to improper packaging",
              "Approve partially after assessing the extent of damage",
              "Approve only if the packaging was done as per industry standards"
            ],
            correctAnswer: 1,
            explanation: "Marine policies exclude damages caused due to improper packaging, unless specified otherwise.",
            difficulty: "Super Hard",
            category: "Marine Insurance"
          },
          {
            id: 191,
            question: "A person purchases a critical illness policy but is diagnosed with a disease before the policy start date. Can they make a claim?",
            options: [
              "Fully approved if the diagnosis is post-policy issuance",
              "Rejected since the illness was pre-existing",
              "Approved partially for treatment initiated after policy start",
              "Approved only if the waiting period has been completed"
            ],
            correctAnswer: 1,
            explanation: "Pre-existing conditions are generally excluded unless declared and accepted under policy terms.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 192,
            question: "An insured farmer's crop is destroyed due to pest infestation. The policy covers natural calamities but is silent on pests. How will the claim be processed?",
            options: [
              "Fully approved as the loss is agricultural",
              "Rejected since pests are not covered explicitly",
              "Approved partially if pests are considered an extension of natural causes",
              "Approved only if a government agency declares it a disaster"
            ],
            correctAnswer: 1,
            explanation: "Unless explicitly covered, pest-related losses are not compensated under natural calamity clauses.",
            difficulty: "Super Hard",
            category: "Agricultural Insurance"
          },
          {
            id: 193,
            question: "A person with health insurance undergoes treatment at a non-network hospital. How will the insurer settle the claim?",
            options: [
              "Fully reimburse the claim as per policy limits",
              "Reject the claim since the hospital is non-network",
              "Approve partially under reimbursement mode",
              "Approve only if emergency treatment was taken"
            ],
            correctAnswer: 2,
            explanation: "Cashless facilities are limited to network hospitals, but reimbursement is possible for non-network hospitals.",
            difficulty: "Super Hard",
            category: "Health Insurance"
          },
          {
            id: 194,
            question: "An individual takes travel insurance and experiences flight cancellation due to an airline strike. What happens to their claim?",
            options: [
              "Fully approved as strikes are unavoidable",
              "Rejected since airline strikes are generally excluded",
              "Approved partially for additional expenses incurred",
              "Approved only if the policy includes trip interruption cover"
            ],
            correctAnswer: 3,
            explanation: "Trip interruption coverage determines the eligibility of claims related to strikes and cancellations.",
            difficulty: "Super Hard",
            category: "Travel Insurance"
          },
          {
            id: 195,
            question: "A corporate entity takes cyber insurance. A data breach occurs due to an employee clicking a phishing link. How does the insurer handle the claim?",
            options: [
              "Fully approve since cyber risks are covered",
              "Reject the claim due to negligence",
              "Approve partially for immediate mitigation costs",
              "Approve only if the company had adequate cybersecurity measures"
            ],
            correctAnswer: 3,
            explanation: "Coverage depends on whether the company had reasonable cybersecurity measures in place.",
            difficulty: "Super Hard",
            category: "Cyber Insurance"
          },
          {
            id: 196,
            question: "A warehouse has flood insurance, but the insured failed to maintain proper drainage, leading to water accumulation. What happens?",
            options: [
              "Fully approve since flood is a covered peril",
              "Reject the claim due to lack of preventive maintenance",
              "Approve partially for uncontrollable damages",
              "Approve only if the flood was declared a national disaster"
            ],
            correctAnswer: 1,
            explanation: "Negligence in maintenance can lead to partial or full claim rejection.",
            difficulty: "Super Hard",
            category: "Property Insurance"
          },
          {
            id: 197,
            question: "A third-party motor insurance policyholder is involved in an accident where the other driver is equally at fault. What happens?",
            options: [
              "Fully approve since liability insurance applies",
              "Reject the claim due to shared fault",
              "Approve partially based on legal arbitration",
              "Approve only if the court assigns full liability"
            ],
            correctAnswer: 2,
            explanation: "Third-party claims depend on liability assessment, and shared fault may impact payouts.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 198,
            question: "An insured factory suffers machinery breakdown, but the cause is general wear and tear. How does the insurer respond?",
            options: [
              "Fully approve the claim as the breakdown occurred",
              "Reject the claim since wear and tear is excluded",
              "Approve partially for sudden damage",
              "Approve only if breakdown was unexpected"
            ],
            correctAnswer: 1,
            explanation: "Insurance does not cover losses due to gradual deterioration.",
            difficulty: "Super Hard",
            category: "Engineering Insurance"
          },
          {
            id: 199,
            question: "A business owner takes a burglary insurance policy but forgets to lock the premises. A theft occurs. What happens?",
            options: [
              "Fully approve since theft is covered",
              "Reject due to negligence in securing the premises",
              "Approve partially for forced entry damages",
              "Approve only if police confirm no negligence"
            ],
            correctAnswer: 1,
            explanation: "Failure to take reasonable precautions can lead to claim rejection.",
            difficulty: "Super Hard",
            category: "Burglary Insurance"
          },
          {
            id: 200,
            question: "A person suffering from a terminal illness buys a life insurance policy without disclosing their condition. What will happen?",
            options: [
              "Fully approve the claim after death",
              "Reject the claim due to material non-disclosure",
              "Approve partially if premiums were paid for a minimum period",
              "Approve only if contestability period has passed"
            ],
            correctAnswer: 2,
            explanation: "Non-disclosure of a material fact like a terminal illness can lead to claim rejection.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 201,
            question: "A construction company delays renewing its liability insurance policy. An accident occurs during the gap period. Will the insurer pay?",
            options: [
              "Fully approve since the policy was renewed later",
              "Reject due to the lapse in coverage",
              "Approve partially for extenuating circumstances",
              "Approve only if retroactive coverage was purchased"
            ],
            correctAnswer: 1,
            explanation: "Lapsed policies do not cover incidents that occur during the gap period.",
            difficulty: "Super Hard",
            category: "Liability Insurance"
          },
          {
            id: 202,
            question: "A car owner has a valid comprehensive insurance policy but had installed an unauthorized CNG kit without informing the insurer. The vehicle catches fire due to a short circuit. How will the insurer process the claim?",
            options: [
              "Fully approve since fire is a covered peril",
              "Reject due to non-disclosure of modification",
              "Approve partially, deducting extra risk factor",
              "Approve only if the modification did not contribute to the fire"
            ],
            correctAnswer: 1,
            explanation: "Undisclosed vehicle modifications can lead to claim rejection if they impact risk assessment.",
            difficulty: "Super Hard",
            category: "Motor Insurance"
          },
          {
            id: 203,
            question: "A homeowner with a valid fire insurance policy fails to repair an old, faulty wiring system. A fire breaks out due to a short circuit. How will the insurer settle the claim?",
            options: [
              "Fully approve since fire is a covered peril",
              "Reject due to negligence in maintenance",
              "Approve partially, deducting depreciation",
              "Approve only if the fire was completely accidental"
            ],
            correctAnswer: 2,
            explanation: "Negligence in maintaining the insured property can lead to claim rejection.",
            difficulty: "Super Hard",
            category: "Fire Insurance"
          },
          {
            id: 204,
            question: "A factory owner has business interruption insurance but fails to maintain proper inventory records. After a flood, they claim losses beyond what they can prove. What will the insurer do?",
            options: [
              "Fully approve based on estimated losses",
              "Reject due to lack of documentary evidence",
              "Approve partially based on forensic evaluation",
              "Approve only if an independent auditor verifies the claim"
            ],
            correctAnswer: 2,
            explanation: "Claim approval depends on the ability to prove loss with proper records.",
            difficulty: "Super Hard",
            category: "Business Insurance"
          },
          {
            id: 205,
            question: "A person takes a travel insurance policy but forgets to include pre-existing illness coverage. During the trip, they suffer a heart attack linked to a past condition. What happens?",
            options: [
              "Fully approve if medical emergency occurred",
              "Reject due to pre-existing condition exclusion",
              "Approve partially for hospitalization costs",
              "Approve only if it was a first-time occurrence"
            ],
            correctAnswer: 2,
            explanation: "Pre-existing conditions are typically excluded unless specifically covered.",
            difficulty: "Super Hard",
            category: "Travel Insurance"
          },
          {
            id: 206,
            question: "A jewelry store owner has burglary insurance but forgets to activate the security alarm one night. A theft occurs. What happens?",
            options: [
              "Fully approve since theft is covered",
              "Reject due to negligence in securing the premises",
              "Approve partially for forced entry damages",
              "Approve only if police confirm burglary without negligence"
            ],
            correctAnswer: 2,
            explanation: "Failure to activate security measures can result in claim rejection.",
            difficulty: "Super Hard",
            category: "Burglary Insurance"
          },
          {
            id: 207,
            question: "A person suffering from a terminal illness purchases a life insurance policy and dies within a year. The insurer finds out about the non-disclosure. What will happen?",
            options: [
              "Fully approve the claim",
              "Reject due to material non-disclosure",
              "Approve partially for the premiums paid",
              "Approve only if the policy’s contestability period is over"
            ],
            correctAnswer: 2,
            explanation: "Material non-disclosure can lead to claim rejection within the contestability period.",
            difficulty: "Super Hard",
            category: "Life Insurance"
          },
          {
            id: 208,
            question: "A corporate liability insurance policyholder is sued for defamation, but the lawsuit arises from a personal social media post of the CEO. How will the insurer respond?",
            options: [
              "Fully approve since liability insurance covers lawsuits",
              "Reject since personal actions are not covered",
              "Approve partially if the post was business-related",
              "Approve only if the company itself is directly sued"
            ],
            correctAnswer: 2,
            explanation: "Corporate liability insurance does not cover personal liabilities of employees or executives.",
            difficulty: "Super Hard",
            category: "Liability Insurance"
          },
          {
            id: 209,
            question: "A manufacturing company takes product liability insurance but starts using a cheaper, unapproved material in production. A customer files a lawsuit due to injury. What will happen?",
            options: [
              "Fully approve since liability insurance covers customer injury",
              "Reject due to unapproved material usage",
              "Approve partially based on original product specifications",
              "Approve only if the material change did not cause the injury"
            ],
            correctAnswer: 2,
            explanation: "Deviation from approved specifications can void product liability coverage.",
            difficulty: "Super Hard",
            category: "Product Liability Insurance"
          },
          {
            id: 210,
            question: "A contractor purchases a construction all-risk policy. Due to a sudden supplier strike, work halts for months, exposing materials to weather damage. Will the insurer pay?",
            options: [
              "Fully approve since materials are covered",
              "Reject due to project delay exclusion",
              "Approve partially for non-negligent damages",
              "Approve only if the delay was uncontrollable"
            ],
            correctAnswer: 2,
            explanation: "Delays and project halts are typically excluded from construction all-risk policies.",
            difficulty: "Super Hard",
            category: "Construction Insurance"
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
  
          // Check if IC11 access code exists and is valid
          if (data.accesscode && data.accesscode.IC11) {
              const accessCodeData = data.accesscode.IC11;
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
              'IC11': {
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
  
          if (data.examanswers && data.examanswers.IC11 && data.examanswers.IC11.answers) {
              const savedAnswers = data.examanswers.IC11.answers;
              
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
          return `IC11-${randomPin}`;
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
                  name: "Arkhamm AI Private Limited",
                  description: "IC-11 Practice of General Insurance Exam Access",
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
                                  examType: 'IC11'
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
                      examType: 'IC11'
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
                  examType: 'IC11'
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
          doc.text('III-IC 11: Practice of General Insurance Mock Report', 10, 10);
          
          // Certificate Details
          doc.setFontSize(12);
          doc.text(`Certificate Number: ${examMetadata.certificateNumber}`, 10, 50);
          doc.text(`Exam Name: Practice of General Insurance IC 11`, 10, 60);
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
              doc.text('III-IC 11: Practice of General Insurance Mock Report', pageWidth / 2, 30, { align: 'right' });
      
              // Exam Details
              doc.setFontSize(12);
              doc.setTextColor(0, 0, 0);
              let yPosition = 50;
      
              const addDetailLine = (label, value) => {
                  doc.text(`${label}: ${value}`, margin, yPosition);
                  yPosition += 10;
              };
      
              addDetailLine('Report Number', examMetadata.certificateNumber);
              addDetailLine('Exam Name', 'Practice of General Insurance IC 11');
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
              doc.text('III-IC 11: Practice of General Insurance Mock Report', pageWidth / 2, 30, { align: 'right' });
      
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
                      <span style={{fontSize: 14, color: 'black'}} className={styles.questionDifficulty}>
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
                  <h1 style={{fontSize: 24}}><ScanSearch size={20} style={{marginTop: -5}} /> IRDAI: IC 11</h1>
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
                          <Disc size={18} /> IC-11: Practice of General Insurance Exam
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
  