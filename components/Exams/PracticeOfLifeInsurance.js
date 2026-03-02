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


export default function PracticeOfLifeInsurance() {
    const questions = [
        {
            id: 1,
            question: "Which of the following correctly describes insurable interest in life insurance?",
            options: [
                "Must exist at the time of claim",
                "Must exist at the time of policy inception",
                "Must exist both at policy inception and claim",
                "Is not required in life insurance"
            ],
            correctAnswer: 1,
            explanation: "In life insurance, insurable interest must exist at the time of policy inception but not necessarily at the time of claim.",
            difficulty: "Easy",
            category: "Insurance Basics"
        },
        {
            id: 2,
            question: "Rahul buys a life insurance policy and lies about his smoking habits. Which principle of insurance is being violated?",
            options: [
                "Principle of Indemnity",
                "Principle of Contribution",
                "Principle of Utmost Good Faith",
                "Principle of Subrogation"
            ],
            correctAnswer: 2,
            explanation: "The principle of utmost good faith requires complete honesty in disclosing material facts, including smoking habits.",
            difficulty: "Easy",
            category: "Legal Principles"
        },
        {
            id: 3,
            question: "A person takes multiple life insurance policies from different companies. In case of death, how will claims be settled?",
            options: [
                "All insurers will pay the full sum assured",
                "Only the first insurer will pay",
                "Each insurer will contribute proportionally",
                "Only the insurer with the highest sum assured will pay"
            ],
            correctAnswer: 0,
            explanation: "Life insurance does not follow the principle of contribution, so all policies will pay the full sum assured.",
            difficulty: "Easy",
            category: "Claims Management"
        },
        {
            id: 4,
            question: "Under which principle does an insurance company have the right to recover its losses from a third party responsible for the loss?",
            options: [
                "Principle of Subrogation",
                "Principle of Indemnity",
                "Principle of Contribution",
                "Principle of Insurable Interest"
            ],
            correctAnswer: 0,
            explanation: "Subrogation allows an insurer to recover the loss amount from a third party responsible for the damage, but this mainly applies to general insurance, not life insurance.",
            difficulty: "Easy",
            category: "Legal Principles"
        },
        {
            id: 5,
            question: "Rita purchases a life insurance policy and names her husband as the nominee. Who will receive the claim if the nominee dies before her?",
            options: [
                "Her legal heirs",
                "Insurance company",
                "Government",
                "No one, the policy becomes void"
            ],
            correctAnswer: 0,
            explanation: "If the nominee predeceases the policyholder, the claim amount is paid to the legal heirs of the policyholder.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 6,
            question: "What happens if a policyholder fails to disclose a pre-existing disease while purchasing a life insurance policy?",
            options: [
                "Claim will always be paid",
                "Claim may be rejected if material non-disclosure is proven",
                "Policy will be canceled immediately",
                "Premium will be refunded"
            ],
            correctAnswer: 1,
            explanation: "Non-disclosure of material facts, like pre-existing diseases, can lead to claim rejection if proven during investigation.",
            difficulty: "Easy",
            category: "Underwriting"
        },
        {
            id: 7,
            question: "Which principle ensures that an insured does not profit from an insurance claim?",
            options: [
                "Principle of Contribution",
                "Principle of Indemnity",
                "Principle of Subrogation",
                "Principle of Proximate Cause"
            ],
            correctAnswer: 1,
            explanation: "The principle of indemnity ensures that the insured is compensated only for the actual loss suffered, except in life insurance where a sum assured is paid.",
            difficulty: "Easy",
            category: "Legal Principles"
        },
        {
            id: 8,
            question: "A policyholder commits suicide within one year of purchasing a life insurance policy. What will the insurer do?",
            options: [
                "Reject the claim entirely",
                "Pay full sum assured",
                "Refund only the premiums paid",
                "Pay double the sum assured"
            ],
            correctAnswer: 2,
            explanation: "Most life insurance policies have a suicide clause that refunds only the premiums paid if suicide occurs within the first year.",
            difficulty: "Easy",
            category: "Claims Management"
        },
        {
            id: 9,
            question: "What is the main purpose of a grace period in life insurance?",
            options: [
                "To allow late payments without policy lapse",
                "To increase policy benefits",
                "To extend the policy tenure",
                "To add extra coverage"
            ],
            correctAnswer: 0,
            explanation: "A grace period allows policyholders to make late payments without losing coverage, usually for 30 days.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 10,
            question: "In life insurance, which factor has the most impact on premium calculation?",
            options: [
                "Policyholder's age",
                "Policyholder's address",
                "Policyholder's marital status",
                "Policyholder's occupation"
            ],
            correctAnswer: 0,
            explanation: "Age is the most important factor in determining life insurance premiums, as older individuals have higher mortality risks.",
            difficulty: "Easy",
            category: "Underwriting"
        },
        {
            id: 11,
            question: "Which of the following will NOT be considered a valid insurable interest in life insurance?",
            options: [
                "A wife insuring her husband's life",
                "A company insuring the life of its key employee",
                "A friend insuring another friend's life",
                "A person insuring their own life"
            ],
            correctAnswer: 2,
            explanation: "A person cannot have an insurable interest in a friend's life unless there is financial dependence or a legal obligation.",
            difficulty: "Easy",
            category: "Insurance Basics"
        },
        {
            id: 12,
            question: "What is the purpose of the free-look period in life insurance?",
            options: [
                "To test the policy benefits",
                "To return the policy if unsatisfied",
                "To make changes to the sum assured",
                "To modify the premium amount"
            ],
            correctAnswer: 1,
            explanation: "The free-look period allows policyholders to cancel the policy within a set time (usually 15 days) and get a refund if unsatisfied.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 13,
            question: "If a life insurance policy is assigned to a bank for a loan, who receives the claim benefit in case of the insured's death?",
            options: [
                "The nominee",
                "The bank",
                "The legal heirs",
                "The insurer"
            ],
            correctAnswer: 1,
            explanation: "When a policy is assigned to a bank, the bank receives the claim amount first to settle the outstanding loan.",
            difficulty: "Easy",
            category: "Policy Assignment"
        },
        {
            id: 14,
            question: "A term insurance policy does not have which of the following features?",
            options: [
                "Death benefit",
                "Maturity benefit",
                "Low premium",
                "High sum assured"
            ],
            correctAnswer: 1,
            explanation: "Term insurance only provides a death benefit and does not offer a maturity benefit upon policy completion.",
            difficulty: "Easy",
            category: "Types of Insurance"
        },
        {
            id: 15,
            question: "What happens if a person surrenders their life insurance policy before maturity?",
            options: [
                "Receives the full sum assured",
                "Policy continues without premium payment",
                "Receives a surrender value",
                "No payout at all"
            ],
            correctAnswer: 2,
            explanation: "A surrendered life insurance policy provides a surrender value, which is typically lower than the sum assured.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 16,
            question: "A person purchases a life insurance policy and later decides to change the nominee. What will happen if the original nominee refuses to agree?",
            options: [
                "The nominee must agree for the change to be valid",
                "Only the insurer can approve such changes",
                "The policyholder can change the nominee anytime",
                "The policy is canceled automatically"
            ],
            correctAnswer: 2,
            explanation: "The policyholder has full rights to change the nominee at any time without requiring the nominee’s consent.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 17,
            question: "Under which condition will an insurance claim be rejected even if the policy is active?",
            options: [
                "If the insured dies in an accident",
                "If the nominee fails to submit claim documents",
                "If the insured dies after the policy expires",
                "If the policyholder stops paying premiums after 5 years"
            ],
            correctAnswer: 2,
            explanation: "A claim will be rejected if the policy expires before the insured's death, as no coverage exists beyond the expiry date.",
            difficulty: "Easy",
            category: "Claims Management"
        },
        {
            id: 18,
            question: "A policyholder assigns his life insurance policy to his friend. Who will receive the maturity benefit?",
            options: [
                "The policyholder’s nominee",
                "The insurer",
                "The assigned friend",
                "The government"
            ],
            correctAnswer: 2,
            explanation: "When a policy is assigned, all benefits transfer to the assignee (the friend, in this case).",
            difficulty: "Easy",
            category: "Policy Assignment"
        },
        {
            id: 19,
            question: "What will happen if an insurance proposal is accepted but the first premium is not paid?",
            options: [
                "The policy starts immediately",
                "The policy is considered void",
                "Coverage begins, but claims may be rejected",
                "The insurer will cover the insured for one month"
            ],
            correctAnswer: 1,
            explanation: "A policy does not come into effect until the first premium is paid.",
            difficulty: "Easy",
            category: "Underwriting"
        },
        {
            id: 20,
            question: "Which factor does NOT directly affect life insurance premiums?",
            options: [
                "Age of the insured",
                "Marital status",
                "Health condition",
                "Policy term"
            ],
            correctAnswer: 1,
            explanation: "Marital status does not directly influence life insurance premiums, whereas age, health, and policy term do.",
            difficulty: "Easy",
            category: "Underwriting"
        },
        {
            id: 21,
            question: "An individual forgets to renew their term insurance policy within the grace period. What happens next?",
            options: [
                "The policy remains active but with reduced coverage",
                "The policy lapses, and no benefits are payable",
                "The insured can claim benefits for the next 3 months",
                "The nominee can still receive the claim amount if death occurs"
            ],
            correctAnswer: 1,
            explanation: "If the policy is not renewed within the grace period, it lapses, and coverage ceases.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 22,
            question: "A policyholder is diagnosed with a terminal illness after buying a life insurance policy. What happens to the coverage?",
            options: [
                "The policy is automatically canceled",
                "Premiums will increase immediately",
                "Coverage continues as per the original terms",
                "Only 50% of the sum assured will be paid"
            ],
            correctAnswer: 2,
            explanation: "Once a policy is issued, coverage continues as per the agreed terms, regardless of later health changes.",
            difficulty: "Easy",
            category: "Underwriting"
        },
        {
            id: 23,
            question: "A person has multiple life insurance policies. Which insurer will pay the claim first in case of death?",
            options: [
                "The one with the highest sum assured",
                "The one with the lowest premium",
                "All insurers will pay simultaneously",
                "It depends on which insurer processes the claim first"
            ],
            correctAnswer: 2,
            explanation: "All life insurance policies pay out separately as they do not follow the contribution principle.",
            difficulty: "Easy",
            category: "Claims Management"
        },
        {
            id: 24,
            question: "What happens if a nominee is a minor at the time of claim settlement?",
            options: [
                "The claim amount is given directly to the minor",
                "The insurer will withhold the amount until the nominee turns 18",
                "A legal guardian will receive the claim amount",
                "The policy benefits will be forfeited"
            ],
            correctAnswer: 2,
            explanation: "A legal guardian is appointed to receive and manage the claim amount until the minor becomes an adult.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 25,
            question: "A person buys a life insurance policy but does not mention their hazardous occupation. What may happen?",
            options: [
                "The insurer will charge a higher premium later",
                "The claim may be denied if the death is work-related",
                "The policy will be canceled immediately",
                "Nothing, since occupation does not affect life insurance"
            ],
            correctAnswer: 1,
            explanation: "Non-disclosure of hazardous occupations may lead to claim rejection if death occurs due to work-related risks.",
            difficulty: "Easy",
            category: "Underwriting"
        },
        {
            id: 26,
            question: "In case of an insured’s accidental death, which document is essential for claim settlement?",
            options: [
                "Birth certificate",
                "Police FIR report",
                "Nominee’s bank statement",
                "The insured’s salary slip"
            ],
            correctAnswer: 1,
            explanation: "A police FIR report is required for claims related to accidental death.",
            difficulty: "Easy",
            category: "Claims Management"
        },
        {
            id: 27,
            question: "If an insured person dies on the last day of the grace period, what happens to the claim?",
            options: [
                "Claim is rejected due to non-payment",
                "Claim is payable since the policy was still in force",
                "Only half the sum assured is paid",
                "The claim amount is reduced by unpaid premiums"
            ],
            correctAnswer: 1,
            explanation: "A policy remains active during the grace period, so the claim will be paid.",
            difficulty: "Easy",
            category: "Claims Management"
        },
        {
            id: 28,
            question: "A policyholder wants to take a loan against their life insurance policy. Which type of policy allows this?",
            options: [
                "Term insurance",
                "Unit-linked insurance plan (ULIP)",
                "Whole life or endowment policy",
                "Personal accident insurance"
            ],
            correctAnswer: 2,
            explanation: "Loans can be taken against whole life and endowment policies but not against term insurance or accident policies.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 29,
            question: "If a policyholder fails to pay premiums but wants to restore the policy, what is required?",
            options: [
                "Pay only the next premium",
                "Pay all pending premiums with interest",
                "Submit a new policy proposal",
                "Nominee must provide consent"
            ],
            correctAnswer: 1,
            explanation: "To reinstate a lapsed policy, the policyholder must pay all overdue premiums with interest.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 30,
            question: "Which of the following is NOT a valid reason for a life insurance claim rejection?",
            options: [
                "Fraudulent non-disclosure of health conditions",
                "Policyholder dies due to a pre-existing disease after 5 years",
                "Suicide within the first year of the policy",
                "Nominee forgets to inform the insurer within 10 days"
            ],
            correctAnswer: 3,
            explanation: "There is no strict deadline for nominees to inform insurers, although timely intimation is recommended.",
            difficulty: "Easy",
            category: "Claims Management"
        },
        {
            id: 31,
            question: "A policyholder accidentally misstates their age while purchasing life insurance. What will the insurer do when this is discovered?",
            options: [
                "Cancel the policy immediately",
                "Adjust the sum assured or premium accordingly",
                "Reject all future claims",
                "Charge a penalty for misrepresentation"
            ],
            correctAnswer: 1,
            explanation: "If an age misstatement is discovered, the insurer will adjust the sum assured or premium based on the correct age.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 32,
            question: "A person takes a life insurance policy and dies within 3 months. Under which condition can the claim be denied?",
            options: [
                "If the insured died due to an accident",
                "If the insured had a pre-existing illness and hid it",
                "If the nominee is not an immediate family member",
                "If the insurer is facing financial losses"
            ],
            correctAnswer: 1,
            explanation: "If the insured intentionally hid a pre-existing illness, the claim may be denied due to non-disclosure of material facts.",
            difficulty: "Easy",
            category: "Claims Management"
        },
        {
            id: 33,
            question: "A policyholder forgets to mention a past illness while buying a policy. What happens if they die due to the same illness after 6 years?",
            options: [
                "Claim is rejected due to non-disclosure",
                "Claim is paid since the policy has completed 3 years",
                "Only half of the sum assured is paid",
                "The policy is canceled retroactively"
            ],
            correctAnswer: 1,
            explanation: "After three years (as per Section 45 of the Insurance Act), insurers cannot reject a claim based on past non-disclosures.",
            difficulty: "Easy",
            category: "Legal Principles"
        },
        {
            id: 34,
            question: "A policyholder forgets to pay the premium but dies during the grace period. What happens to the claim?",
            options: [
                "Claim is rejected due to non-payment",
                "Claim is paid after deducting unpaid premium",
                "Only half of the sum assured is paid",
                "The policy is reinstated automatically"
            ],
            correctAnswer: 1,
            explanation: "If death occurs during the grace period, the claim is paid after deducting the unpaid premium.",
            difficulty: "Easy",
            category: "Claims Management"
        },
        {
            id: 35,
            question: "Which of the following factors affects the insurability of a person the most?",
            options: [
                "Education level",
                "Income stability",
                "Current health condition",
                "Marital status"
            ],
            correctAnswer: 2,
            explanation: "Health condition significantly affects a person’s insurability, as it determines life expectancy and risk.",
            difficulty: "Easy",
            category: "Underwriting"
        },
        {
            id: 36,
            question: "A policyholder wants to change the sum assured after 5 years. What will the insurer most likely do?",
            options: [
                "Allow the increase without any checks",
                "Ask for fresh underwriting and medical tests",
                "Cancel the policy due to modification",
                "Charge a penalty for changing terms"
            ],
            correctAnswer: 1,
            explanation: "Increasing the sum assured often requires fresh underwriting and medical checks to assess the updated risk.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 37,
            question: "If a policyholder commits suicide within the first year of policy issuance, what happens to the claim?",
            options: [
                "Full claim is paid to the nominee",
                "Only the premiums paid are refunded",
                "Claim is rejected completely",
                "The sum assured is reduced by 50%"
            ],
            correctAnswer: 1,
            explanation: "If suicide occurs within the first year, only the premiums paid are refunded, not the sum assured.",
            difficulty: "Easy",
            category: "Legal Principles"
        },
        {
            id: 38,
            question: "A policyholder takes a term insurance policy but moves abroad permanently. What happens to the policy?",
            options: [
                "Policy remains valid without any changes",
                "Policy is canceled automatically",
                "Premiums will increase due to relocation",
                "Coverage is provided only for accidents"
            ],
            correctAnswer: 0,
            explanation: "Most term insurance policies remain valid even if the policyholder moves abroad, unless stated otherwise in the policy terms.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 39,
            question: "If a policyholder takes a loan against their life insurance policy and dies, what happens to the loan?",
            options: [
                "Loan is waived off",
                "Outstanding loan amount is deducted from the claim",
                "Nominee must repay the loan before claiming benefits",
                "Insurer cancels the policy and keeps the amount"
            ],
            correctAnswer: 1,
            explanation: "Outstanding loans against a policy are deducted from the claim amount before payout to the nominee.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 40,
            question: "What happens if a nominee dies before the policyholder?",
            options: [
                "Policy automatically terminates",
                "Policyholder must choose a new nominee",
                "Insurer decides the new nominee",
                "The claim will be rejected in the future"
            ],
            correctAnswer: 1,
            explanation: "If the nominee dies, the policyholder must update the nominee details to ensure smooth claim settlement.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 41,
            question: "Which of the following is NOT a valid reason for a life insurance claim rejection?",
            options: [
                "Policyholder lied about smoking habits",
                "Policyholder was murdered by the nominee",
                "Policyholder died in an accident",
                "Policyholder stopped paying premiums after grace period"
            ],
            correctAnswer: 2,
            explanation: "Accidental deaths are covered under life insurance unless explicitly excluded in the policy.",
            difficulty: "Easy",
            category: "Claims Management"
        },
        {
            id: 42,
            question: "A person has an insurance policy with a revival clause. What does it mean?",
            options: [
                "Premiums increase every year",
                "A lapsed policy can be reinstated under certain conditions",
                "Policy benefits are reduced over time",
                "Insurer can terminate the policy anytime"
            ],
            correctAnswer: 1,
            explanation: "A revival clause allows a lapsed policy to be reinstated by paying overdue premiums along with interest.",
            difficulty: "Easy",
            category: "Policy Provisions"
        },
        {
            id: 43,
            question: "Which of these is NOT an essential element of a valid insurance contract?",
            options: [
                "Legal consideration",
                "Offer and acceptance",
                "Government approval",
                "Insurable interest"
            ],
            correctAnswer: 2,
            explanation: "Government approval is not a requirement for individual insurance contracts; the other elements are essential.",
            difficulty: "Easy",
            category: "Legal Principles"
        },
        {
            id: 44,
            question: "If a policyholder fails to update their nominee details after divorce, who will receive the claim amount?",
            options: [
                "The ex-spouse as per records",
                "The legal heir as per succession laws",
                "The insurer decides",
                "The claim is rejected"
            ],
            correctAnswer: 0,
            explanation: "If a nominee is not updated, the ex-spouse remains the legal recipient unless challenged in court.",
            difficulty: "Easy",
            category: "Claims Management"
        },
        {
            id: 45,
            question: "A policyholder nominates a friend instead of a family member. What will happen at the time of claim settlement?",
            options: [
                "Claim is paid to the friend without issues",
                "Claim goes to the legal heirs instead",
                "The insurer will conduct an investigation",
                "Policy is canceled"
            ],
            correctAnswer: 1,
            explanation: "In cases where a nominee is not a legal heir, the claim may be contested by family members under succession laws.",
            difficulty: "Easy",
            category: "Legal Principles"
        },
        {
            id: 46,
            question: "A policyholder dies in a plane crash, and the investigation reveals that they were under the influence of alcohol. How will the insurer handle the claim?",
            options: [
                "Reject the claim due to intoxication",
                "Pay only the base sum assured, not accidental benefits",
                "Reject the claim unless premium payments were consistent",
                "Pay full benefits as intoxication is irrelevant in accidental death"
            ],
            correctAnswer: 1,
            explanation: "Most policies exclude claims if the insured was intoxicated at the time of death. However, if accidental death benefits were included, they may be denied while the base sum assured is paid.",
            difficulty: "Hard",
            category: "Claims Management"
        },
        {
            id: 47,
            question: "A policyholder is diagnosed with a terminal illness and decides to surrender their life insurance policy. What is the likely outcome?",
            options: [
                "They will receive the full sum assured immediately",
                "They will only receive the accumulated surrender value",
                "The claim will be paid to the nominee after their death",
                "The insurer will convert the policy into an endowment plan"
            ],
            correctAnswer: 1,
            explanation: "A surrendered policy provides only the surrender value, not the sum assured. The full sum assured is paid only if the policyholder keeps the policy active until death.",
            difficulty: "Hard",
            category: "Policy Provisions"
        },
        {
            id: 48,
            question: "A policyholder assigns their life insurance policy to a bank for a loan. If they pass away before repayment, what happens to the claim?",
            options: [
                "The bank receives the full claim amount",
                "The nominee receives the claim amount directly",
                "The insurer pays the loan balance to the bank and the remaining to the nominee",
                "The claim is held until the bank and nominee decide on settlement"
            ],
            correctAnswer: 2,
            explanation: "When a policy is assigned to a lender, the outstanding loan is deducted before the remaining amount is given to the nominee.",
            difficulty: "Hard",
            category: "Policy Assignment"
        },
        {
            id: 49,
            question: "A policyholder adds their minor child as a nominee. If the policyholder dies before the child reaches 18, what happens to the claim?",
            options: [
                "The claim is put on hold until the child turns 18",
                "The insurance company appoints a legal guardian",
                "The claim is paid to a legally appointed guardian or trustee",
                "The claim is forfeited due to minor nomination"
            ],
            correctAnswer: 2,
            explanation: "A minor nominee requires a legal guardian or trustee to receive the claim amount until they become legally eligible.",
            difficulty: "Hard",
            category: "Nomination & Legal Aspects"
        },
        {
            id: 50,
            question: "A policyholder buys multiple life insurance policies from different insurers without informing them. What happens in case of a claim?",
            options: [
                "Only one insurer will pay the claim",
                "Each insurer will pay proportionately based on premiums paid",
                "All insurers will pay the full sum assured independently",
                "The claim will be rejected due to non-disclosure"
            ],
            correctAnswer: 2,
            explanation: "Life insurance does not follow the principle of indemnity, so multiple policies can independently pay the full sum assured.",
            difficulty: "Hard",
            category: "Legal Principles"
        },
        {
            id: 51,
            question: "A life insurance policy has an incontestability clause. After how many years can the insurer not deny a claim due to misrepresentation?",
            options: [
                "1 year",
                "2 years",
                "3 years",
                "5 years"
            ],
            correctAnswer: 2,
            explanation: "As per Section 45 of the Insurance Act, after 3 years, an insurer cannot reject a claim based on misrepresentation, except in cases of fraud.",
            difficulty: "Hard",
            category: "Legal Principles"
        },
        {
            id: 52,
            question: "If a policyholder misstates their income to obtain a higher sum assured, how will the insurer handle this upon discovery?",
            options: [
                "Cancel the policy immediately",
                "Reduce the sum assured proportionately",
                "Increase future premiums to match actual income",
                "Reject all future claims outright"
            ],
            correctAnswer: 1,
            explanation: "If income misrepresentation is found, insurers may adjust the sum assured to match the correct eligibility rather than canceling the policy.",
            difficulty: "Hard",
            category: "Underwriting"
        },
        {
            id: 53,
            question: "A policyholder takes a critical illness rider but is diagnosed with a non-disclosed pre-existing disease within the waiting period. What happens?",
            options: [
                "Claim is rejected due to waiting period clause",
                "Only partial benefits are paid",
                "Claim is approved if disease is unrelated to critical illness",
                "Nominee can claim full benefits upon death"
            ],
            correctAnswer: 0,
            explanation: "Critical illness riders often have a waiting period during which claims for pre-existing conditions are denied.",
            difficulty: "Hard",
            category: "Riders & Add-ons"
        },
        {
            id: 54,
            question: "If an individual buys a life insurance policy with an annual premium but stops paying after 2 years, what happens?",
            options: [
                "Policy remains active with reduced benefits",
                "Policy lapses, but can be revived within a certain period",
                "Nominee still receives full sum assured if the policyholder dies",
                "Insurer refunds all premiums paid"
            ],
            correctAnswer: 1,
            explanation: "A lapsed policy can usually be revived within a stipulated timeframe by paying due premiums along with interest.",
            difficulty: "Hard",
            category: "Policy Lapses"
        },
        {
            id: 55,
            question: "What happens if a policyholder with a participating policy survives the entire policy term?",
            options: [
                "Receives only the base sum assured",
                "Receives sum assured plus bonuses",
                "No payout is made",
                "Nominee receives the payout instead"
            ],
            correctAnswer: 1,
            explanation: "Participating policies offer bonuses or additional payouts along with the base sum assured upon maturity.",
            difficulty: "Hard",
            category: "Policy Types"
        },
        {
            id: 56,
            question: "A policyholder lies about their smoking habits and dies due to lung disease after 4 years. What will the insurer do?",
            options: [
                "Reject the claim due to misrepresentation",
                "Pay full sum assured since 3 years have passed",
                "Pay only the premiums back",
                "Reduce the claim amount"
            ],
            correctAnswer: 1,
            explanation: "After 3 years, insurers cannot reject claims due to misrepresentation under Section 45 of the Insurance Act.",
            difficulty: "Hard",
            category: "Legal Principles"
        },
        {
            id: 57,
            question: "A policyholder’s death occurs under suspicious circumstances, and the nominee is a prime suspect. What will the insurer do?",
            options: [
                "Pay the claim immediately",
                "Hold the claim until legal clearance is given",
                "Cancel the policy entirely",
                "Distribute the sum assured among legal heirs"
            ],
            correctAnswer: 1,
            explanation: "If the nominee is under investigation, the insurer may withhold the claim until a court decision is reached.",
            difficulty: "Hard",
            category: "Claims Investigation"
        },
        {
            id: 58,
            question: "A policyholder buys a policy under the Married Women's Property Act (MWPA). Who receives the payout?",
            options: [
                "Only the wife and children",
                "Only the nominee chosen in the policy",
                "The policyholder’s legal heirs",
                "The policyholder’s business creditors"
            ],
            correctAnswer: 0,
            explanation: "Under MWPA, only the wife and children of the insured can claim benefits, protecting them from creditors.",
            difficulty: "Hard",
            category: "Legal Principles"
        },
        {
            id: 59,
            question: "If an employer takes a keyman insurance policy for an employee, who receives the payout in case of the employee’s death?",
            options: [
                "The employee’s nominee",
                "The employer",
                "The employee’s family",
                "The insurer holds the funds"
            ],
            correctAnswer: 1,
            explanation: "Keyman insurance compensates the employer for financial loss caused by the death of a key employee.",
            difficulty: "Hard",
            category: "Keyman Insurance"
        },
        {
            id: 60,
            question: "A policyholder has a whole life insurance policy and takes a loan against it. If they die before repaying the loan, what happens to the payout?",
            options: [
                "The insurer cancels the policy due to the outstanding loan",
                "The full sum assured is paid to the nominee without deductions",
                "Only the loan amount is paid to the nominee",
                "The sum assured is paid after deducting the outstanding loan"
            ],
            correctAnswer: 3,
            explanation: "In case of the policyholder’s death, the insurer deducts the outstanding loan amount before paying the remaining sum assured to the nominee.",
            difficulty: "Hard",
            category: "Policy Loans"
        },
        {
            id: 61,
            question: "A policyholder purchases a 10-year term policy but forgets to disclose a high-risk occupation change in the 6th year. How will the insurer handle the claim?",
            options: [
                "Reject the claim due to non-disclosure",
                "Pay the claim as occupation change disclosure is not mandatory",
                "Reduce the claim amount based on risk assessment",
                "Adjust premiums retrospectively and pay the full claim"
            ],
            correctAnswer: 1,
            explanation: "Most term policies do not require post-purchase disclosure of occupational changes unless specifically mentioned in the policy terms.",
            difficulty: "Hard",
            category: "Underwriting & Risk Assessment"
        },
        {
            id: 62,
            question: "A life insurance policy includes a suicide clause with a 2-year waiting period. If the policyholder dies by suicide after 18 months, what happens?",
            options: [
                "The full sum assured is paid",
                "Only premiums paid are refunded",
                "The claim is rejected entirely",
                "The nominee must wait until 2 years to claim"
            ],
            correctAnswer: 1,
            explanation: "If suicide occurs within the waiting period, only the total premiums paid are refunded without additional benefits.",
            difficulty: "Hard",
            category: "Policy Exclusions"
        },
        {
            id: 63,
            question: "An insured person names their spouse as a nominee but later divorces without updating the policy. Upon death, who receives the payout?",
            options: [
                "The ex-spouse as originally nominated",
                "The legal heirs of the deceased",
                "The insurer holds the funds until a legal claim is resolved",
                "The policy becomes void"
            ],
            correctAnswer: 0,
            explanation: "Unless the nomination is legally changed, the originally nominated person (spouse) remains entitled to receive the payout.",
            difficulty: "Hard",
            category: "Nomination & Legal Issues"
        },
        {
            id: 64,
            question: "A policyholder with a limited pay policy stops paying premiums after completing required payments. What happens to the policy?",
            options: [
                "The policy lapses immediately",
                "The policy remains active for the full term",
                "The policy converts to a term plan with reduced benefits",
                "The nominee must pay premiums upon the policyholder's death"
            ],
            correctAnswer: 1,
            explanation: "A limited pay policy requires premiums for a set period, but coverage remains for the full policy term.",
            difficulty: "Hard",
            category: "Policy Payment Structures"
        },
        {
            id: 65,
            question: "A person buys a joint life insurance policy with their spouse. If one spouse dies, what happens?",
            options: [
                "The policy continues with reduced benefits",
                "The full sum assured is paid, and the policy terminates",
                "The surviving spouse must continue paying premiums",
                "The claim is rejected if premiums were not paid by both spouses"
            ],
            correctAnswer: 1,
            explanation: "In a joint life policy, the sum assured is paid upon the first death, after which the policy terminates.",
            difficulty: "Hard",
            category: "Joint Life Policies"
        },
        {
            id: 66,
            question: "A policyholder takes a life insurance policy under the Married Women's Property Act (MWPA). What impact does this have?",
            options: [
                "Policy proceeds go directly to legal heirs",
                "Creditors can claim the policy proceeds",
                "Policy benefits are secured exclusively for wife and children",
                "Nominee selection can be changed at any time"
            ],
            correctAnswer: 2,
            explanation: "Under MWPA, only the wife and children have rights over policy proceeds, preventing claims by creditors or legal heirs.",
            difficulty: "Hard",
            category: "Legal Protections"
        },
        {
            id: 67,
            question: "A person with a life insurance policy moves abroad permanently without informing the insurer. What happens to their policy?",
            options: [
                "The policy becomes void immediately",
                "The policy continues with the same benefits",
                "The nominee must prove the insured’s residency before claiming",
                "Premiums increase automatically for international coverage"
            ],
            correctAnswer: 1,
            explanation: "Unless specified otherwise, most life insurance policies remain valid even if the policyholder relocates permanently.",
            difficulty: "Hard",
            category: "Policy Validity & Residency"
        },
        {
            id: 68,
            question: "An insured individual buys a money-back policy but dies before receiving any survival benefits. What happens?",
            options: [
                "Survival benefits are forfeited",
                "The nominee receives only premiums paid",
                "The nominee receives full sum assured plus pending survival benefits",
                "The insurer pays a reduced sum due to non-receipt of survival benefits"
            ],
            correctAnswer: 2,
            explanation: "Money-back policies ensure that if the insured dies, the nominee receives the full sum assured, including any pending survival benefits.",
            difficulty: "Hard",
            category: "Money-Back Policies"
        },
        {
            id: 69,
            question: "A policyholder with a ULIP policy stops paying premiums after 3 years. What will happen to the policy?",
            options: [
                "The policy lapses immediately",
                "The fund value continues to be invested",
                "The policy converts into a whole life plan",
                "All previous premiums are refunded"
            ],
            correctAnswer: 1,
            explanation: "In a ULIP, after the lock-in period, the policy continues using the accumulated fund value, even if premiums stop.",
            difficulty: "Hard",
            category: "ULIP Policies"
        },
        {
            id: 70,
            question: "A policyholder names a minor as a nominee but dies before the child reaches adulthood. How is the claim handled?",
            options: [
                "The claim is held until the nominee turns 18",
                "The insurer pays to a legal guardian",
                "The insurer decides the beneficiary",
                "The policy terminates without payout"
            ],
            correctAnswer: 1,
            explanation: "If a minor is a nominee, a legal guardian must be appointed to receive the claim on their behalf.",
            difficulty: "Hard",
            category: "Nomination Rules"
        },
        {
            id: 71,
            question: "A person with a participating policy dies just before an annual bonus declaration. Will the nominee receive the bonus?",
            options: [
                "Yes, as long as the policy was active",
                "No, as bonuses are only declared at maturity",
                "Only partial bonus is paid",
                "Bonus is given only if premiums were paid for 10+ years"
            ],
            correctAnswer: 0,
            explanation: "If a policyholder dies before the next bonus declaration, accrued bonuses are still included in the claim payout.",
            difficulty: "Hard",
            category: "Participating Policies"
        },
        {
            id: 72,
            question: "If a person with a life insurance policy dies due to an excluded activity (e.g., extreme sports), what happens?",
            options: [
                "The claim is fully paid",
                "The claim is rejected",
                "Only premiums paid are refunded",
                "A reduced amount is paid"
            ],
            correctAnswer: 1,
            explanation: "If death occurs due to an excluded activity, the insurer has the right to reject the claim.",
            difficulty: "Hard",
            category: "Policy Exclusions"
        },
        {
            id: 73,
            question: "If a policyholder with a terminal illness converts their policy into an annuity, what happens?",
            options: [
                "The nominee receives a lump sum upon death",
                "The policyholder receives periodic payouts",
                "The policy is canceled with no benefits",
                "The insurer delays payouts until death"
            ],
            correctAnswer: 1,
            explanation: "An annuity converts the policy into periodic payouts rather than a lump sum, benefitting the policyholder until death.",
            difficulty: "Hard",
            category: "Annuities & Conversions"
        },
        {
            id: 74,
            question: "A policyholder with a term life insurance policy forgets to pay the premium within the grace period. What happens to the policy?",
            options: [
                "The policy continues as long as premiums are paid later",
                "The policy lapses immediately with no reinstatement option",
                "The policy lapses but can be reinstated with evidence of insurability",
                "Only a reduced benefit will be payable in case of death"
            ],
            correctAnswer: 2,
            explanation: "If a term policy lapses, it can often be reinstated within a certain period if the insured provides proof of insurability and pays overdue premiums.",
            difficulty: "Hard",
            category: "Policy Lapse & Reinstatement"
        },
        {
            id: 75,
            question: "A life insurance policyholder is diagnosed with a terminal illness and has an accelerated death benefit rider. What happens next?",
            options: [
                "The full sum assured is immediately paid to the policyholder",
                "A partial advance payment is made, and the rest is given to the nominee upon death",
                "The nominee can claim only after the insured dies",
                "The claim is rejected as riders do not apply to terminal illnesses"
            ],
            correctAnswer: 1,
            explanation: "An accelerated death benefit rider allows the insured to receive a portion of the death benefit while still alive, with the remaining amount paid to the nominee after death.",
            difficulty: "Hard",
            category: "Riders & Benefits"
        },
        {
            id: 76,
            question: "A policyholder with a participating life insurance policy has chosen a reduced paid-up option instead of surrendering. What happens?",
            options: [
                "The policy terminates immediately",
                "The policy continues with a reduced sum assured",
                "The policyholder must continue paying premiums at a reduced rate",
                "The nominee will not receive any benefit upon death"
            ],
            correctAnswer: 1,
            explanation: "Under the reduced paid-up option, the policy remains in force, but with a lower sum assured and no further premium payments required.",
            difficulty: "Hard",
            category: "Non-Forfeiture Options"
        },
        {
            id: 77,
            question: "A policyholder has a life insurance policy with a waiver of premium rider and becomes permanently disabled. What happens to future premiums?",
            options: [
                "The policyholder must continue paying premiums",
                "The policy lapses unless a lump sum is paid",
                "Future premiums are waived, but the policy remains in force",
                "Only half of the premium is waived"
            ],
            correctAnswer: 2,
            explanation: "A waiver of premium rider ensures that if the policyholder becomes disabled, future premiums are waived while keeping the policy active.",
            difficulty: "Hard",
            category: "Policy Riders"
        },
        {
            id: 78,
            question: "A policyholder has a claim pending due to a missing medical test report. What action should the insurer take?",
            options: [
                "Reject the claim immediately",
                "Wait indefinitely for the report",
                "Request additional proof or alternative documentation",
                "Reduce the claim amount and approve it"
            ],
            correctAnswer: 2,
            explanation: "Insurers must request additional proof or alternative documentation before making a final decision, ensuring fair claim processing.",
            difficulty: "Hard",
            category: "Claims Processing"
        },
        {
            id: 79,
            question: "A policyholder takes out two life insurance policies with different insurers but does not disclose the first policy to the second insurer. What happens in case of death?",
            options: [
                "The second insurer may reject the claim for non-disclosure",
                "Both insurers will pay the full sum assured",
                "Only the first insurer will settle the claim",
                "The nominee must choose one insurer for the claim"
            ],
            correctAnswer: 0,
            explanation: "Failure to disclose existing policies can be considered material non-disclosure, leading to possible claim rejection by the second insurer.",
            difficulty: "Hard",
            category: "Non-Disclosure Risks"
        },
        {
            id: 80,
            question: "A life insurance nominee is found guilty of murdering the policyholder. What happens to the claim?",
            options: [
                "The nominee still receives the payout",
                "The claim is transferred to the insurer",
                "The claim goes to the legal heirs instead",
                "The policy is canceled with no payout"
            ],
            correctAnswer: 2,
            explanation: "Under the 'Slayer Rule,' a person convicted of murdering the insured cannot benefit from the insurance claim, and it is transferred to the legal heirs.",
            difficulty: "Hard",
            category: "Legal Considerations"
        },
        {
            id: 81,
            question: "A policyholder surrenders their life insurance policy before maturity. What will they receive?",
            options: [
                "The full sum assured",
                "Only a percentage of the premiums paid",
                "The guaranteed surrender value or special surrender value, whichever is higher",
                "No amount is payable"
            ],
            correctAnswer: 2,
            explanation: "When a policy is surrendered, the insured receives either the guaranteed surrender value or the special surrender value, whichever is higher.",
            difficulty: "Hard",
            category: "Surrender of Policy"
        },
        {
            id: 82,
            question: "A policyholder buys a life insurance policy under the Married Women’s Property Act. Who can claim the benefits?",
            options: [
                "The insured person",
                "The nominee only",
                "Only the wife and children",
                "The creditors of the insured"
            ],
            correctAnswer: 2,
            explanation: "Under MWPA, policy benefits are secured exclusively for the wife and children and cannot be claimed by creditors.",
            difficulty: "Hard",
            category: "Legal & Ownership Rights"
        },
        {
            id: 83,
            question: "A policyholder assigns their life insurance policy to a bank as collateral for a loan. What happens if the insured dies before repaying the loan?",
            options: [
                "The bank receives the full sum assured",
                "The bank gets the loan amount, and the nominee receives the remaining amount",
                "The nominee receives the full claim amount",
                "The policy becomes void"
            ],
            correctAnswer: 1,
            explanation: "In a collateral assignment, the bank gets the loan amount first, and the remaining balance is paid to the nominee.",
            difficulty: "Hard",
            category: "Policy Assignment"
        },
        {
            id: 84,
            question: "A policyholder selects a decreasing term policy. What happens to the sum assured over time?",
            options: [
                "It remains constant",
                "It increases annually",
                "It decreases gradually",
                "The insurer decides the payout"
            ],
            correctAnswer: 2,
            explanation: "In a decreasing term policy, the sum assured reduces over time, usually aligning with loan repayment schedules.",
            difficulty: "Hard",
            category: "Term Insurance Variants"
        },
        {
            id: 85,
            question: "A policyholder misses two premium payments but pays a third one on time. What happens to the policy?",
            options: [
                "The policy is reinstated automatically",
                "Only partial benefits are available",
                "The policy remains lapsed",
                "The insurer adjusts the premium and continues coverage"
            ],
            correctAnswer: 2,
            explanation: "If multiple premiums are missed, paying a single premium later does not reinstate the policy unless all past dues are cleared.",
            difficulty: "Hard",
            category: "Policy Lapse & Reinstatement"
        },
        {
            id: 86,
            question: "A policyholder adds an accidental death rider to their policy. Under which scenario will this rider NOT apply?",
            options: [
                "Death due to a car accident",
                "Death due to a pre-existing illness",
                "Death due to falling from a height",
                "Death in an airplane crash"
            ],
            correctAnswer: 1,
            explanation: "Accidental death riders do not cover deaths caused by illnesses or natural causes.",
            difficulty: "Hard",
            category: "Accidental Death Benefits"
        },
        {
            id: 87,
            question: "A life insurance policyholder dies in a foreign country. What should the nominee do?",
            options: [
                "Submit the death certificate issued by the foreign country",
                "Wait for the insurer to verify the claim",
                "Repatriate the body before filing a claim",
                "File the claim only after 6 months"
            ],
            correctAnswer: 0,
            explanation: "A foreign-issued death certificate is generally accepted by insurers for claim processing.",
            difficulty: "Hard",
            category: "International Policy Coverage"
        },
        {
            id: 88,
            question: "A policyholder has a whole life insurance policy with a loan against it. If the policyholder dies before repaying the loan, what happens?",
            options: [
                "The nominee receives the full sum assured",
                "The insurer deducts the outstanding loan amount before paying the nominee",
                "The claim is rejected due to unpaid debt",
                "The policy terminates with no payout"
            ],
            correctAnswer: 1,
            explanation: "In case of death, the insurer deducts the outstanding loan amount from the sum assured before making the final payout to the nominee.",
            difficulty: "Hard",
            category: "Policy Loans & Claims"
        },
        {
            id: 89,
            question: "A policyholder names a minor child as the nominee. What happens if the insured dies while the nominee is still a minor?",
            options: [
                "The claim is held until the nominee turns 18",
                "The insurer pays the amount to the legal guardian or a court-appointed trustee",
                "The claim is rejected due to the nominee's age",
                "The insurer distributes the amount among all legal heirs"
            ],
            correctAnswer: 1,
            explanation: "If the nominee is a minor, the insurer pays the claim amount to the legal guardian or a trustee appointed by the court.",
            difficulty: "Hard",
            category: "Nomination & Legal Aspects"
        },
        {
            id: 90,
            question: "A policyholder has two life insurance policies—one with a private insurer and another with a government insurer. What happens if they commit suicide within one year of purchasing both policies?",
            options: [
                "Both insurers reject the claim",
                "Only the private insurer rejects the claim",
                "The government insurer pays full benefits",
                "Both insurers may pay only the premiums paid, excluding risk cover"
            ],
            correctAnswer: 3,
            explanation: "Most policies have a suicide exclusion clause for the first year, allowing insurers to refund only the premiums paid rather than the full sum assured.",
            difficulty: "Hard",
            category: "Exclusions & Claims"
        },
        {
            id: 91,
            question: "A policyholder has a joint life insurance policy with their spouse. If one of them dies, what happens?",
            options: [
                "The policy terminates immediately",
                "The surviving partner continues to be covered",
                "The entire sum assured is paid immediately, and the policy terminates",
                "The nominee must continue paying premiums"
            ],
            correctAnswer: 1,
            explanation: "In a joint life policy, the surviving policyholder remains covered unless it's a 'first death payout' plan where the policy terminates after the first death.",
            difficulty: "Hard",
            category: "Joint Life Policies"
        },
        {
            id: 92,
            question: "A person purchases a term insurance policy with a return of premium option. What happens if they survive the policy term?",
            options: [
                "No amount is paid since it is term insurance",
                "Only a percentage of premiums is returned",
                "The full premium paid (excluding taxes) is refunded",
                "The full sum assured is paid"
            ],
            correctAnswer: 2,
            explanation: "Under a return of premium term plan, the policyholder receives back the total premiums paid (excluding taxes) if they survive the policy term.",
            difficulty: "Hard",
            category: "Term Insurance Variants"
        },
        {
            id: 93,
            question: "A policyholder assigns their life insurance policy to a bank for a loan and later changes the nominee. Who receives the claim amount upon death?",
            options: [
                "The new nominee",
                "The bank first, then the remaining amount to the nominee",
                "The old nominee",
                "The claim is rejected due to conflicting assignments"
            ],
            correctAnswer: 1,
            explanation: "When a policy is assigned to a bank, the bank is first entitled to recover the outstanding loan amount before the nominee receives any remaining funds.",
            difficulty: "Hard",
            category: "Policy Assignment & Nomination"
        },
        {
            id: 94,
            question: "A policyholder’s premium payment frequency is annual, but they switch to monthly payments. How does this affect their policy?",
            options: [
                "The sum assured increases",
                "The premium amount increases due to loading charges",
                "The premium amount decreases",
                "The policy term is reduced"
            ],
            correctAnswer: 1,
            explanation: "When switching from annual to monthly premium payments, insurers usually add a loading charge, making the total payable amount higher.",
            difficulty: "Hard",
            category: "Premium Payment Structure"
        },
        {
            id: 95,
            question: "A policyholder's nominee dies before the insured. What happens if no new nominee is appointed?",
            options: [
                "The insurer keeps the claim amount",
                "The policy lapses",
                "The claim amount goes to the legal heirs",
                "The sum assured reduces"
            ],
            correctAnswer: 2,
            explanation: "If no nominee is appointed after the nominee's death, the claim amount is distributed among the legal heirs of the insured.",
            difficulty: "Hard",
            category: "Nomination & Legal Heirs"
        },
        {
            id: 96,
            question: "An insured person with a critical illness rider is diagnosed with a covered illness but does not notify the insurer for three years. What happens?",
            options: [
                "The claim is still paid in full",
                "The claim is rejected due to delayed intimation",
                "Only a partial claim amount is paid",
                "The policy terminates immediately"
            ],
            correctAnswer: 1,
            explanation: "Most policies require timely intimation of critical illness claims. A delayed notification may lead to rejection based on policy terms.",
            difficulty: "Hard",
            category: "Critical Illness Riders & Claims"
        },
        {
            id: 97,
            question: "A policyholder buys a ULIP but stops paying premiums after three years. What happens to the policy?",
            options: [
                "The policy terminates immediately",
                "The insurer deducts charges and keeps the fund value intact",
                "The insurer refunds only the premiums paid",
                "The policy converts into a paid-up policy with no further charges"
            ],
            correctAnswer: 1,
            explanation: "ULIPs typically have a discontinuance fund where the insurer deducts charges while keeping the remaining fund value intact.",
            difficulty: "Hard",
            category: "ULIP Policy Rules"
        },
        {
            id: 98,
            question: "A policyholder takes a life insurance policy but fails to disclose their smoking habit. What happens if they die due to a smoking-related illness?",
            options: [
                "The claim is fully paid",
                "The claim is partially paid",
                "The claim is rejected due to non-disclosure",
                "The insurer adjusts the sum assured"
            ],
            correctAnswer: 2,
            explanation: "Non-disclosure of smoking habits is considered material misrepresentation, leading to potential claim rejection.",
            difficulty: "Hard",
            category: "Material Disclosure & Claim Rejection"
        },
        {
            id: 99,
            question: "A policyholder with a pension plan dies before retirement. What happens to the corpus?",
            options: [
                "The full amount is paid to the nominee",
                "The nominee must purchase an annuity",
                "The corpus is forfeited",
                "Only a portion is paid to the nominee"
            ],
            correctAnswer: 1,
            explanation: "Most pension plans require the nominee to purchase an annuity with the accumulated corpus instead of receiving a lump sum payout.",
            difficulty: "Hard",
            category: "Pension & Retirement Policies"
        },
        {
            id: 100,
            question: "A policyholder with a term policy dies in an earthquake. The insurer’s policy document does not mention natural disasters. What happens?",
            options: [
                "The claim is paid",
                "The claim is rejected",
                "The insurer investigates before deciding",
                "Only partial benefits are paid"
            ],
            correctAnswer: 0,
            explanation: "Term insurance policies generally cover all causes of death unless explicitly excluded. Since natural disasters are not excluded, the claim is valid.",
            difficulty: "Hard",
            category: "Natural Disaster Coverage"
        },
        {
            id: 101,
            question: "A policyholder has a convertible term insurance policy but does not convert it before the deadline. What happens?",
            options: [
                "The policy auto-converts to whole life",
                "The policy continues as term insurance",
                "The policy lapses",
                "The insured receives a refund"
            ],
            correctAnswer: 1,
            explanation: "If the insured does not opt for conversion, the policy continues as term insurance with no changes.",
            difficulty: "Hard",
            category: "Convertible Insurance Policies"
        },
        {
            id: 102,
            question: "A policyholder has nominated their spouse in a life insurance policy. Later, they divorce but do not update the nominee. What happens upon the policyholder’s death?",
            options: [
                "The ex-spouse receives the claim amount as nominee",
                "The insurer rejects the claim due to divorce",
                "The claim amount is paid to legal heirs",
                "The insurer decides based on the policy document"
            ],
            correctAnswer: 0,
            explanation: "Nomination does not automatically change due to divorce. Unless modified, the ex-spouse remains the nominee and receives the claim amount.",
            difficulty: "Medium",
            category: "Nomination & Legal Aspects"
        },
        {
            id: 103,
            question: "A life insurance policyholder forgets to pay the premium and dies during the grace period. What will the insurer do?",
            options: [
                "Reject the claim as the premium was unpaid",
                "Deduct the unpaid premium and pay the remaining sum assured",
                "Pay the full sum assured without deduction",
                "Convert the policy into a paid-up policy and reduce the claim amount"
            ],
            correctAnswer: 1,
            explanation: "If the policyholder dies during the grace period, the insurer deducts the unpaid premium before paying the sum assured.",
            difficulty: "Medium",
            category: "Grace Period & Policy Validity"
        },
        {
            id: 104,
            question: "A person buys a term insurance policy and dies due to a previously undisclosed pre-existing disease within two years. What happens?",
            options: [
                "The insurer pays the full sum assured",
                "The claim is rejected due to non-disclosure",
                "The insurer refunds the premiums paid",
                "The insurer pays a partial amount"
            ],
            correctAnswer: 1,
            explanation: "Non-disclosure of material information, such as pre-existing diseases, can lead to claim rejection as per the principle of utmost good faith.",
            difficulty: "Medium",
            category: "Underwriting & Non-disclosure"
        },
        {
            id: 105,
            question: "A policyholder has two life insurance policies. Can they claim benefits from both in case of death?",
            options: [
                "Yes, both insurers will pay separately",
                "No, only the policy with the higher sum assured pays",
                "Yes, but the insurers will split the payout",
                "No, one policy will automatically lapse"
            ],
            correctAnswer: 0,
            explanation: "Unlike general insurance, life insurance does not follow the indemnity principle. The nominee can claim from all valid policies.",
            difficulty: "Medium",
            category: "Multiple Policies & Claims"
        },
        {
            id: 106,
            question: "A policyholder converts their term insurance policy into a whole life policy. How does this affect the premium?",
            options: [
                "Premium remains unchanged",
                "Premium decreases as coverage increases",
                "Premium increases as risk coverage extends for life",
                "Premium is refunded as a whole life policy does not require regular payments"
            ],
            correctAnswer: 2,
            explanation: "Whole life policies cover the insured for their entire life, leading to higher premiums compared to term plans.",
            difficulty: "Medium",
            category: "Convertible Insurance Policies"
        },
        {
            id: 107,
            question: "A life insurance policyholder dies during an active contestability period. How does this affect the claim?",
            options: [
                "The insurer can investigate and deny claims if fraud is found",
                "The insurer must pay the full claim immediately",
                "The nominee gets only the premiums paid",
                "The claim is delayed for five years"
            ],
            correctAnswer: 0,
            explanation: "During the contestability period (usually 2 years), the insurer has the right to investigate and reject claims if material misrepresentation is found.",
            difficulty: "Medium",
            category: "Contestability Clause & Fraud Prevention"
        },
        {
            id: 108,
            question: "A policyholder with a participating life insurance policy receives an annual bonus. What happens if they choose not to withdraw it?",
            options: [
                "The bonus lapses",
                "The bonus is added to the sum assured",
                "The bonus reduces future premiums",
                "The insurer deducts the bonus from maturity benefits"
            ],
            correctAnswer: 1,
            explanation: "In participating policies, bonuses accumulate and are added to the sum assured, increasing the final payout.",
            difficulty: "Medium",
            category: "Participating Policies & Bonuses"
        },
        {
            id: 109,
            question: "A policyholder pays their premiums on time but fails to inform their nominee about the policy. What happens if they die?",
            options: [
                "The claim is denied as the nominee was unaware",
                "The insurer finds and informs the nominee",
                "The insurer holds the funds until a claim is made",
                "The policy terminates automatically"
            ],
            correctAnswer: 2,
            explanation: "Insurers do not actively search for claimants. If no claim is made, the funds remain unclaimed until the nominee comes forward.",
            difficulty: "Medium",
            category: "Nominee Awareness & Claims"
        },
        {
            id: 110,
            question: "A policyholder takes a unit-linked insurance plan (ULIP). How does market fluctuation affect their maturity benefits?",
            options: [
                "Maturity benefits remain fixed",
                "Maturity benefits increase only if markets rise",
                "Maturity benefits may increase or decrease based on fund performance",
                "Maturity benefits are reduced by fixed charges only"
            ],
            correctAnswer: 2,
            explanation: "ULIP benefits are linked to market performance, meaning they can rise or fall depending on fund investments.",
            difficulty: "Medium",
            category: "ULIP & Market Risks"
        },
        {
            id: 111,
            question: "A policyholder with a guaranteed return plan surrenders their policy early. What happens?",
            options: [
                "They receive the full guaranteed amount",
                "They receive the surrender value, which may be lower than the guaranteed return",
                "They get a refund of all premiums paid",
                "The policy terminates without payout"
            ],
            correctAnswer: 1,
            explanation: "Early surrender leads to payout of surrender value, which is typically lower than the guaranteed maturity benefit.",
            difficulty: "Medium",
            category: "Surrender & Policy Value"
        },
        {
            id: 112,
            question: "A person with a life insurance policy moves to a high-risk occupation without informing the insurer. What happens upon their death?",
            options: [
                "The insurer pays the full claim amount",
                "The insurer rejects the claim for non-disclosure",
                "The nominee receives only the paid premiums",
                "The insurer deducts an additional risk charge before payout"
            ],
            correctAnswer: 1,
            explanation: "If the policyholder fails to disclose an occupation change that increases risk, the insurer may reject the claim due to non-disclosure.",
            difficulty: "Medium",
            category: "Risk Disclosure & Underwriting"
        },
        {
            id: 113,
            question: "A policyholder opts for an accidental death benefit rider. What happens if they die due to a heart attack?",
            options: [
                "The nominee gets both the sum assured and the rider benefit",
                "Only the sum assured is paid",
                "Only the rider benefit is paid",
                "The claim is denied"
            ],
            correctAnswer: 1,
            explanation: "Accidental death benefit riders pay extra only if the death is caused by an accident, not natural causes like a heart attack.",
            difficulty: "Medium",
            category: "Rider Benefits & Exclusions"
        },
        {
            id: 114,
            question: "A policyholder makes a partial withdrawal from their endowment policy. What happens to the sum assured?",
            options: [
                "It remains the same",
                "It reduces based on withdrawal",
                "It increases due to policy modification",
                "The policy terminates"
            ],
            correctAnswer: 1,
            explanation: "Partial withdrawals in endowment policies generally reduce the sum assured or maturity benefit proportionally.",
            difficulty: "Medium",
            category: "Endowment Policies & Withdrawals"
        },
        {
            id: 115,
            question: "A policyholder’s term plan has a waiver of premium rider. What happens if they become permanently disabled?",
            options: [
                "Premiums are waived, but coverage continues",
                "Policy terminates immediately",
                "The insurer pays a lump sum instead",
                "The premium waiver applies only for five years"
            ],
            correctAnswer: 0,
            explanation: "A waiver of premium rider ensures the policy remains active without requiring further premium payments in case of disability.",
            difficulty: "Medium",
            category: "Waiver of Premium Rider"
        },
        {
            id: 116,
            question: "A policyholder takes a loan against their life insurance policy and later dies. What happens to the claim amount?",
            options: [
                "The full sum assured is paid to the nominee",
                "The loan amount is deducted, and the remaining sum is paid",
                "The loan is written off, and the nominee gets full benefits",
                "The insurer cancels the policy and pays nothing"
            ],
            correctAnswer: 1,
            explanation: "When a policyholder has an outstanding loan, the insurer deducts the loan amount before paying the sum assured to the nominee.",
            difficulty: "Medium",
            category: "Policy Loans & Claims"
        },
        {
            id: 117,
            question: "A person buys an insurance policy, but the insurer finds that the insured's age was misrepresented. What happens to the policy?",
            options: [
                "The policy is canceled immediately",
                "The premium or benefits are adjusted based on the correct age",
                "The insurer pays only 50% of the sum assured",
                "The insurer refunds the premium and terminates the policy"
            ],
            correctAnswer: 1,
            explanation: "Age misstatement results in an adjustment of premiums or benefits to reflect the correct age, rather than outright policy cancellation.",
            difficulty: "Medium",
            category: "Misrepresentation & Adjustments"
        },
        {
            id: 118,
            question: "A policyholder with a whole life policy wants to stop paying premiums after 10 years. What option do they have?",
            options: [
                "Surrender the policy for cash value",
                "Continue the policy without any changes",
                "Increase the sum assured",
                "Convert it into a term plan"
            ],
            correctAnswer: 0,
            explanation: "If a policyholder stops paying premiums, they can surrender the policy and receive its accumulated cash value.",
            difficulty: "Medium",
            category: "Surrender & Cash Value"
        },
        {
            id: 119,
            question: "A policyholder has a term plan with a return of premium feature. What happens if they survive the policy term?",
            options: [
                "They receive all premiums paid, excluding GST",
                "They receive the sum assured",
                "They receive only a percentage of the premiums",
                "No payout is made"
            ],
            correctAnswer: 0,
            explanation: "In return of premium term plans, the insured receives back all premiums paid at the end of the term if no claim is made.",
            difficulty: "Medium",
            category: "Term Insurance Variants"
        },
        {
            id: 120,
            question: "A person has an annuity policy and passes away before receiving any annuity payments. What happens next?",
            options: [
                "The insurer keeps all the money",
                "The nominee gets the entire fund value",
                "The annuity payments continue to the nominee",
                "It depends on the annuity type chosen"
            ],
            correctAnswer: 3,
            explanation: "The payout depends on the annuity type—some provide death benefits, while others do not.",
            difficulty: "Medium",
            category: "Annuities & Death Benefits"
        },
        {
            id: 121,
            question: "A policyholder with a unit-linked plan switches from an equity fund to a debt fund. What impact does this have?",
            options: [
                "Higher returns and increased risk",
                "Lower returns but more stability",
                "Immediate bonus addition",
                "Reduction in policy tenure"
            ],
            correctAnswer: 1,
            explanation: "Switching to a debt fund reduces risk but also lowers potential returns compared to equity funds.",
            difficulty: "Medium",
            category: "ULIPs & Fund Switching"
        },
        {
            id: 122,
            question: "A person with an active life insurance policy starts smoking but does not inform the insurer. What could happen?",
            options: [
                "Nothing, as they already have a policy",
                "Premium increases automatically",
                "The claim may be denied for non-disclosure",
                "They can claim extra benefits"
            ],
            correctAnswer: 2,
            explanation: "Non-disclosure of smoking is considered material misrepresentation and can lead to claim rejection.",
            difficulty: "Medium",
            category: "Non-disclosure & Claim Risks"
        },
        {
            id: 123,
            question: "A policyholder forgets to renew their endowment policy but later decides to revive it. What must they do?",
            options: [
                "Pay the missed premiums with interest",
                "Purchase a new policy",
                "Wait for automatic policy renewal",
                "Convert it into a term policy"
            ],
            correctAnswer: 0,
            explanation: "Lapsed policies can be revived by paying missed premiums with interest, usually within a specified period.",
            difficulty: "Medium",
            category: "Policy Revival & Lapse"
        },
        {
            id: 124,
            question: "A policyholder buys a joint-life policy with their spouse. Who receives the payout upon the first death?",
            options: [
                "The surviving spouse",
                "The insurer",
                "Both receive 50% each",
                "The policy is canceled"
            ],
            correctAnswer: 0,
            explanation: "In a joint-life policy, the first death triggers the sum assured payout to the surviving spouse.",
            difficulty: "Medium",
            category: "Joint Life Policies"
        },
        {
            id: 125,
            question: "A person has an insurance policy with a waiting period for critical illness benefits. They get diagnosed during this period. What happens?",
            options: [
                "The claim is accepted fully",
                "The claim is rejected",
                "Only 50% of the claim is paid",
                "Future premiums are waived"
            ],
            correctAnswer: 1,
            explanation: "Claims filed within the waiting period are not honored, as the insurer requires a minimum time before benefits apply.",
            difficulty: "Medium",
            category: "Waiting Periods in Policies"
        },
        {
            id: 126,
            question: "A person takes an accidental death rider but dies due to a disease. What happens?",
            options: [
                "The nominee gets the rider benefit",
                "Only the base policy pays out",
                "The claim is rejected entirely",
                "The insurer pays a partial benefit"
            ],
            correctAnswer: 1,
            explanation: "Accidental death riders apply only if death is caused by an accident, not by illness or natural causes.",
            difficulty: "Medium",
            category: "Rider Exclusions"
        },
        {
            id: 127,
            question: "A policyholder dies by suicide within one year of purchasing the policy. What will the insurer do?",
            options: [
                "Pay full sum assured",
                "Reject the claim",
                "Refund only the premiums paid",
                "Pay a reduced amount"
            ],
            correctAnswer: 2,
            explanation: "If suicide occurs within the first year, only the premiums are refunded, as per policy terms.",
            difficulty: "Medium",
            category: "Suicide Clause"
        },
        {
            id: 128,
            question: "A policyholder assigns their policy to a bank for a loan. Who receives the claim payout upon their death?",
            options: [
                "The bank",
                "The nominee",
                "The insurer",
                "The policyholder's employer"
            ],
            correctAnswer: 0,
            explanation: "When a policy is assigned to a lender, the bank receives the payout first to recover the loan amount.",
            difficulty: "Medium",
            category: "Policy Assignment"
        },
        {
            id: 129,
            question: "A person takes a term plan with increasing cover benefits. What happens over time?",
            options: [
                "The sum assured remains fixed",
                "The sum assured increases as per policy terms",
                "The premiums decrease",
                "The policy matures early"
            ],
            correctAnswer: 1,
            explanation: "An increasing cover term plan raises the sum assured over time to adjust for inflation.",
            difficulty: "Medium",
            category: "Increasing Cover Plans"
        },
        {
            id: 130,
            question: "A policyholder takes a limited premium policy. What does this mean?",
            options: [
                "Premiums are paid throughout the policy term",
                "Premiums are paid for a fixed period, but coverage continues",
                "The policy terminates early",
                "The sum assured reduces over time"
            ],
            correctAnswer: 1,
            explanation: "Limited premium policies require payments for a shorter period while maintaining long-term coverage.",
            difficulty: "Medium",
            category: "Limited Pay Policies"
        },
        {
            id: 131,
            question: "A policyholder forgets to pay the premium within the grace period. What is the most likely consequence?",
            options: [
                "The policy continues without interruption",
                "The policy lapses, but can be revived",
                "The insurer pays only half the sum assured",
                "The policy is automatically converted into a paid-up policy"
            ],
            correctAnswer: 1,
            explanation: "If the premium is not paid within the grace period, the policy lapses, but it can usually be revived within a certain period.",
            difficulty: "Medium",
            category: "Policy Lapse & Revival"
        },
        {
            id: 132,
            question: "A person with an endowment policy dies one year before the policy matures. What does the nominee receive?",
            options: [
                "Only the sum assured",
                "Sum assured plus bonus accrued",
                "Only the surrender value",
                "A partial refund of premiums paid"
            ],
            correctAnswer: 1,
            explanation: "In an endowment policy, the nominee receives the sum assured along with any accrued bonuses if the insured dies before maturity.",
            difficulty: "Medium",
            category: "Endowment Policies"
        },
        {
            id: 133,
            question: "A policyholder chooses a participating policy. What does this mean?",
            options: [
                "The policy includes accidental death benefits",
                "The policyholder receives a share of insurer profits",
                "The sum assured increases every year",
                "The policy can be transferred to another insurer"
            ],
            correctAnswer: 1,
            explanation: "A participating policy (with-profits policy) entitles the policyholder to bonuses based on the insurer’s profits.",
            difficulty: "Medium",
            category: "Participating vs. Non-Participating Policies"
        },
        {
            id: 134,
            question: "A policyholder names their minor child as the nominee. What happens if the policyholder dies before the child turns 18?",
            options: [
                "The insurer pays the sum assured directly to the child",
                "The sum assured is held by the insurer until the child turns 18",
                "A court-appointed guardian receives the payout",
                "The nominee is automatically changed to the legal heir"
            ],
            correctAnswer: 2,
            explanation: "If the nominee is a minor, the claim amount is given to the appointed guardian or as per legal proceedings.",
            difficulty: "Medium",
            category: "Nomination & Legal Aspects"
        },
        {
            id: 135,
            question: "A person buys a policy with a waiver of premium rider and is permanently disabled. What happens next?",
            options: [
                "The insurer refunds all previous premiums",
                "Future premiums are waived, but coverage continues",
                "The policy is terminated with a lump sum payout",
                "The premium amount is reduced, but still payable"
            ],
            correctAnswer: 1,
            explanation: "With a waiver of premium rider, the policyholder does not have to pay future premiums, but the policy remains active.",
            difficulty: "Medium",
            category: "Riders & Benefits"
        },
        {
            id: 136,
            question: "A policyholder takes a term plan with critical illness cover and is diagnosed with a covered illness. What happens?",
            options: [
                "They receive a lump sum payout and the policy terminates",
                "They continue paying premiums, but receive no benefits",
                "The sum assured is doubled automatically",
                "They can claim only after death"
            ],
            correctAnswer: 0,
            explanation: "A critical illness rider provides a lump sum payout upon diagnosis, but the base term policy may terminate based on its terms.",
            difficulty: "Medium",
            category: "Critical Illness Riders"
        },
        {
            id: 137,
            question: "A person has an insurance policy with a double accident benefit rider. What happens if they die in an accident?",
            options: [
                "The nominee receives twice the sum assured",
                "The claim is rejected if death occurs after hospitalization",
                "The insurer pays only the base sum assured",
                "The claim is settled only after a 5-year investigation"
            ],
            correctAnswer: 0,
            explanation: "A double accident benefit rider ensures that the nominee receives twice the sum assured if the insured dies due to an accident.",
            difficulty: "Medium",
            category: "Accidental Death Riders"
        },
        {
            id: 138,
            question: "A policyholder selects a decreasing term insurance plan. What happens over time?",
            options: [
                "The sum assured reduces, but premiums remain the same",
                "Both sum assured and premiums decrease",
                "The policy converts into a whole life policy",
                "The premium increases every year"
            ],
            correctAnswer: 0,
            explanation: "In decreasing term insurance, the sum assured reduces over time while the premium remains fixed.",
            difficulty: "Medium",
            category: "Term Insurance Variants"
        },
        {
            id: 139,
            question: "A person buys a life insurance policy but fails to disclose a pre-existing health condition. What is the possible consequence?",
            options: [
                "The policy remains valid without any issues",
                "The insurer increases the premium later",
                "The claim may be denied due to material misrepresentation",
                "The policyholder is required to buy another policy"
            ],
            correctAnswer: 2,
            explanation: "Non-disclosure of material facts can result in claim denial as per the principle of utmost good faith.",
            difficulty: "Medium",
            category: "Non-Disclosure & Claim Denials"
        },
        {
            id: 140,
            question: "A person takes a joint-life policy where the sum assured is paid upon the second death. What type of policy is this?",
            options: [
                "First-to-die policy",
                "Survivorship policy",
                "Convertible term policy",
                "Annuity policy"
            ],
            correctAnswer: 1,
            explanation: "A survivorship policy pays the sum assured only after both insured individuals have passed away.",
            difficulty: "Medium",
            category: "Joint Life Policies"
        },
        {
            id: 141,
            question: "A policyholder takes a participating policy but never receives any bonus. What could be the reason?",
            options: [
                "The insurer made losses in that year",
                "The policyholder didn’t pay extra for bonuses",
                "The bonuses are paid only after policy maturity",
                "Participating policies do not offer bonuses"
            ],
            correctAnswer: 0,
            explanation: "Participating policies offer bonuses based on insurer profits. If the insurer has no profits, no bonuses are declared.",
            difficulty: "Medium",
            category: "Participating Policies & Bonuses"
        },
        {
            id: 142,
            question: "A policyholder chooses a whole life policy with limited pay. What does this mean?",
            options: [
                "Premiums are paid for a limited period, but coverage is lifelong",
                "The policy terminates after the payment period",
                "The sum assured increases over time",
                "Premiums must be paid until age 100"
            ],
            correctAnswer: 0,
            explanation: "In limited pay whole life policies, premiums are paid for a fixed period, but coverage continues for life.",
            difficulty: "Medium",
            category: "Whole Life Policies"
        },
        {
            id: 143,
            question: "A policyholder with a unit-linked policy (ULIP) decides to stop premium payments. What happens?",
            options: [
                "The policy immediately lapses",
                "The fund value remains but charges may apply",
                "The insurer refunds all premiums paid",
                "The policy converts into a traditional endowment plan"
            ],
            correctAnswer: 1,
            explanation: "If ULIP premiums are stopped, the fund value remains, but charges may be deducted until the policy is revived or surrendered.",
            difficulty: "Medium",
            category: "ULIPs & Premium Payments"
        },
        {
            id: 144,
            question: "A policyholder wants to increase their sum assured mid-way through the policy. What should they do?",
            options: [
                "Request a policy upgrade",
                "Buy an additional policy or rider",
                "Stop the existing policy and buy a new one",
                "Increase premium payments directly"
            ],
            correctAnswer: 1,
            explanation: "To increase coverage, a policyholder can purchase a rider or an additional policy, as mid-term changes are usually not allowed.",
            difficulty: "Medium",
            category: "Policy Modifications"
        },
        {
            id: 145,
            question: "A policyholder with a traditional life policy asks for a loan against it. What determines the loan amount?",
            options: [
                "The policy term",
                "The sum assured",
                "The surrender value",
                "The nominee's age"
            ],
            correctAnswer: 2,
            explanation: "Loans against policies are based on the surrender value, not the sum assured or term.",
            difficulty: "Medium",
            category: "Policy Loans"
        },
        {
            id: 146,
            question: "A policyholder has a life insurance policy with an 'Accelerated Death Benefit' rider. They are diagnosed with a terminal illness and given 12 months to live. What happens next?",
            options: [
                "The full sum assured is paid immediately",
                "Only a percentage of the sum assured is advanced, and the policy remains in force",
                "The insurer cancels the policy and refunds premiums paid",
                "The nominee will receive the sum assured only after the policyholder's death"
            ],
            correctAnswer: 1,
            explanation: "The Accelerated Death Benefit rider provides an advance payment of a portion of the sum assured if the insured is diagnosed with a terminal illness.",
            difficulty: "Super Hard",
            category: "Riders & Special Benefits"
        },
        {
            id: 147,
            question: "A policyholder opts for a 'Return of Premium' term insurance policy. They survive the policy tenure. What do they receive?",
            options: [
                "Only the premiums paid, without interest",
                "The sum assured along with bonuses",
                "Nothing, as the policy provides coverage only in case of death",
                "A percentage of the sum assured based on tenure completed"
            ],
            correctAnswer: 0,
            explanation: "A 'Return of Premium' term plan refunds the total premiums paid if the policyholder survives the term.",
            difficulty: "Super Hard",
            category: "Term Insurance Variants"
        },
        {
            id: 148,
            question: "An individual has two life insurance policies with different insurers. They die in an accident. What will happen?",
            options: [
                "Only one insurer will pay the claim",
                "Both insurers will pay their respective sums assured",
                "The claim will be shared proportionally between the two insurers",
                "The nominee must choose which insurer to claim from"
            ],
            correctAnswer: 1,
            explanation: "Unlike general insurance, life insurance does not follow the principle of indemnity, so both policies pay the sum assured separately.",
            difficulty: "Super Hard",
            category: "Multiple Insurance Policies"
        },
        {
            id: 149,
            question: "A policyholder takes a life insurance policy but commits suicide in the second year of the policy. What will the insurer do?",
            options: [
                "Reject the claim outright",
                "Pay the full sum assured",
                "Refund the premiums paid, after deducting expenses",
                "Pay the claim only if the nominee proves no foul play"
            ],
            correctAnswer: 2,
            explanation: "Most life insurance policies have a suicide clause stating that if suicide occurs after the first policy year, only premiums paid (excluding expenses) are refunded.",
            difficulty: "Super Hard",
            category: "Policy Exclusions & Suicide Clause"
        },
        {
            id: 150,
            question: "A policyholder has a participating whole life policy and decides to surrender it after 10 years. What is the most likely outcome?",
            options: [
                "They receive the full sum assured along with bonuses",
                "They receive the surrender value, which includes a portion of bonuses",
                "They get back only the premiums paid without bonuses",
                "The policy cannot be surrendered, as it is a whole life policy"
            ],
            correctAnswer: 1,
            explanation: "Surrendering a participating policy results in a payout based on the surrender value, which includes a portion of accrued bonuses.",
            difficulty: "Super Hard",
            category: "Surrender & Paid-Up Policies"
        },
        {
            id: 151,
            question: "A life insurance policyholder dies, and the insurer suspects foul play by the nominee. What can the insurer legally do?",
            options: [
                "Refuse to pay the claim and cancel the policy",
                "Conduct an investigation before settling the claim",
                "Automatically transfer the claim amount to the next legal heir",
                "Pay only 50% of the claim until the investigation is complete"
            ],
            correctAnswer: 1,
            explanation: "Insurers have the right to investigate suspicious claims before processing the payout, especially in case of foul play by the nominee.",
            difficulty: "Super Hard",
            category: "Claim Investigations & Legal Aspects"
        },
        {
            id: 152,
            question: "A policyholder's premium payment is delayed by 5 days beyond the grace period. What happens?",
            options: [
                "The policy lapses immediately, with no revival option",
                "The policy lapses but can be revived within a specific period",
                "The insurer allows a one-time exemption and continues coverage",
                "The policy converts into a paid-up policy with reduced coverage"
            ],
            correctAnswer: 1,
            explanation: "Policies lapse after the grace period but can usually be revived within a specific revival period by paying overdue premiums.",
            difficulty: "Super Hard",
            category: "Policy Lapse & Revival"
        },
        {
            id: 153,
            question: "A person with an active life insurance policy changes their smoking habits from non-smoker to heavy smoker but does not inform the insurer. What could happen?",
            options: [
                "The policy remains valid without any changes",
                "The insurer may deny a future claim due to material misrepresentation",
                "The insurer will increase the premium automatically",
                "The nominee will receive only a partial claim amount"
            ],
            correctAnswer: 1,
            explanation: "A material change in health habits (like smoking) must be disclosed; failure to do so could result in claim denial.",
            difficulty: "Super Hard",
            category: "Non-Disclosure & Material Facts"
        },
        {
            id: 154,
            question: "A policyholder wants to assign their life insurance policy as collateral for a loan. What must they do?",
            options: [
                "Apply for an endorsement from the insurer",
                "Transfer ownership completely to the lender",
                "Surrender the policy and use the surrender value",
                "Nominate the lender as the new beneficiary"
            ],
            correctAnswer: 0,
            explanation: "For collateral assignment, the insurer must endorse the policy, allowing the lender to claim the policy benefits if the loan defaults.",
            difficulty: "Super Hard",
            category: "Policy Assignment & Collateral"
        },
        {
            id: 155,
            question: "A policyholder with a unit-linked insurance plan (ULIP) switches their fund allocation from equity to debt. What impact does this have?",
            options: [
                "The sum assured increases",
                "The risk exposure reduces but returns may be lower",
                "The policy term is extended",
                "The policyholder must pay an additional fee"
            ],
            correctAnswer: 1,
            explanation: "Switching from equity to debt in a ULIP reduces investment risk, but returns may also be lower.",
            difficulty: "Super Hard",
            category: "ULIP & Fund Switching"
        },
        {
            id: 156,
            question: "A person buys a life insurance policy with a 'Family Income Benefit' rider. What happens if the insured dies?",
            options: [
                "A lump sum payment is made to the nominee",
                "A regular monthly income is provided to the family",
                "The insurer refunds all premiums paid",
                "The claim is settled only after five years"
            ],
            correctAnswer: 1,
            explanation: "The Family Income Benefit rider provides a steady income to the nominee instead of a lump sum payout.",
            difficulty: "Super Hard",
            category: "Family Protection & Riders"
        },
        {
            id: 157,
            question: "A policyholder takes a joint-life insurance policy, and one of the insured individuals dies. What happens?",
            options: [
                "The policy terminates immediately",
                "The sum assured is paid, but the policy continues for the second insured",
                "No claim is paid until both insured individuals die",
                "The insurer refunds only the premiums paid"
            ],
            correctAnswer: 1,
            explanation: "In joint-life first-death policies, the sum assured is paid on the first death, and the policy may continue for the second insured.",
            difficulty: "Super Hard",
            category: "Joint-Life Policies"
        },
        {
            id: 158,
            question: "A nominee receives a claim payout from a life insurance policy, but the policyholder had outstanding loans. What happens?",
            options: [
                "The full amount is paid to the nominee",
                "The insurer deducts the loan amount before payout",
                "The payout is frozen until the loan is settled",
                "The nominee must repay the loan before receiving the claim amount"
            ],
            correctAnswer: 0,
            explanation: "Loans against a policy do not affect the sum assured payout unless the policyholder had pledged the policy as collateral.",
            difficulty: "Super Hard",
            category: "Policy Loans & Claims"
        },
        {
            id: 159,
            question: "A policyholder stops paying premiums on their life insurance policy, but it has acquired a surrender value. What happens next?",
            options: [
                "The policy lapses immediately with no benefits",
                "The policy continues as a paid-up policy with a reduced sum assured",
                "The full sum assured will still be paid on death",
                "The insurer will deduct unpaid premiums from the sum assured"
            ],
            correctAnswer: 1,
            explanation: "If a policy has a surrender value, it may be converted into a paid-up policy with a reduced sum assured rather than lapsing.",
            difficulty: "Super Hard",
            category: "Policy Lapse & Paid-Up Policies"
        },
        {
            id: 160,
            question: "A policyholder dies within the first six months of buying a life insurance policy. What will the insurer do?",
            options: [
                "Reject the claim due to early death",
                "Investigate the claim for fraud or non-disclosure",
                "Pay the full sum assured without any conditions",
                "Refund only the premiums paid"
            ],
            correctAnswer: 1,
            explanation: "If a death occurs within a short period after policy issuance, insurers usually investigate for misrepresentation or pre-existing conditions.",
            difficulty: "Super Hard",
            category: "Claim Investigation & Fraud Detection"
        },
        {
            id: 161,
            question: "A person buys a Unit Linked Insurance Plan (ULIP) and chooses aggressive equity funds. Due to market fluctuations, the fund value drops significantly. What can the policyholder do?",
            options: [
                "Request the insurer to compensate for the loss",
                "Switch to a debt fund to reduce further risk",
                "Cancel the policy and get a refund of premiums",
                "Increase the sum assured to balance the loss"
            ],
            correctAnswer: 1,
            explanation: "ULIPs allow fund switching to minimize risk, but the insurer does not compensate for market losses.",
            difficulty: "Super Hard",
            category: "ULIP & Investment Risks"
        },
        {
            id: 162,
            question: "A policyholder dies due to a plane crash while traveling for work. The insurance policy has an aviation exclusion clause. What will the insurer do?",
            options: [
                "Reject the claim entirely",
                "Pay the full sum assured",
                "Only pay if it was a commercial flight",
                "Deduct a certain percentage before payout"
            ],
            correctAnswer: 2,
            explanation: "Some life insurance policies exclude deaths from private or risky aviation activities but cover commercial flights.",
            difficulty: "Super Hard",
            category: "Exclusions & Special Clauses"
        },
        {
            id: 163,
            question: "A policyholder adds their spouse as a nominee but later divorces. If the policyholder dies, what happens to the claim?",
            options: [
                "The ex-spouse still receives the claim amount",
                "The claim automatically goes to the legal heir",
                "The claim is rejected due to nomination invalidity",
                "The insurer decides based on the will"
            ],
            correctAnswer: 0,
            explanation: "Nomination remains valid unless changed by the policyholder, even after divorce.",
            difficulty: "Super Hard",
            category: "Nomination & Legal Rights"
        },
        {
            id: 164,
            question: "A policyholder takes a loan against their life insurance policy and dies before repaying. What happens?",
            options: [
                "The nominee gets the full sum assured",
                "The insurer deducts the loan amount before payout",
                "The claim is rejected due to unpaid debt",
                "The loan is automatically forgiven"
            ],
            correctAnswer: 1,
            explanation: "Loans against a life policy are deducted from the claim payout if not repaid.",
            difficulty: "Super Hard",
            category: "Policy Loans & Claims"
        },
        {
            id: 165,
            question: "A policyholder misses paying the premium during the grace period and then dies. What happens?",
            options: [
                "The policy is considered active and the claim is paid",
                "The policy is lapsed and no claim is paid",
                "The insurer pays only the premiums paid till date",
                "The nominee must pay the outstanding premium to claim"
            ],
            correctAnswer: 1,
            explanation: "If a policy lapses due to non-payment, the insurer is not liable to pay the sum assured.",
            difficulty: "Super Hard",
            category: "Grace Period & Policy Lapse"
        },
        {
            id: 166,
            question: "A policyholder purchases a policy but forgets to mention they are a skydiver. If they die during skydiving, what happens?",
            options: [
                "The claim is paid fully",
                "The claim is denied due to material non-disclosure",
                "The insurer pays a reduced amount",
                "The nominee can challenge the rejection in court"
            ],
            correctAnswer: 1,
            explanation: "Material non-disclosure can lead to claim rejection, especially for high-risk activities.",
            difficulty: "Super Hard",
            category: "Non-Disclosure & High-Risk Activities"
        },
        {
            id: 167,
            question: "A person takes two term insurance policies and commits suicide in the third year. What happens?",
            options: [
                "Both insurers pay the full sum assured",
                "Only one insurer pays the claim",
                "Both insurers deny the claim due to suicide",
                "Only the premiums paid are refunded"
            ],
            correctAnswer: 0,
            explanation: "After the suicide exclusion period (usually one year), full claims are payable by both insurers.",
            difficulty: "Super Hard",
            category: "Suicide Clause & Multiple Policies"
        },
        {
            id: 168,
            question: "A policyholder designates their minor child as the nominee. If they die, who receives the claim amount?",
            options: [
                "The child directly",
                "The child's legal guardian",
                "The insurer holds the money until the child turns 18",
                "The claim is held in trust for the family"
            ],
            correctAnswer: 1,
            explanation: "A minor nominee requires a legal guardian to receive and manage the claim payout.",
            difficulty: "Super Hard",
            category: "Nomination & Legal Aspects"
        },
        {
            id: 169,
            question: "A person has a money-back policy. If they miss a premium payment but later revive the policy, what happens to their payouts?",
            options: [
                "Future payouts remain unchanged",
                "Future payouts are reduced",
                "All previous payouts must be refunded",
                "The policy converts into a term plan"
            ],
            correctAnswer: 0,
            explanation: "Once a policy is revived, the original payout structure remains unchanged.",
            difficulty: "Super Hard",
            category: "Money-Back Policies & Revival"
        },
        {
            id: 170,
            question: "A person buys an endowment policy but wants to change it to a term policy later. What can they do?",
            options: [
                "Request a policy conversion",
                "Surrender the endowment policy and buy a term plan",
                "Modify the premium payments",
                "Continue with reduced benefits"
            ],
            correctAnswer: 1,
            explanation: "Endowment policies cannot be converted to term plans; surrendering and purchasing a new policy is the only option.",
            difficulty: "Super Hard",
            category: "Policy Conversion & Surrender"
        },
        {
            id: 171,
            question: "A policyholder moves to a war-zone country without informing the insurer. If they die, what happens?",
            options: [
                "The claim is paid as usual",
                "The claim is denied due to policy exclusion",
                "Only the premiums are refunded",
                "The nominee must prove death was unrelated to war"
            ],
            correctAnswer: 1,
            explanation: "War-zone deaths are often excluded from life insurance coverage unless explicitly covered.",
            difficulty: "Super Hard",
            category: "Geographical Exclusions"
        },
        {
            id: 172,
            question: "A policyholder assigns their policy to a bank as loan collateral. If they die, who receives the payout?",
            options: [
                "The nominee directly",
                "The bank first, and any balance to the nominee",
                "The nominee, who must pay off the loan separately",
                "The insurer splits the sum equally"
            ],
            correctAnswer: 1,
            explanation: "In case of collateral assignment, the lender receives the loan amount first, and the nominee gets the balance.",
            difficulty: "Super Hard",
            category: "Collateral Assignment & Claims"
        },
        {
            id: 173,
            question: "A life insurance policyholder is diagnosed with a terminal illness but did not disclose a minor pre-existing condition at the time of purchase. What will the insurer do?",
            options: [
                "Reject the claim due to material non-disclosure",
                "Pay the claim in full since the illness is unrelated",
                "Reduce the claim payout considering non-disclosure",
                "Reject the claim and refund only the premiums paid"
            ],
            correctAnswer: 0,
            explanation: "Non-disclosure of material facts, even if unrelated to the cause of death, can lead to claim rejection.",
            difficulty: "Super Hard",
            category: "Material Non-Disclosure"
        },
        {
            id: 174,
            question: "A policyholder dies during the waiting period of a critical illness rider. What will the insurer do?",
            options: [
                "Pay the sum assured of the base policy only",
                "Reject the entire claim due to the waiting period",
                "Pay only a percentage of the sum assured",
                "Pay both the base policy and rider benefits"
            ],
            correctAnswer: 0,
            explanation: "The base policy sum assured is payable, but the critical illness rider is not applicable due to the waiting period.",
            difficulty: "Super Hard",
            category: "Riders & Waiting Periods"
        },
        {
            id: 175,
            question: "A person has two life insurance policies from different insurers. If they die, how will the claims be handled?",
            options: [
                "Both insurers will pay the sum assured individually",
                "One insurer pays, and the other rejects to avoid duplication",
                "Both insurers will split the payout equally",
                "The nominee must decide which insurer to claim from"
            ],
            correctAnswer: 0,
            explanation: "Life insurance is not indemnity-based, so multiple insurers can pay full claims.",
            difficulty: "Super Hard",
            category: "Multiple Policies"
        },
        {
            id: 176,
            question: "A policyholder assigns their policy to a bank for a loan. If they die, who receives the claim first?",
            options: [
                "The legal heirs of the policyholder",
                "The nominee as mentioned in the policy",
                "The bank up to the loan amount, and the nominee gets the balance",
                "The insurer decides based on financial need"
            ],
            correctAnswer: 2,
            explanation: "In case of assignment, the bank receives the payout first to clear the loan before the nominee gets the remaining amount.",
            difficulty: "Super Hard",
            category: "Assignment of Policy"
        },
        {
            id: 177,
            question: "A policyholder pays premiums for 10 years but forgets to update their nominee. If they die, what happens?",
            options: [
                "The insurer distributes the amount equally among legal heirs",
                "The claim is paid to the default nominee in the policy",
                "The insurer withholds the amount until the court decides",
                "The policy is void due to no valid nominee"
            ],
            correctAnswer: 0,
            explanation: "If no nominee is updated, the legal heirs receive the payout based on succession laws.",
            difficulty: "Super Hard",
            category: "Nominee & Legal Heirs"
        },
        {
            id: 178,
            question: "A policyholder commits suicide after two years of policy issuance. What will the insurer do?",
            options: [
                "Reject the claim due to the suicide clause",
                "Pay only the premium amount paid so far",
                "Pay the full sum assured to the nominee",
                "Pay a reduced sum assured after deductions"
            ],
            correctAnswer: 2,
            explanation: "Suicide is covered after the exclusion period (usually one year).",
            difficulty: "Super Hard",
            category: "Suicide Clause"
        },
        {
            id: 179,
            question: "A policyholder fails to disclose smoking habits when purchasing a policy but later develops lung disease. What will happen to the claim?",
            options: [
                "Claim will be rejected due to non-disclosure",
                "Claim will be partially paid after deductions",
                "Claim will be fully paid as the policy was issued",
                "Claim will be paid only if additional premium is paid"
            ],
            correctAnswer: 0,
            explanation: "Non-disclosure of smoking is considered material misrepresentation and can lead to claim rejection.",
            difficulty: "Super Hard",
            category: "Material Misrepresentation"
        },
        {
            id: 180,
            question: "A person buys an immediate annuity plan and dies after two months. What happens to the invested amount?",
            options: [
                "The entire amount is refunded to the nominee",
                "The insurer keeps the amount, and the annuity stops",
                "It depends on the annuity payout option chosen",
                "The nominee receives only half of the amount"
            ],
            correctAnswer: 2,
            explanation: "Annuity payouts depend on the chosen option—some provide refunds, while others do not.",
            difficulty: "Super Hard",
            category: "Annuities"
        },
        {
            id: 181,
            question: "A policyholder moves to another country without informing the insurer. If they die, what happens?",
            options: [
                "Claim is paid fully without issues",
                "Claim is rejected due to geographical exclusion",
                "Insurer investigates before deciding",
                "Only half the sum assured is paid"
            ],
            correctAnswer: 2,
            explanation: "Some policies have geographical exclusions; insurers may investigate before approving claims.",
            difficulty: "Super Hard",
            category: "Geographical Restrictions"
        },
        {
            id: 182,
            question: "A policyholder forgets to pay the premium, but the insurer automatically deducts it from the policy's cash value. What is this feature called?",
            options: [
                "Grace period extension",
                "Automatic premium loan",
                "Policy revival benefit",
                "Waiver of premium rider"
            ],
            correctAnswer: 1,
            explanation: "An automatic premium loan allows the insurer to use the cash value to pay premiums to prevent lapse.",
            difficulty: "Super Hard",
            category: "Automatic Premium Loan"
        },
        {
            id: 183,
            question: "A policyholder has a money-back policy and receives a payout every five years. If they die after receiving one payout, what happens?",
            options: [
                "Nominee receives full sum assured minus previous payouts",
                "Nominee receives only the remaining payouts",
                "Nominee receives full sum assured without deductions",
                "Policy terminates with no further payout"
            ],
            correctAnswer: 2,
            explanation: "Money-back policies pay the full sum assured on death, regardless of previous payouts.",
            difficulty: "Super Hard",
            category: "Money-Back Policies"
        },
        {
            id: 184,
            question: "A policyholder dies in an accident, but the death certificate states 'natural causes'. What happens?",
            options: [
                "Insurer pays accident benefit",
                "Insurer investigates before payout",
                "Claim is rejected due to incorrect certificate",
                "Nominee must provide additional documents"
            ],
            correctAnswer: 1,
            explanation: "Insurers investigate discrepancies in death causes before processing claims.",
            difficulty: "Super Hard",
            category: "Claim Investigation"
        },
        {
            id: 185,
            question: "A policyholder has a waiver of premium rider. If they become permanently disabled, what happens?",
            options: [
                "Policy lapses unless premiums are paid",
                "Premiums are waived, and the policy continues",
                "Only a partial sum assured is paid",
                "The policy converts into a term plan"
            ],
            correctAnswer: 1,
            explanation: "A waiver of premium rider ensures the policy remains active without further premium payments.",
            difficulty: "Super Hard",
            category: "Waiver of Premium Rider"
        },
        {
            id: 186,
            question: "A policyholder claims terminal illness benefits but survives longer than expected. What happens?",
            options: [
                "Insurer reclaims the payout",
                "Insurer stops future payouts",
                "Policy remains active, but no further benefits",
                "The policy converts into a savings plan"
            ],
            correctAnswer: 2,
            explanation: "After receiving terminal illness benefits, the policy remains active but may not provide further payouts.",
            difficulty: "Super Hard",
            category: "Terminal Illness Benefit"
        },
        {
            id: 187,
            question: "A policyholder buys a participating life insurance policy but does not receive any bonuses for the first three years. What could be the reason?",
            options: [
                "Bonuses are not guaranteed and depend on insurer performance",
                "The policy does not qualify for bonuses initially",
                "Bonuses are only paid upon maturity",
                "The insurer uses the initial premium for expenses"
            ],
            correctAnswer: 0,
            explanation: "Participating policies provide bonuses based on surplus, which depends on the insurer's performance and is not guaranteed.",
            difficulty: "Super Hard",
            category: "Participating Policies"
        },
        {
            id: 188,
            question: "A policyholder is diagnosed with a critical illness and wants to surrender their policy to get immediate cash. What will happen?",
            options: [
                "They will receive the full sum assured",
                "They will get only the surrender value",
                "They will receive both the sum assured and bonuses",
                "The insurer will reject the surrender request"
            ],
            correctAnswer: 1,
            explanation: "On surrender, only the surrender value is payable, not the full sum assured.",
            difficulty: "Super Hard",
            category: "Surrender Value"
        },
        {
            id: 189,
            question: "A policyholder nominates a minor as the beneficiary. What happens if the policyholder dies while the nominee is still a minor?",
            options: [
                "The insurer pays the claim to the minor directly",
                "The claim amount is held until the minor reaches adulthood",
                "A legal guardian receives the payout on behalf of the minor",
                "The insurer decides the payout method based on internal policies"
            ],
            correctAnswer: 2,
            explanation: "A minor nominee requires a legal guardian to receive the claim amount on their behalf.",
            difficulty: "Super Hard",
            category: "Minor Nominee Rules"
        },
        {
            id: 190,
            question: "A policyholder has an insurance policy with a reinstatement clause. If the policy lapses due to non-payment, how can they reinstate it?",
            options: [
                "By paying all due premiums without interest",
                "By submitting a fresh proposal and medical report",
                "By paying due premiums with interest and fulfilling conditions",
                "By waiting for automatic revival after a grace period"
            ],
            correctAnswer: 2,
            explanation: "Reinstatement requires payment of overdue premiums with interest and sometimes proof of insurability.",
            difficulty: "Super Hard",
            category: "Policy Revival"
        },
        {
            id: 191,
            question: "A policyholder opts for a term insurance plan with a return of premium feature. What will they receive if they outlive the policy?",
            options: [
                "Full sum assured plus premiums paid",
                "Only the total premiums paid without interest",
                "A percentage of the sum assured",
                "Nothing, as term plans do not offer payouts"
            ],
            correctAnswer: 1,
            explanation: "Return of premium term plans refund only the total premiums paid, excluding interest or bonuses.",
            difficulty: "Super Hard",
            category: "Term Insurance Variants"
        },
        {
            id: 192,
            question: "A policyholder names their spouse as the nominee, but later gets divorced. What happens to the nominee status?",
            options: [
                "The nominee remains unchanged unless updated",
                "The nominee is automatically removed",
                "The insurer transfers nominee rights to legal heirs",
                "The policy is canceled upon divorce"
            ],
            correctAnswer: 0,
            explanation: "Nominees must be updated manually; divorce does not automatically remove a nominee.",
            difficulty: "Super Hard",
            category: "Nominee Rules"
        },
        {
            id: 193,
            question: "A policyholder buys a whole life policy but stops paying premiums after 15 years. What happens to the policy?",
            options: [
                "It lapses immediately",
                "It converts to a reduced paid-up policy",
                "The insurer cancels the policy with no benefit",
                "Premiums are adjusted from future claims"
            ],
            correctAnswer: 1,
            explanation: "Whole life policies often convert to reduced paid-up status after sufficient premiums are paid.",
            difficulty: "Super Hard",
            category: "Policy Continuity"
        },
        {
            id: 194,
            question: "A policyholder is declared legally insolvent. What happens to their life insurance policy?",
            options: [
                "It is transferred to creditors automatically",
                "It continues but with restricted claim payout",
                "It is terminated by the insurer",
                "It remains unaffected unless assigned to creditors"
            ],
            correctAnswer: 3,
            explanation: "A life insurance policy remains valid unless assigned to creditors or affected by legal proceedings.",
            difficulty: "Super Hard",
            category: "Legal Implications"
        },
        {
            id: 195,
            question: "A policyholder takes a policy loan but does not repay it. What happens at claim settlement?",
            options: [
                "The claim is rejected due to unpaid loan",
                "The outstanding loan is deducted from the claim payout",
                "The nominee must repay the loan before receiving payout",
                "The insurer cancels the policy due to non-payment"
            ],
            correctAnswer: 1,
            explanation: "Outstanding policy loans are deducted from the claim or maturity payout.",
            difficulty: "Super Hard",
            category: "Policy Loans"
        },
        {
            id: 196,
            question: "A policyholder selects a unit-linked insurance plan (ULIP). If the market crashes, what happens to the policy value?",
            options: [
                "The sum assured remains unaffected, but fund value decreases",
                "Both the sum assured and fund value decrease",
                "The insurer guarantees the policyholder's invested amount",
                "The policy terminates automatically"
            ],
            correctAnswer: 0,
            explanation: "ULIPs provide a guaranteed sum assured, but the fund value is market-linked and can fluctuate.",
            difficulty: "Super Hard",
            category: "ULIP Risks"
        },
        {
            id: 197,
            question: "A policyholder has a life insurance policy with an increasing sum assured feature. What happens if they stop paying premiums?",
            options: [
                "The sum assured stops increasing, but the policy remains active",
                "The policy is converted to a reduced paid-up plan",
                "The sum assured resets to the original value",
                "The policy lapses without benefits"
            ],
            correctAnswer: 1,
            explanation: "If premiums stop, the policy may convert to a reduced paid-up plan, affecting sum assured.",
            difficulty: "Super Hard",
            category: "Policy Features"
        },
        {
            id: 198,
            question: "A policyholder has a joint life insurance policy with their spouse. If one spouse dies, what happens?",
            options: [
                "The surviving spouse receives the full sum assured",
                "The policy continues with adjusted premiums",
                "The policy terminates immediately",
                "The claim payout depends on policy terms"
            ],
            correctAnswer: 3,
            explanation: "Joint life policies have varying payout terms, such as payout on first death or second death.",
            difficulty: "Super Hard",
            category: "Joint Life Policies"
        },
        {
            id: 199,
            question: "A policyholder wants to change their regular premium policy to a single premium policy. Is this possible?",
            options: [
                "Yes, with insurer approval",
                "No, regular policies cannot be converted",
                "Only in the first year of the policy",
                "Yes, but with increased costs"
            ],
            correctAnswer: 1,
            explanation: "Regular premium policies cannot generally be converted into single premium policies.",
            difficulty: "Super Hard",
            category: "Premium Payments"
        },
        {
            id: 200,
            question: "A policyholder claims accidental death benefit, but the insurer discovers alcohol consumption at the time of death. What happens?",
            options: [
                "The claim is rejected due to policy exclusions",
                "The claim is paid in full",
                "The insurer pays only the base sum assured",
                "A partial payout is made based on insurer discretion"
            ],
            correctAnswer: 2,
            explanation: "Accidental death benefit often excludes claims involving intoxication; only the base sum assured may be paid.",
            difficulty: "Super Hard",
            category: "Accidental Death Benefit"
        },
        {
            id: 201,
            question: "A policyholder assigns their policy to a lender for a loan but later revokes the assignment. What happens?",
            options: [
                "The assignment remains valid until the lender agrees",
                "The policyholder can revoke it at any time",
                "The insurer cancels the assignment automatically",
                "The nominee takes precedence over the assignment"
            ],
            correctAnswer: 0,
            explanation: "Assignments remain valid until the assignee (lender) releases it, even if the policyholder wants to revoke it.",
            difficulty: "Super Hard",
            category: "Policy Assignment"
        },
        {
            id: 202,
            question: "A policyholder with a whole life policy takes a policy loan, and the interest accumulates beyond the surrender value. What happens next?",
            options: [
                "The policy remains active with reduced benefits",
                "The policy lapses automatically without payout",
                "The loan amount is deducted from the sum assured at claim settlement",
                "The insurer converts the policy into a paid-up policy"
            ],
            correctAnswer: 1,
            explanation: "If the loan and interest exceed the surrender value, the policy typically lapses unless additional premiums are paid.",
            difficulty: "Super Hard",
            category: "Policy Loans & Lapse"
        },
        {
            id: 203,
            question: "A policyholder nominates their friend as a nominee under a life insurance policy. What happens if the policyholder dies, and their legal heir disputes the claim?",
            options: [
                "The nominee receives the full payout",
                "The legal heir automatically gets the claim amount",
                "The nominee receives the payout but must transfer it to the legal heir",
                "The insurer holds the payout until a court decision"
            ],
            correctAnswer: 3,
            explanation: "Nominees are only custodians of the claim amount, and legal heirs can challenge the payout in court.",
            difficulty: "Super Hard",
            category: "Nomination & Legal Heirs"
        },
        {
            id: 204,
            question: "A policyholder has a term insurance plan with an accidental death rider. If they die in an accident but were intoxicated at the time, what happens?",
            options: [
                "The accidental death benefit is paid in full",
                "Only the base sum assured is paid",
                "The entire claim is rejected due to intoxication",
                "The insurer pays based on case-by-case discretion"
            ],
            correctAnswer: 1,
            explanation: "Accidental death riders often exclude claims where the insured was intoxicated, but the base sum assured is still paid.",
            difficulty: "Super Hard",
            category: "Accidental Death Riders"
        },
        {
            id: 205,
            question: "A policyholder with a critical illness rider is diagnosed with a listed illness but fails to inform the insurer for a year. What happens?",
            options: [
                "The claim is accepted without issues",
                "The claim is denied due to delayed intimation",
                "The claim is partially settled with deductions",
                "The policy is canceled due to non-disclosure"
            ],
            correctAnswer: 1,
            explanation: "Most critical illness riders have a stipulated reporting period, and delayed intimation can lead to claim rejection.",
            difficulty: "Super Hard",
            category: "Critical Illness Riders"
        },
        {
            id: 206,
            question: "A policyholder buys a unit-linked insurance plan (ULIP) but stops paying premiums after three years. What happens?",
            options: [
                "The policy lapses with no value",
                "The policy fund value continues to fluctuate based on market performance",
                "The sum assured remains unchanged but with deductions",
                "The insurer converts the policy to a fixed return plan"
            ],
            correctAnswer: 1,
            explanation: "ULIPs have a lock-in period, and after that, the fund value remains invested even if premium payments stop.",
            difficulty: "Super Hard",
            category: "ULIP Policies"
        },
        {
            id: 207,
            question: "A policyholder assigns their policy to a bank for a loan. If the policyholder dies before repaying the loan, what happens?",
            options: [
                "The bank receives the entire sum assured",
                "The nominee receives the claim, and the bank has no rights",
                "The outstanding loan amount is deducted, and the nominee gets the balance",
                "The insurer cancels the claim due to assignment"
            ],
            correctAnswer: 2,
            explanation: "In an assignment, the lender gets repaid first from the claim, and the balance (if any) goes to the nominee.",
            difficulty: "Super Hard",
            category: "Policy Assignment & Claims"
        },
        {
            id: 208,
            question: "A policyholder has a decreasing term insurance plan. If they die in the 15th year of a 20-year policy, how much does the nominee get?",
            options: [
                "The original sum assured",
                "The reduced sum assured as per the schedule",
                "A percentage of premiums paid",
                "Nothing, as the policy expires before payout"
            ],
            correctAnswer: 1,
            explanation: "In decreasing term insurance, the sum assured reduces annually based on a predefined schedule.",
            difficulty: "Super Hard",
            category: "Term Insurance Variants"
        },
        {
            id: 209,
            question: "A policyholder purchases an endowment policy but fails to disclose a pre-existing medical condition. If they die within two years, what happens?",
            options: [
                "The claim is paid in full",
                "The claim is rejected due to non-disclosure",
                "The premiums paid are refunded without interest",
                "The insurer deducts an extra penalty before payout"
            ],
            correctAnswer: 2,
            explanation: "If material non-disclosure is found within the contestability period, insurers usually refund premiums but reject the claim.",
            difficulty: "Super Hard",
            category: "Utmost Good Faith & Claims"
        },
        {
            id: 210,
            question: "A policyholder selects a waiver of premium rider but becomes permanently disabled. What happens to their policy?",
            options: [
                "Future premiums are waived, but benefits remain unchanged",
                "The policy terminates immediately",
                "The insurer refunds past premiums",
                "The policy continues with reduced benefits"
            ],
            correctAnswer: 0,
            explanation: "A waiver of premium rider ensures that the policy remains active without requiring further premium payments if the insured becomes disabled.",
            difficulty: "Super Hard",
            category: "Waiver of Premium Rider"
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
  
          // Check if IC02 access code exists and is valid
          if (data.accesscode && data.accesscode.IC02) {
              const accessCodeData = data.accesscode.IC02;
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
              'IC02': {
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
  
          if (data.examanswers && data.examanswers.IC02 && data.examanswers.IC02.answers) {
              const savedAnswers = data.examanswers.IC02.answers;
              
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
          return `IC02-${randomPin}`;
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
                  name: "Arkhamm AI Private Limited",
                  description: "IC-02 Insurance Principles Exam Access",
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
                                  examType: 'IC02'
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
                      examType: 'IC02'
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
                  examType: 'IC02'
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
          doc.text('III-IC 02: Practice of Life Insurance Mock Report', 10, 10);
          
          // Certificate Details
          doc.setFontSize(12);
          doc.text(`Certificate Number: ${examMetadata.certificateNumber}`, 10, 50);
          doc.text(`Exam Name: Insurance Principles IC 02`, 10, 60);
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
              doc.text('III-IC 02: Practice of Life Insurance Mock Report', pageWidth / 2, 30, { align: 'right' });
      
              // Exam Details
              doc.setFontSize(12);
              doc.setTextColor(0, 0, 0);
              let yPosition = 50;
      
              const addDetailLine = (label, value) => {
                  doc.text(`${label}: ${value}`, margin, yPosition);
                  yPosition += 10;
              };
      
              addDetailLine('Report Number', examMetadata.certificateNumber);
              addDetailLine('Exam Name', 'Practice of Life Insurance IC 02');
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
              doc.text('III-IC 02: Practice of Life Insurance Mock Report', pageWidth / 2, 30, { align: 'right' });
      
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
                  <h1 style={{fontSize: 24}}><ScanSearch size={20} style={{marginTop: -5}} /> IRDAI: IC 02</h1>
                  <p><Play size={15} style={{marginTop: -3}} /> Module: Practice of Life Insurance</p>
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
                          <Disc size={18} /> IC-02: Insurance Principles Exam
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
  