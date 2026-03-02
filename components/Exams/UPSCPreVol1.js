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


export default function UPSCPreVol1() {
    const questions = [
        {
            id: 1,
            question: "Which Article of the Indian Constitution deals with the Right to Equality?",
            options: [
            "Article 14",
            "Article 19",
            "Article 21",
            "Article 32"
            ],
            correctAnswer: 0,
            explanation: "Article 14 guarantees equality before the law and equal protection of the laws within the territory of India.",
            difficulty: "Easy",
            category: "Polity"
        },
        {
            id: 2,
            question: "Which river is known as the 'Sorrow of Bihar'?",
            options: [
            "Ganga",
            "Kosi",
            "Son",
            "Gandak"
            ],
            correctAnswer: 1,
            explanation: "The Kosi River is called the 'Sorrow of Bihar' due to frequent floods causing destruction in the region.",
            difficulty: "Easy",
            category: "Geography"
        },
        {
            id: 3,
            question: "What is the term of a member of the Rajya Sabha?",
            options: [
            "3 years",
            "5 years",
            "6 years",
            "Till dissolution"
            ],
            correctAnswer: 2,
            explanation: "Members of the Rajya Sabha serve for six years, with one-third of the members retiring every two years.",
            difficulty: "Easy",
            category: "Polity"
        },
        {
            id: 4,
            question: "Which of the following is not a Fundamental Right under the Constitution of India?",
            options: [
            "Right to Education",
            "Right to Property",
            "Right to Freedom",
            "Right to Equality"
            ],
            correctAnswer: 1,
            explanation: "The Right to Property was removed from the list of Fundamental Rights by the 44th Amendment in 1978.",
            difficulty: "Easy",
            category: "Polity"
        },
        {
            id: 5,
            question: "Who was the first Indian Governor-General of independent India?",
            options: [
            "Jawaharlal Nehru",
            "C. Rajagopalachari",
            "Sardar Patel",
            "Dr. Rajendra Prasad"
            ],
            correctAnswer: 1,
            explanation: "C. Rajagopalachari was the first and last Indian Governor-General of independent India.",
            difficulty: "Easy",
            category: "History"
        },
        {
            id: 6,
            question: "Which planet is known as the Red Planet?",
            options: [
            "Earth",
            "Mars",
            "Venus",
            "Jupiter"
            ],
            correctAnswer: 1,
            explanation: "Mars is called the Red Planet because of its reddish appearance due to iron oxide on its surface.",
            difficulty: "Easy",
            category: "Science & Technology"
        },
        {
            id: 7,
            question: "Who is regarded as the Father of the Indian Constitution?",
            options: [
            "Mahatma Gandhi",
            "Dr. B.R. Ambedkar",
            "Jawaharlal Nehru",
            "Sardar Vallabhbhai Patel"
            ],
            correctAnswer: 1,
            explanation: "Dr. B.R. Ambedkar was the Chairman of the Drafting Committee and played a key role in framing the Indian Constitution.",
            difficulty: "Easy",
            category: "Polity"
        },
        {
            id: 8,
            question: "What is the capital of Arunachal Pradesh?",
            options: [
            "Aizawl",
            "Itanagar",
            "Kohima",
            "Agartala"
            ],
            correctAnswer: 1,
            explanation: "Itanagar is the capital of Arunachal Pradesh.",
            difficulty: "Easy",
            category: "Geography"
        },
        {
            id: 9,
            question: "Which gas is essential for photosynthesis?",
            options: [
            "Oxygen",
            "Nitrogen",
            "Carbon Dioxide",
            "Hydrogen"
            ],
            correctAnswer: 2,
            explanation: "Carbon dioxide is used by plants during photosynthesis to produce oxygen and glucose.",
            difficulty: "Easy",
            category: "Science & Environment"
        },
        {
            id: 10,
            question: "What is the currency of Japan?",
            options: [
            "Yuan",
            "Won",
            "Ringgit",
            "Yen"
            ],
            correctAnswer: 3,
            explanation: "The Yen is the official currency of Japan.",
            difficulty: "Easy",
            category: "Current Affairs / GK"
        },
        {
            id: 11,
            question: "Which Mughal emperor built the Red Fort in Delhi?",
            options: [
            "Babur",
            "Akbar",
            "Shah Jahan",
            "Aurangzeb"
            ],
            correctAnswer: 2,
            explanation: "Shah Jahan built the Red Fort in Delhi in the 17th century.",
            difficulty: "Easy",
            category: "History"
        },
        {
            id: 12,
            question: "Which of the following is an example of a renewable resource?",
            options: [
            "Coal",
            "Petroleum",
            "Solar energy",
            "Natural gas"
            ],
            correctAnswer: 2,
            explanation: "Solar energy is renewable as it is naturally replenished and inexhaustible.",
            difficulty: "Easy",
            category: "Environment"
        },
        {
            id: 13,
            question: "Which Indian state is the largest by area?",
            options: [
            "Maharashtra",
            "Uttar Pradesh",
            "Rajasthan",
            "Madhya Pradesh"
            ],
            correctAnswer: 2,
            explanation: "Rajasthan is the largest state in India by area.",
            difficulty: "Easy",
            category: "Geography"
        },
        {
            id: 14,
            question: "Which organ purifies the blood in the human body?",
            options: [
            "Heart",
            "Lungs",
            "Liver",
            "Kidney"
            ],
            correctAnswer: 3,
            explanation: "Kidneys filter blood to remove waste and excess substances, forming urine.",
            difficulty: "Easy",
            category: "Science & Health"
        },
        {
            id: 15,
            question: "In which year did India gain independence from British rule?",
            options: [
            "1942",
            "1945",
            "1947",
            "1950"
            ],
            correctAnswer: 2,
            explanation: "India gained independence on August 15, 1947.",
            difficulty: "Easy",
            category: "History"
        },
        {
            id: 16,
            question: "Who was the first President of independent India?",
            options: [
            "Dr. Rajendra Prasad",
            "Dr. B.R. Ambedkar",
            "Jawaharlal Nehru",
            "Sarvepalli Radhakrishnan"
            ],
            correctAnswer: 0,
            explanation: "Dr. Rajendra Prasad was the first President of India, serving from 1950 to 1962.",
            difficulty: "Easy",
            category: "History"
        },
        {
            id: 17,
            question: "Which body is responsible for conducting elections in India?",
            options: [
            "Supreme Court",
            "Election Commission of India",
            "Parliament",
            "Home Ministry"
            ],
            correctAnswer: 1,
            explanation: "The Election Commission of India conducts free and fair elections in the country.",
            difficulty: "Easy",
            category: "Polity"
        },
        {
            id: 18,
            question: "Which mineral is mainly extracted in the region of Chhattisgarh?",
            options: [
            "Gold",
            "Manganese",
            "Bauxite",
            "Coal"
            ],
            correctAnswer: 3,
            explanation: "Chhattisgarh is rich in coal reserves and is a leading producer of coal in India.",
            difficulty: "Easy",
            category: "Geography"
        },
        {
            id: 19,
            question: "What does GDP stand for?",
            options: [
            "Gross Domestic Product",
            "Gross Domestic Percentage",
            "Global Domestic Product",
            "General Development Plan"
            ],
            correctAnswer: 0,
            explanation: "GDP or Gross Domestic Product is the total value of goods and services produced in a country in a year.",
            difficulty: "Easy",
            category: "Economy"
        },
        {
            id: 20,
            question: "Which one of these is a renewable source of energy?",
            options: [
            "Natural Gas",
            "Coal",
            "Wind",
            "Petroleum"
            ],
            correctAnswer: 2,
            explanation: "Wind energy is renewable because it is naturally replenished and not exhaustible.",
            difficulty: "Easy",
            category: "Environment"
        },
        {
            id: 21,
            question: "Who among the following founded the Indian National Congress?",
            options: [
            "Dadabhai Naoroji",
            "A.O. Hume",
            "Bal Gangadhar Tilak",
            "Gopal Krishna Gokhale"
            ],
            correctAnswer: 1,
            explanation: "A.O. Hume, a retired British civil servant, founded the Indian National Congress in 1885.",
            difficulty: "Easy",
            category: "History"
        },
        {
            id: 22,
            question: "Which layer of the Earth lies just below the crust?",
            options: [
            "Outer core",
            "Mantle",
            "Inner core",
            "Lithosphere"
            ],
            correctAnswer: 1,
            explanation: "The mantle is located directly beneath the Earth's crust.",
            difficulty: "Easy",
            category: "Geography"
        },
        {
            id: 23,
            question: "Which of these is a function of the Reserve Bank of India?",
            options: [
            "Issuing passports",
            "Conducting elections",
            "Currency issuance",
            "Managing schools"
            ],
            correctAnswer: 2,
            explanation: "The RBI is responsible for issuing currency and regulating the monetary system of India.",
            difficulty: "Easy",
            category: "Economy"
        },
        {
            id: 24,
            question: "The ozone layer is found in which layer of the atmosphere?",
            options: [
            "Troposphere",
            "Stratosphere",
            "Mesosphere",
            "Thermosphere"
            ],
            correctAnswer: 1,
            explanation: "The ozone layer, which protects us from harmful UV rays, is located in the stratosphere.",
            difficulty: "Easy",
            category: "Environment"
        },
        {
            id: 25,
            question: "What is the full form of UNO?",
            options: [
            "United Nations Office",
            "Universal Nations Organization",
            "United Nations Organization",
            "United Network of Organizations"
            ],
            correctAnswer: 2,
            explanation: "UNO stands for United Nations Organization, formed in 1945 for international cooperation.",
            difficulty: "Easy",
            category: "Current Affairs / GK"
        },
        {
            id: 26,
            question: "Who wrote the book 'Discovery of India'?",
            options: [
            "Sardar Patel",
            "Subhas Chandra Bose",
            "Dr. Ambedkar",
            "Jawaharlal Nehru"
            ],
            correctAnswer: 3,
            explanation: "Jawaharlal Nehru wrote 'The Discovery of India' while imprisoned in 1942–1946.",
            difficulty: "Easy",
            category: "History"
        },
        {
            id: 27,
            question: "Which among the following is a biodegradable substance?",
            options: [
            "Plastic",
            "Glass",
            "Paper",
            "Metal"
            ],
            correctAnswer: 2,
            explanation: "Paper is biodegradable as it can be broken down by natural processes.",
            difficulty: "Easy",
            category: "Environment"
        },
        {
            id: 28,
            question: "Which Indian city is located on the banks of the river Yamuna?",
            options: [
            "Patna",
            "Agra",
            "Ahmedabad",
            "Kolkata"
            ],
            correctAnswer: 1,
            explanation: "Agra is located on the banks of the Yamuna River and is famous for the Taj Mahal.",
            difficulty: "Easy",
            category: "Geography"
        },
        {
            id: 29,
            question: "What is the main source of Vitamin D for the human body?",
            options: [
            "Fish",
            "Sunlight",
            "Milk",
            "Green Vegetables"
            ],
            correctAnswer: 1,
            explanation: "Sunlight helps the human body synthesize Vitamin D naturally.",
            difficulty: "Easy",
            category: "Science & Health"
        },
        {
            id: 30,
            question: "What is the name of India's Parliament House?",
            options: [
            "Sansad Bhavan",
            "Raj Bhavan",
            "Vidhana Soudha",
            "Lok Sabha Bhavan"
            ],
            correctAnswer: 0,
            explanation: "Sansad Bhavan is the name of the Indian Parliament House located in New Delhi.",
            difficulty: "Easy",
            category: "Polity"
        },
        {
            id: 31,
            question: "Which Article of the Indian Constitution empowers the President to declare Emergency?",
            options: [
            "Article 352",
            "Article 360",
            "Article 356",
            "Article 370"
            ],
            correctAnswer: 0,
            explanation: "Article 352 empowers the President to proclaim a National Emergency in case of war, external aggression, or armed rebellion.",
            difficulty: "Medium",
            category: "Polity"
        },
        {
            id: 32,
            question: "Which Indian state shares its border with the maximum number of other states?",
            options: [
            "Madhya Pradesh",
            "Uttar Pradesh",
            "Chhattisgarh",
            "Bihar"
            ],
            correctAnswer: 1,
            explanation: "Uttar Pradesh shares its borders with 9 states and 1 union territory, the highest among Indian states.",
            difficulty: "Medium",
            category: "Geography"
        },
        {
            id: 33,
            question: "Which Five Year Plan gave priority to 'Garibi Hatao' and self-reliance?",
            options: [
            "Third Plan",
            "Fourth Plan",
            "Fifth Plan",
            "Sixth Plan"
            ],
            correctAnswer: 2,
            explanation: "The Fifth Five Year Plan (1974–79) emphasized poverty removal and self-reliance in economic development.",
            difficulty: "Medium",
            category: "Economy"
        },
        {
            id: 34,
            question: "Which among the following pairs is correctly matched?",
            options: [
            "Narmada River – West flowing",
            "Godavari River – North flowing",
            "Mahanadi River – West flowing",
            "Krishna River – East flowing into Arabian Sea"
            ],
            correctAnswer: 0,
            explanation: "The Narmada River flows westward into the Arabian Sea, unlike most Indian rivers which flow east.",
            difficulty: "Medium",
            category: "Geography"
        },
        {
            id: 35,
            question: "Which Schedule of the Constitution contains the provisions related to anti-defection?",
            options: [
            "7th Schedule",
            "8th Schedule",
            "9th Schedule",
            "10th Schedule"
            ],
            correctAnswer: 3,
            explanation: "The 10th Schedule, inserted by the 52nd Amendment Act of 1985, deals with the anti-defection law.",
            difficulty: "Medium",
            category: "Polity"
        },
        {
            id: 36,
            question: "Which Mughal ruler introduced the policy of Sulh-i-Kul?",
            options: [
            "Akbar",
            "Aurangzeb",
            "Babur",
            "Shah Jahan"
            ],
            correctAnswer: 0,
            explanation: "Akbar introduced Sulh-i-Kul, a policy of universal tolerance towards all religions.",
            difficulty: "Medium",
            category: "History"
        },
        {
            id: 37,
            question: "Which atmospheric layer is crucial for radio communication?",
            options: [
            "Troposphere",
            "Stratosphere",
            "Ionosphere",
            "Mesosphere"
            ],
            correctAnswer: 2,
            explanation: "The ionosphere reflects radio waves back to Earth and is essential for long-distance radio communication.",
            difficulty: "Medium",
            category: "Science & Technology"
        },
        {
            id: 38,
            question: "Which of the following crops requires cool climate during the growing period and warm climate during maturation?",
            options: [
            "Rice",
            "Wheat",
            "Tea",
            "Cotton"
            ],
            correctAnswer: 1,
            explanation: "Wheat grows best in cool climates but requires warmer temperatures during ripening.",
            difficulty: "Medium",
            category: "Geography / Agriculture"
        },
        {
            id: 39,
            question: "Which of the following is an example of a primary pollutant?",
            options: [
            "Ozone",
            "Sulfur dioxide",
            "Smog",
            "Peroxyacetyl nitrate"
            ],
            correctAnswer: 1,
            explanation: "Sulfur dioxide is a primary pollutant as it is directly emitted from sources like burning fossil fuels.",
            difficulty: "Medium",
            category: "Environment"
        },
        {
            id: 40,
            question: "Which event led to the formal split of the Congress into two groups – Moderates and Extremists?",
            options: [
            "Partition of Bengal",
            "Surat Session of 1907",
            "Formation of Muslim League",
            "Non-Cooperation Movement"
            ],
            correctAnswer: 1,
            explanation: "The Surat Session of 1907 resulted in the split of the Congress into Moderates and Extremists.",
            difficulty: "Medium",
            category: "History"
        },
        {
            id: 41,
            question: "Which Indian state has the highest percentage of its area under forest cover?",
            options: [
            "Madhya Pradesh",
            "Arunachal Pradesh",
            "Mizoram",
            "Odisha"
            ],
            correctAnswer: 2,
            explanation: "According to Forest Survey of India reports, Mizoram has the highest forest cover by percentage of total area.",
            difficulty: "Medium",
            category: "Environment"
        },
        {
            id: 42,
            question: "Which of the following is an indirect tax in India?",
            options: [
            "Income Tax",
            "Corporate Tax",
            "GST",
            "Wealth Tax"
            ],
            correctAnswer: 2,
            explanation: "GST (Goods and Services Tax) is an indirect tax levied on the supply of goods and services.",
            difficulty: "Medium",
            category: "Economy"
        },
        {
            id: 43,
            question: "Which organ in the human body is responsible for the production of insulin?",
            options: [
            "Liver",
            "Kidney",
            "Pancreas",
            "Spleen"
            ],
            correctAnswer: 2,
            explanation: "The pancreas produces insulin, which regulates blood sugar levels.",
            difficulty: "Medium",
            category: "Science & Health"
        },
        {
            id: 44,
            question: "Which committee recommended the establishment of Panchayati Raj in India?",
            options: [
            "Balwant Rai Mehta Committee",
            "Ashok Mehta Committee",
            "Gadgil Committee",
            "Sarkaria Commission"
            ],
            correctAnswer: 0,
            explanation: "The Balwant Rai Mehta Committee (1957) recommended a three-tier Panchayati Raj system.",
            difficulty: "Medium",
            category: "Polity / Governance"
        },
        {
            id: 45,
            question: "Which of the following was not part of the Non-Aligned Movement founding members?",
            options: [
            "India",
            "Egypt",
            "Indonesia",
            "Pakistan"
            ],
            correctAnswer: 3,
            explanation: "Pakistan was not a founding member of the Non-Aligned Movement; India, Egypt, and Indonesia were.",
            difficulty: "Medium",
            category: "International Relations / History"
        },
        {
            id: 46,
            question: "Which Indian constitutional body is responsible for recommending the distribution of tax revenues between the Centre and the States?",
            options: [
            "Finance Commission",
            "Planning Commission",
            "Election Commission",
            "Comptroller and Auditor General"
            ],
            correctAnswer: 0,
            explanation: "The Finance Commission is a constitutional body under Article 280 that recommends the distribution of financial resources.",
            difficulty: "Medium",
            category: "Polity"
        },
        {
            id: 47,
            question: "Which among the following is a feature of the Parliamentary system of government in India?",
            options: [
            "President is the real executive",
            "Separation of powers between the legislature and executive",
            "Collective responsibility of the Cabinet",
            "Single citizenship is not allowed"
            ],
            correctAnswer: 2,
            explanation: "In the Parliamentary system, the Cabinet is collectively responsible to the Lok Sabha.",
            difficulty: "Medium",
            category: "Polity"
        },
        {
            id: 48,
            question: "Which movement marked Mahatma Gandhi's first active involvement in Indian mass politics?",
            options: [
            "Non-Cooperation Movement",
            "Champaran Satyagraha",
            "Salt March",
            "Quit India Movement"
            ],
            correctAnswer: 1,
            explanation: "The Champaran Satyagraha (1917) was Gandhi’s first active participation in Indian mass agitation.",
            difficulty: "Medium",
            category: "History"
        },
        {
            id: 49,
            question: "Which river is known as the 'Sorrow of Bihar'?",
            options: [
            "Ganga",
            "Kosi",
            "Son",
            "Gandak"
            ],
            correctAnswer: 1,
            explanation: "The Kosi River is called the 'Sorrow of Bihar' due to its frequent and devastating floods.",
            difficulty: "Medium",
            category: "Geography"
        },
        {
            id: 50,
            question: "Which of the following pairs is correctly matched?",
            options: [
            "Green Revolution – Horticulture",
            "White Revolution – Milk Production",
            "Blue Revolution – Grains",
            "Yellow Revolution – Fish Production"
            ],
            correctAnswer: 1,
            explanation: "The White Revolution in India led to an increase in milk production, spearheaded by Verghese Kurien.",
            difficulty: "Medium",
            category: "Economy / Agriculture"
        },
        {
            id: 51,
            question: "In which year was the Environmental Protection Act passed in India?",
            options: [
            "1972",
            "1986",
            "1992",
            "2000"
            ],
            correctAnswer: 1,
            explanation: "The Environmental Protection Act was passed in 1986 in the wake of the Bhopal Gas Tragedy.",
            difficulty: "Medium",
            category: "Environment"
        },
        {
            id: 52,
            question: "Which one of the following schedules of the Indian Constitution contains the languages recognized by the government?",
            options: [
            "7th Schedule",
            "8th Schedule",
            "9th Schedule",
            "10th Schedule"
            ],
            correctAnswer: 1,
            explanation: "The 8th Schedule of the Constitution lists the official languages recognized by the Government of India.",
            difficulty: "Medium",
            category: "Polity"
        },
        {
            id: 53,
            question: "Which biosphere reserve in India is a part of the UNESCO World Network?",
            options: [
            "Manas",
            "Nanda Devi",
            "Sundarbans",
            "Nokrek"
            ],
            correctAnswer: 2,
            explanation: "The Sundarbans is a UNESCO World Heritage Site and a major biosphere reserve in India.",
            difficulty: "Medium",
            category: "Environment"
        },
        {
            id: 54,
            question: "Which of the following is a major cause of acid rain?",
            options: [
            "Carbon dioxide",
            "Sulfur dioxide and nitrogen oxides",
            "Methane",
            "Ozone"
            ],
            correctAnswer: 1,
            explanation: "Sulfur dioxide and nitrogen oxides react with water in the atmosphere to form acids, causing acid rain.",
            difficulty: "Medium",
            category: "Environment"
        },
        {
            id: 55,
            question: "The 'Zamindari System' was introduced in India under the rule of which Governor-General?",
            options: [
            "Lord Dalhousie",
            "Lord Wellesley",
            "Lord Cornwallis",
            "Lord Curzon"
            ],
            correctAnswer: 2,
            explanation: "Lord Cornwallis introduced the Permanent Settlement in Bengal in 1793, establishing the Zamindari System.",
            difficulty: "Medium",
            category: "History"
        },
        {
            id: 56,
            question: "Which type of soil is ideal for cotton cultivation in India?",
            options: [
            "Laterite soil",
            "Alluvial soil",
            "Black soil",
            "Red soil"
            ],
            correctAnswer: 2,
            explanation: "Black soil, also known as Regur soil, retains moisture and is ideal for cotton farming.",
            difficulty: "Medium",
            category: "Geography / Agriculture"
        },
        {
            id: 57,
            question: "Which of the following statements is true regarding the Rajya Sabha?",
            options: [
            "It can be dissolved by the President.",
            "It is a permanent body.",
            "It is elected directly by the people.",
            "It controls the finance bill."
            ],
            correctAnswer: 1,
            explanation: "Rajya Sabha is a permanent house; one-third of its members retire every two years.",
            difficulty: "Medium",
            category: "Polity"
        },
        {
            id: 58,
            question: "Which mountain pass connects Srinagar to Leh?",
            options: [
            "Nathu La",
            "Rohtang Pass",
            "Zoji La",
            "Shipki La"
            ],
            correctAnswer: 2,
            explanation: "Zoji La is a strategic pass in the Himalayas connecting Srinagar to Leh.",
            difficulty: "Medium",
            category: "Geography"
        },
        {
            id: 59,
            question: "Which Indian city is known as the 'Manchester of South India'?",
            options: [
            "Hyderabad",
            "Coimbatore",
            "Madurai",
            "Chennai"
            ],
            correctAnswer: 1,
            explanation: "Coimbatore is known as the 'Manchester of South India' due to its extensive textile industry.",
            difficulty: "Medium",
            category: "Geography / Economy"
        },
        {
            id: 60,
            question: "Who among the following was the first woman Governor of an Indian state?",
            options: [
            "Indira Gandhi",
            "Sarojini Naidu",
            "Vijaya Lakshmi Pandit",
            "Sucheta Kripalani"
            ],
            correctAnswer: 1,
            explanation: "Sarojini Naidu was the first woman Governor of an Indian state (United Provinces, now Uttar Pradesh).",
            difficulty: "Medium",
            category: "History / Polity"
        },
        {
            id: 61,
            question: "Which Article of the Indian Constitution deals with the Uniform Civil Code?",
            options: [
            "Article 40",
            "Article 44",
            "Article 51",
            "Article 32"
            ],
            correctAnswer: 1,
            explanation: "Article 44 under the Directive Principles of State Policy mentions the Uniform Civil Code.",
            difficulty: "Medium",
            category: "Polity"
        },
        {
            id: 62,
            question: "The Tropic of Cancer passes through how many Indian states?",
            options: [
            "6",
            "7",
            "8",
            "9"
            ],
            correctAnswer: 3,
            explanation: "The Tropic of Cancer passes through 9 Indian states from Gujarat to Mizoram.",
            difficulty: "Medium",
            category: "Geography"
        },
        {
            id: 63,
            question: "Which of the following is a reason for the rise of extremism in the Indian freedom struggle?",
            options: [
            "Partition of Bengal",
            "First Round Table Conference",
            "Cabinet Mission Plan",
            "Simon Commission"
            ],
            correctAnswer: 0,
            explanation: "The partition of Bengal in 1905 by Lord Curzon ignited widespread protests and gave rise to extremist politics.",
            difficulty: "Medium",
            category: "History"
        },
        {
            id: 64,
            question: "Which Indian wildlife sanctuary is famous for one-horned rhinoceros?",
            options: [
            "Gir National Park",
            "Sundarbans",
            "Kaziranga National Park",
            "Corbett National Park"
            ],
            correctAnswer: 2,
            explanation: "Kaziranga National Park in Assam is renowned for its population of one-horned rhinoceroses.",
            difficulty: "Medium",
            category: "Environment"
        },
        {
            id: 65,
            question: "Which fundamental right is protected under Article 21 of the Indian Constitution?",
            options: [
            "Right to Education",
            "Right to Equality",
            "Right to Freedom of Religion",
            "Right to Life and Personal Liberty"
            ],
            correctAnswer: 3,
            explanation: "Article 21 guarantees the right to life and personal liberty to all individuals.",
            difficulty: "Medium",
            category: "Polity"
        },
        {
            id: 66,
            question: "Who was the founder of the 'Servants of India Society'?",
            options: [
            "Gopal Krishna Gokhale",
            "Bal Gangadhar Tilak",
            "Mahatma Gandhi",
            "Dadabhai Naoroji"
            ],
            correctAnswer: 0,
            explanation: "Gopal Krishna Gokhale founded the Servants of India Society in 1905 to train people for social service.",
            difficulty: "Medium",
            category: "History"
        },
        {
            id: 67,
            question: "Which of the following rivers originates from Amarkantak plateau?",
            options: [
            "Godavari",
            "Narmada",
            "Krishna",
            "Yamuna"
            ],
            correctAnswer: 1,
            explanation: "The Narmada River originates from the Amarkantak plateau in Madhya Pradesh.",
            difficulty: "Medium",
            category: "Geography"
        },
        {
            id: 68,
            question: "Which schedule of the Indian Constitution deals with the anti-defection law?",
            options: [
            "8th Schedule",
            "9th Schedule",
            "10th Schedule",
            "11th Schedule"
            ],
            correctAnswer: 2,
            explanation: "The 10th Schedule, added by the 52nd Amendment Act of 1985, deals with the anti-defection law.",
            difficulty: "Medium",
            category: "Polity"
        },
        {
            id: 69,
            question: "Which of the following is a warm ocean current?",
            options: [
            "Labrador Current",
            "Humboldt Current",
            "Canary Current",
            "Kuroshio Current"
            ],
            correctAnswer: 3,
            explanation: "The Kuroshio Current is a warm ocean current flowing in the North Pacific Ocean.",
            difficulty: "Medium",
            category: "Geography"
        },
        {
            id: 70,
            question: "The term 'Green GDP' refers to:",
            options: [
            "GDP measured without inflation",
            "GDP including environmental costs",
            "GDP from agriculture",
            "GDP excluding exports"
            ],
            correctAnswer: 1,
            explanation: "Green GDP accounts for the environmental degradation and depletion of natural resources.",
            difficulty: "Medium",
            category: "Economy"
        },
        {
            id: 71,
            question: "The 'Poona Pact' was signed between:",
            options: [
            "Gandhi and Nehru",
            "Gandhi and Ambedkar",
            "Nehru and Jinnah",
            "Jinnah and Ambedkar"
            ],
            correctAnswer: 1,
            explanation: "The Poona Pact of 1932 was signed between Mahatma Gandhi and Dr. B.R. Ambedkar over the issue of separate electorates for Dalits.",
            difficulty: "Medium",
            category: "History"
        },
        {
            id: 72,
            question: "The 'Chilika Lake' is located in which state?",
            options: [
            "West Bengal",
            "Odisha",
            "Andhra Pradesh",
            "Tamil Nadu"
            ],
            correctAnswer: 1,
            explanation: "Chilika Lake, Asia's largest brackish water lagoon, is located in Odisha.",
            difficulty: "Medium",
            category: "Geography"
        },
        {
            id: 73,
            question: "Which of the following is not a part of the Fundamental Duties listed in the Constitution?",
            options: [
            "Promote scientific temper",
            "Protect environment",
            "Abolish untouchability",
            "Respect national symbols"
            ],
            correctAnswer: 2,
            explanation: "Abolition of untouchability is a Fundamental Right under Article 17, not a Fundamental Duty.",
            difficulty: "Medium",
            category: "Polity"
        },
        {
            id: 74,
            question: "Who among the following gave the concept of 'Drain of Wealth' from India?",
            options: [
            "Gopal Krishna Gokhale",
            "Dadabhai Naoroji",
            "Mahatma Gandhi",
            "Jawaharlal Nehru"
            ],
            correctAnswer: 1,
            explanation: "Dadabhai Naoroji developed the 'Drain Theory' in his book 'Poverty and Un-British Rule in India'.",
            difficulty: "Medium",
            category: "History"
        },
        {
            id: 75,
            question: "Which of the following is an example of a biofertilizer?",
            options: [
            "Urea",
            "Ammonium nitrate",
            "Azotobacter",
            "Superphosphate"
            ],
            correctAnswer: 2,
            explanation: "Azotobacter is a microorganism used as a biofertilizer, especially in nitrogen fixation.",
            difficulty: "Medium",
            category: "Environment / Science"
        },
        {
            id: 76,
            question: "Which of the following Acts introduced the principle of 'Diarchy' in the provinces of British India?",
            options: [
            "The Indian Councils Act, 1909",
            "The Government of India Act, 1919",
            "The Government of India Act, 1935",
            "The Indian Independence Act, 1947"
            ],
            correctAnswer: 1,
            explanation: "The Government of India Act, 1919 introduced Diarchy in the provincial governments, dividing subjects into reserved and transferred categories.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 77,
            question: "The Ninth Schedule of the Indian Constitution was introduced by which Constitutional Amendment?",
            options: [
            "First Amendment",
            "Seventh Amendment",
            "Forty-second Amendment",
            "Fifty-second Amendment"
            ],
            correctAnswer: 0,
            explanation: "The Ninth Schedule was added by the First Constitutional Amendment in 1951 to protect land reform laws from judicial review.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 78,
            question: "Which of the following pairs is correctly matched with respect to the source of Indian Constitution?",
            options: [
            "Directive Principles — American Constitution",
            "Parliamentary System — Canadian Constitution",
            "Emergency Powers — Weimar Constitution",
            "Fundamental Duties — Russian Constitution"
            ],
            correctAnswer: 3,
            explanation: "Fundamental Duties were inspired by the Constitution of the former USSR (now Russia).",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 79,
            question: "In which case did the Supreme Court propound the 'Doctrine of Basic Structure' of the Constitution?",
            options: [
            "Golaknath v. State of Punjab",
            "Kesavananda Bharati v. State of Kerala",
            "Minerva Mills v. Union of India",
            "Shankari Prasad v. Union of India"
            ],
            correctAnswer: 1,
            explanation: "The Kesavananda Bharati case (1973) established the Basic Structure Doctrine, limiting Parliament’s power to amend the Constitution.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 80,
            question: "Which river system does the Subansiri river belong to?",
            options: [
            "Ganga",
            "Indus",
            "Brahmaputra",
            "Godavari"
            ],
            correctAnswer: 2,
            explanation: "The Subansiri River is a major tributary of the Brahmaputra River, flowing through Arunachal Pradesh and Assam.",
            difficulty: "Hard",
            category: "Geography"
        },
        {
            id: 81,
            question: "Who was the Viceroy of India when the Rowlatt Act was passed?",
            options: [
            "Lord Hardinge",
            "Lord Chelmsford",
            "Lord Irwin",
            "Lord Reading"
            ],
            correctAnswer: 1,
            explanation: "The Rowlatt Act was passed in 1919 during the tenure of Lord Chelmsford.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 82,
            question: "Which of the following regions is most associated with the 'Regur' soil type?",
            options: [
            "Indo-Gangetic Plains",
            "Eastern Ghats",
            "Deccan Plateau",
            "Western Himalayas"
            ],
            correctAnswer: 2,
            explanation: "Regur or black soil is predominantly found in the Deccan Plateau and is ideal for cotton cultivation.",
            difficulty: "Hard",
            category: "Geography"
        },
        {
            id: 83,
            question: "Which Article of the Constitution allows the Parliament to form new states or alter the boundaries of existing states?",
            options: [
            "Article 1",
            "Article 2",
            "Article 3",
            "Article 4"
            ],
            correctAnswer: 2,
            explanation: "Article 3 empowers Parliament to form new states and alter the areas, boundaries, or names of existing states.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 84,
            question: "Which Buddhist council is associated with the division of Buddhism into Hinayana and Mahayana?",
            options: [
            "First Buddhist Council",
            "Second Buddhist Council",
            "Third Buddhist Council",
            "Fourth Buddhist Council"
            ],
            correctAnswer: 3,
            explanation: "The Fourth Buddhist Council held under Kanishka’s patronage led to the formal division between Hinayana and Mahayana sects.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 85,
            question: "Which of the following national parks is part of a transboundary biosphere reserve?",
            options: [
            "Sundarbans National Park",
            "Jim Corbett National Park",
            "Gir National Park",
            "Bandipur National Park"
            ],
            correctAnswer: 0,
            explanation: "Sundarbans National Park in India forms part of the transboundary Sundarbans Biosphere Reserve with Bangladesh.",
            difficulty: "Hard",
            category: "Environment"
        },
        {
            id: 86,
            question: "Which schedule of the Indian Constitution provides for the disqualification of MLAs on the ground of defection?",
            options: [
            "7th Schedule",
            "8th Schedule",
            "9th Schedule",
            "10th Schedule"
            ],
            correctAnswer: 3,
            explanation: "The 10th Schedule contains provisions related to disqualification on grounds of defection (Anti-Defection Law).",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 87,
            question: "Which tribe is associated with the 'Dhokra' metal craft tradition in India?",
            options: [
            "Santhal",
            "Gond",
            "Bhil",
            "Bastar"
            ],
            correctAnswer: 3,
            explanation: "The Bastar tribes in Chhattisgarh are renowned for their traditional Dhokra (lost-wax) metal casting craft.",
            difficulty: "Hard",
            category: "Culture"
        },
        {
            id: 88,
            question: "Which plan was also known as the 'Gadgil Yojana'?",
            options: [
            "Second Five Year Plan",
            "Third Five Year Plan",
            "Fourth Five Year Plan",
            "Fifth Five Year Plan"
            ],
            correctAnswer: 2,
            explanation: "The Fourth Five Year Plan is also known as the Gadgil Yojana, focusing on growth with stability and progressive achievement of self-reliance.",
            difficulty: "Hard",
            category: "Economy"
        },
        {
            id: 89,
            question: "Which Indian scientist is credited with the invention of the first practical radar system?",
            options: [
            "C.V. Raman",
            "Homi Bhabha",
            "Meghnad Saha",
            "Sir J.C. Bose"
            ],
            correctAnswer: 3,
            explanation: "Sir J.C. Bose pioneered the use of radio waves and demonstrated their use in detecting metallic objects, laying the foundation for radar technology.",
            difficulty: "Hard",
            category: "Science & Tech"
        },
        {
            id: 90,
            question: "Which of the following is NOT a feature of the 'PESA Act' (1996)?",
            options: [
            "Empowers Gram Sabhas in Scheduled Areas",
            "Applicable to all states of India",
            "Provides for tribal self-rule",
            "Recognizes traditional rights of tribal communities"
            ],
            correctAnswer: 1,
            explanation: "The PESA Act is applicable only to Scheduled Areas under the Fifth Schedule and not to all states.",
            difficulty: "Hard",
            category: "Governance"
        },
        {
            id: 91,
            question: "The term 'Petrichor' is best described as:",
            options: [
            "A type of volcanic rock",
            "Smell of the earth after rain",
            "A type of monsoon wind",
            "A mineral found in meteorites"
            ],
            correctAnswer: 1,
            explanation: "'Petrichor' refers to the earthy scent produced when rain falls on dry soil. The term was coined by two Australian scientists in 1964.",
            difficulty: "Hard",
            category: "Science & Tech"
        },
        {
            id: 92,
            question: "Which of the following reports is published by the World Economic Forum?",
            options: [
            "World Development Report",
            "Global Gender Gap Report",
            "World Investment Report",
            "World Happiness Report"
            ],
            correctAnswer: 1,
            explanation: "The Global Gender Gap Report is published annually by the World Economic Forum, measuring gender disparities across countries.",
            difficulty: "Hard",
            category: "Current Affairs"
        },
        {
            id: 93,
            question: "Which of the following civilizations is associated with the dockyard at Lothal?",
            options: [
            "Mesopotamian Civilization",
            "Egyptian Civilization",
            "Indus Valley Civilization",
            "Minoan Civilization"
            ],
            correctAnswer: 2,
            explanation: "Lothal, located in Gujarat, is one of the prominent cities of the Indus Valley Civilization, known for its advanced dockyard system.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 94,
            question: "Which of the following Articles of the Constitution of India safeguards the rights of linguistic minorities?",
            options: [
            "Article 14",
            "Article 29",
            "Article 21",
            "Article 32"
            ],
            correctAnswer: 1,
            explanation: "Article 29 protects the cultural and educational rights of minorities, including linguistic minorities.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 95,
            question: "Which Indian personality presided over the first session of the All India Trade Union Congress in 1920?",
            options: [
            "Lala Lajpat Rai",
            "Bipin Chandra Pal",
            "Subhas Chandra Bose",
            "B.R. Ambedkar"
            ],
            correctAnswer: 0,
            explanation: "Lala Lajpat Rai was the first President of the All India Trade Union Congress (AITUC), founded in 1920 in Bombay.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 96,
            question: "Which of the following rivers is NOT a tributary of the Indus River?",
            options: [
            "Chenab",
            "Beas",
            "Ravi",
            "Sutlej"
            ],
            correctAnswer: 1,
            explanation: "The Beas river joins the Sutlej and does not directly flow into the Indus River, unlike the other listed rivers.",
            difficulty: "Hard",
            category: "Geography"
        },
        {
            id: 97,
            question: "The 'Nutrient Based Subsidy (NBS)' policy in India is applicable to:",
            options: [
            "Cereals",
            "Pulses",
            "Fertilizers",
            "Fruits and Vegetables"
            ],
            correctAnswer: 2,
            explanation: "Nutrient Based Subsidy (NBS) policy is used to provide subsidies for phosphatic and potassic fertilizers based on nutrient content.",
            difficulty: "Hard",
            category: "Economy"
        },
        {
            id: 98,
            question: "Which of the following was a major objective of the Cripps Mission (1942)?",
            options: [
            "To offer full independence to India",
            "To seek Indian cooperation in the war effort",
            "To finalize partition of India",
            "To establish a federal structure"
            ],
            correctAnswer: 1,
            explanation: "The Cripps Mission was sent to secure Indian support for the British war effort during World War II, offering post-war self-governance.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 99,
            question: "Which of the following organizations releases the 'Ease of Doing Business Index'?",
            options: [
            "World Bank",
            "International Monetary Fund",
            "World Economic Forum",
            "United Nations Development Programme"
            ],
            correctAnswer: 0,
            explanation: "The Ease of Doing Business Index was published by the World Bank until it was discontinued in 2021.",
            difficulty: "Hard",
            category: "Economy"
        },
        {
            id: 100,
            question: "The 'Doctrine of Lapse' was officially introduced by:",
            options: [
            "Lord Dalhousie",
            "Lord Wellesley",
            "Lord Canning",
            "Lord Ripon"
            ],
            correctAnswer: 0,
            explanation: "Lord Dalhousie introduced the Doctrine of Lapse, under which princely states without a male heir were annexed by the British.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 101,
            question: "Which of the following committees recommended the abolition of the Planning Commission?",
            options: [
            "Rangarajan Committee",
            "NITI Aayog Panel",
            "Narendra Modi Cabinet Decision",
            "None of the above"
            ],
            correctAnswer: 3,
            explanation: "No formal committee recommended it; the Planning Commission was replaced by NITI Aayog through a cabinet decision in 2015.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 102,
            question: "Which atmospheric layer is responsible for the reflection of radio waves back to Earth?",
            options: [
            "Troposphere",
            "Stratosphere",
            "Ionosphere",
            "Mesosphere"
            ],
            correctAnswer: 2,
            explanation: "The ionosphere reflects certain radio frequencies back to Earth, enabling long-distance radio communication.",
            difficulty: "Hard",
            category: "Science & Tech"
        },
        {
            id: 103,
            question: "The 'Kyoto Protocol' is related to which of the following?",
            options: [
            "Wetlands Conservation",
            "Ozone Layer Protection",
            "Climate Change Mitigation",
            "Nuclear Weapons Control"
            ],
            correctAnswer: 2,
            explanation: "The Kyoto Protocol is an international treaty that commits state parties to reduce greenhouse gas emissions.",
            difficulty: "Hard",
            category: "Environment"
        },
        {
            id: 104,
            question: "The Moplah Rebellion of 1921 occurred in which present-day state?",
            options: [
            "Tamil Nadu",
            "Karnataka",
            "Kerala",
            "Andhra Pradesh"
            ],
            correctAnswer: 2,
            explanation: "The Moplah Rebellion was an armed uprising of Mappila Muslims in the Malabar region of present-day Kerala.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 105,
            question: "Which of the following was the first Indian state to enact the Right to Information Act before the central law?",
            options: [
            "Tamil Nadu",
            "Kerala",
            "Maharashtra",
            "Rajasthan"
            ],
            correctAnswer: 0,
            explanation: "Tamil Nadu was the first Indian state to enact a state-level Right to Information Act in 1997, before the central RTI Act of 2005.",
            difficulty: "Hard",
            category: "Governance"
        },
        {
            id: 106,
            question: "In the context of Indian polity, what is the significance of the 'Doctrine of Eclipse'?",
            options: [
            "A law inconsistent with Fundamental Rights becomes void ab initio",
            "Only future laws can be declared unconstitutional",
            "A pre-constitutional law inconsistent with Fundamental Rights is not void ab initio but becomes inactive",
            "Any unconstitutional law is permanently struck down"
            ],
            correctAnswer: 2,
            explanation: "Doctrine of Eclipse holds that a pre-constitutional law inconsistent with Fundamental Rights is not void ab initio but remains dormant until the inconsistency is removed.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 107,
            question: "Which Indian classical dance form originated from the temples of Tamil Nadu and is known for its fixed upper torso and bent legs?",
            options: [
            "Kathak",
            "Odissi",
            "Manipuri",
            "Bharatanatyam"
            ],
            correctAnswer: 3,
            explanation: "Bharatanatyam is one of the oldest classical dance forms, originating from Tamil Nadu, characterized by fixed upper torso, bent legs, and intricate footwork.",
            difficulty: "Hard",
            category: "Art & Culture"
        },
        {
            id: 108,
            question: "Which of the following best describes the concept of 'Stagflation'?",
            options: [
            "High inflation with high unemployment and stagnant demand",
            "Low inflation with low unemployment",
            "Rising GDP with inflation",
            "Economic boom with deflation"
            ],
            correctAnswer: 0,
            explanation: "Stagflation is a situation where the economy experiences stagnant growth, high unemployment, and high inflation simultaneously.",
            difficulty: "Hard",
            category: "Economy"
        },
        {
            id: 109,
            question: "The 'Man and the Biosphere Programme' is an initiative of which international organization?",
            options: [
            "United Nations Environment Programme (UNEP)",
            "World Wide Fund for Nature (WWF)",
            "UNESCO",
            "International Union for Conservation of Nature (IUCN)"
            ],
            correctAnswer: 2,
            explanation: "The Man and the Biosphere Programme is a UNESCO initiative to promote sustainable development based on local community efforts and sound science.",
            difficulty: "Hard",
            category: "Environment"
        },
        {
            id: 110,
            question: "Which of the following statements about the Rowlatt Act of 1919 is correct?",
            options: [
            "It granted legislative powers to Indian provinces",
            "It allowed detention of political prisoners without trial",
            "It repealed the Vernacular Press Act",
            "It initiated the Non-Cooperation Movement"
            ],
            correctAnswer: 1,
            explanation: "The Rowlatt Act authorized the British government to detain individuals without trial, leading to nationwide protests and the Jallianwala Bagh massacre.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 111,
            question: "Which mountain pass connects the Indian state of Sikkim with Tibet?",
            options: [
            "Nathu La",
            "Rohtang Pass",
            "Zoji La",
            "Khardung La"
            ],
            correctAnswer: 0,
            explanation: "Nathu La is a strategically important pass on the Indo-China border, connecting Sikkim with Tibet Autonomous Region of China.",
            difficulty: "Hard",
            category: "Geography"
        },
        {
            id: 112,
            question: "Which among the following was the capital of the Pallava dynasty?",
            options: [
            "Madurai",
            "Kanchipuram",
            "Thanjavur",
            "Ujjain"
            ],
            correctAnswer: 1,
            explanation: "Kanchipuram was the capital of the Pallava dynasty and a renowned center of learning and architecture.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 113,
            question: "The expression ‘Scheduled Area’ in the Indian Constitution appears in which Article?",
            options: [
            "Article 244",
            "Article 275",
            "Article 330",
            "Article 338"
            ],
            correctAnswer: 0,
            explanation: "Article 244 provides for the administration of Scheduled Areas and Tribal Areas under the Fifth and Sixth Schedules of the Constitution.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 114,
            question: "Which of the following rivers is NOT a part of the Krishna River system?",
            options: [
            "Bhima",
            "Tungabhadra",
            "Musii",
            "Ghataprabha"
            ],
            correctAnswer: 2,
            explanation: "Musii River is a tributary of River Musi (not Krishna), which flows through Hyderabad and is not part of the Krishna River system.",
            difficulty: "Hard",
            category: "Geography"
        },
        {
            id: 115,
            question: "Which of the following gases is used as a refrigerant and also contributes significantly to ozone depletion?",
            options: [
            "Carbon Dioxide",
            "Methane",
            "Chlorofluorocarbons (CFCs)",
            "Nitrous Oxide"
            ],
            correctAnswer: 2,
            explanation: "Chlorofluorocarbons (CFCs) were widely used as refrigerants and are known to deplete the ozone layer in the stratosphere.",
            difficulty: "Hard",
            category: "Environment"
        },
        {
            id: 116,
            question: "The term 'Cloudburst' is best defined as:",
            options: [
            "A sudden increase in atmospheric pressure",
            "A sudden and heavy rainfall in a localized area",
            "Condensation of clouds over deserts",
            "Lightning-induced rainfall"
            ],
            correctAnswer: 1,
            explanation: "A cloudburst is an extreme amount of precipitation in a short period, often leading to flash floods in hilly areas.",
            difficulty: "Hard",
            category: "Geography"
        },
        {
            id: 117,
            question: "Who among the following was the first woman judge to be appointed to the Supreme Court of India?",
            options: [
            "Justice Ruma Pal",
            "Justice Fathima Beevi",
            "Justice Leila Seth",
            "Justice Indu Malhotra"
            ],
            correctAnswer: 1,
            explanation: "Justice Fathima Beevi was the first woman judge of the Supreme Court of India, appointed in 1989.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 118,
            question: "The term ‘Carbon Credit’ refers to:",
            options: [
            "Permission to produce a certain amount of carbon emissions",
            "A type of tax on carbon-based fuels",
            "Loans given for green energy projects",
            "Government bonds issued to promote green economy"
            ],
            correctAnswer: 0,
            explanation: "A carbon credit is a permit that allows a country or organization to emit a certain amount of carbon dioxide or other greenhouse gases.",
            difficulty: "Hard",
            category: "Environment"
        },
        {
            id: 119,
            question: "Which of the following battles led to the establishment of Mughal rule in India?",
            options: [
            "Battle of Plassey",
            "Battle of Haldighati",
            "First Battle of Panipat",
            "Second Battle of Tarain"
            ],
            correctAnswer: 2,
            explanation: "The First Battle of Panipat (1526) between Babur and Ibrahim Lodi resulted in the establishment of the Mughal Empire in India.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 120,
            question: "The 'Li-Fi' technology is primarily used for:",
            options: [
            "Underwater communication",
            "Light-based data transmission",
            "GPS tracking",
            "Cybersecurity"
            ],
            correctAnswer: 1,
            explanation: "Li-Fi (Light Fidelity) is a wireless communication technology which uses light to transmit data and is considered faster than Wi-Fi in ideal conditions.",
            difficulty: "Hard",
            category: "Science & Tech"
        },
        {
            id: 121,
            question: "Which of the following provisions in the Constitution of India is aimed at protecting the interests of Scheduled Tribes?",
            options: [
            "Article 21",
            "Article 275",
            "Article 370",
            "Article 19"
            ],
            correctAnswer: 1,
            explanation: "Article 275 provides for the grant of special funds from the Consolidated Fund of India to promote the welfare of Scheduled Tribes.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 122,
            question: "Which among the following was NOT a feature of the Permanent Settlement of Bengal?",
            options: [
            "Revenue was fixed permanently",
            "Zamindars were made proprietors of the land",
            "The State had the right to enhance the revenue",
            "Zamindars were expected to improve agriculture"
            ],
            correctAnswer: 2,
            explanation: "Under Permanent Settlement, the revenue was fixed and could not be increased by the British government, making option 3 incorrect.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 123,
            question: "Which of the following is the correct descending order of tiger population density in Indian states as per recent estimates?",
            options: [
            "Madhya Pradesh > Karnataka > Uttarakhand > Maharashtra",
            "Karnataka > Madhya Pradesh > Uttarakhand > Tamil Nadu",
            "Madhya Pradesh > Maharashtra > Karnataka > Chhattisgarh",
            "Uttarakhand > Karnataka > Madhya Pradesh > Kerala"
            ],
            correctAnswer: 0,
            explanation: "Madhya Pradesh leads in tiger population, followed by Karnataka, Uttarakhand, and Maharashtra as per the latest tiger census.",
            difficulty: "Hard",
            category: "Environment"
        },
        {
            id: 124,
            question: "The term 'G-77' often seen in news refers to:",
            options: [
            "A group of developing countries in the UN",
            "A group of oil-exporting nations",
            "A climate alliance within the EU",
            "A trade bloc led by China"
            ],
            correctAnswer: 0,
            explanation: "G-77 is a coalition of developing nations within the UN that promotes collective economic interests and enhanced joint negotiating capacity.",
            difficulty: "Hard",
            category: "International Affairs"
        },
        {
            id: 125,
            question: "Which of the following best defines 'Net Neutrality'?",
            options: [
            "Charging equal tariff for all internet users",
            "Prohibiting censorship of online content",
            "Equal treatment of all internet data by service providers",
            "Providing internet access to all citizens"
            ],
            correctAnswer: 2,
            explanation: "Net Neutrality ensures that ISPs treat all data on the internet equally, without discrimination or charging differently by user or content.",
            difficulty: "Hard",
            category: "Science & Tech"
        },
        {
            id: 126,
            question: "Which of the following statements best describes the 'Monetary Policy Committee (MPC)' of India?",
            options: [
            "It prepares the Union Budget",
            "It is responsible for determining the tax rates",
            "It decides the benchmark interest rate to contain inflation",
            "It governs fiscal deficit targets"
            ],
            correctAnswer: 2,
            explanation: "The MPC is a six-member committee constituted by the Government of India to fix the benchmark interest rate to contain inflation.",
            difficulty: "Hard",
            category: "Economy"
        },
        {
            id: 127,
            question: "Which of the following correctly describes the 'Doctrine of Pith and Substance'?",
            options: [
            "Parliament can legislate on State List during emergency",
            "Centre can override State laws in national interest",
            "Subject matter is judged by its essential nature when legislative powers overlap",
            "The President can dissolve State Assemblies"
            ],
            correctAnswer: 2,
            explanation: "Doctrine of Pith and Substance is used to determine under which list a law falls when there is a conflict due to overlapping legislation.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 128,
            question: "Which one of the following best describes the term 'Tropic of Cancer' in the Indian context?",
            options: [
            "A line dividing Northern and Southern India",
            "Latitude that passes through maximum number of Indian states",
            "Boundary between Eastern and Western Ghats",
            "Latitude that marks the beginning of the monsoon"
            ],
            correctAnswer: 1,
            explanation: "The Tropic of Cancer passes through 8 Indian states, making it the latitude that traverses through maximum Indian states.",
            difficulty: "Hard",
            category: "Geography"
        },
        {
            id: 129,
            question: "Which Indian leader authored the book 'Hind Swaraj'?",
            options: [
            "Bal Gangadhar Tilak",
            "Mahatma Gandhi",
            "Subhas Chandra Bose",
            "Gopal Krishna Gokhale"
            ],
            correctAnswer: 1,
            explanation: "Mahatma Gandhi wrote 'Hind Swaraj' in 1909, outlining his vision of Indian self-rule and nonviolent resistance.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 130,
            question: "Which of the following sectors contributes the most to India's GDP currently (as of latest estimates)?",
            options: [
            "Agriculture",
            "Industry",
            "Services",
            "Mining"
            ],
            correctAnswer: 2,
            explanation: "The Services sector is the largest contributor to India’s GDP, accounting for more than 50% of the total.",
            difficulty: "Hard",
            category: "Economy"
        },
        {
            id: 131,
            question: "The 'Fourth Schedule' of the Indian Constitution deals with:",
            options: [
            "Allocation of seats in the Rajya Sabha",
            "Languages",
            "Anti-defection provisions",
            "Union and State lists"
            ],
            correctAnswer: 0,
            explanation: "The Fourth Schedule of the Indian Constitution deals with the allocation of seats to States and Union Territories in the Rajya Sabha.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 132,
            question: "Which among the following is a Ramsar site known for being India’s largest brackish water lagoon?",
            options: [
            "Wular Lake",
            "Chilika Lake",
            "Sambhar Lake",
            "Pulicat Lake"
            ],
            correctAnswer: 1,
            explanation: "Chilika Lake in Odisha is the largest brackish water lagoon in India and is recognized as a Ramsar site for its biodiversity.",
            difficulty: "Hard",
            category: "Environment"
        },
        {
            id: 133,
            question: "Which one of the following planets has the longest day (i.e., rotation period)?",
            options: [
            "Mercury",
            "Venus",
            "Mars",
            "Jupiter"
            ],
            correctAnswer: 1,
            explanation: "Venus has the longest day among all planets in the solar system; one rotation takes about 243 Earth days.",
            difficulty: "Hard",
            category: "Science & Tech"
        },
        {
            id: 134,
            question: "In the context of ancient Indian education, which of the following statements is correct about 'Nalanda'?",
            options: [
            "It was a Vedic gurukul for military training",
            "It was a Buddhist monastic university supported by the Mauryas",
            "It was a Brahminical seminary located in South India",
            "It was established by the Gupta emperor Kumaragupta"
            ],
            correctAnswer: 3,
            explanation: "Nalanda University was a renowned Buddhist center of learning, established during the reign of Gupta emperor Kumaragupta I.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 135,
            question: "Which of the following phenomena causes the trade winds to deflect to the right in the Northern Hemisphere?",
            options: [
            "Coriolis force",
            "Gravitational pull",
            "Jet streams",
            "Monsoons"
            ],
            correctAnswer: 0,
            explanation: "Coriolis force, caused by Earth’s rotation, deflects winds to the right in the Northern Hemisphere and to the left in the Southern Hemisphere.",
            difficulty: "Hard",
            category: "Geography"
        },
        {
            id: 136,
            question: "Which of the following provisions is NOT a part of the Directive Principles of State Policy under the Indian Constitution?",
            options: [
            "Promotion of cooperative societies",
            "Uniform civil code",
            "Separation of judiciary from executive",
            "Right to education"
            ],
            correctAnswer: 3,
            explanation: "Right to education is a Fundamental Right under Article 21A, not a Directive Principle.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 137,
            question: "The 'Blue Economy' primarily refers to:",
            options: [
            "Deep-sea oil exploration",
            "Ocean-based economic activities",
            "Sustainable mountain tourism",
            "Marine defense infrastructure"
            ],
            correctAnswer: 1,
            explanation: "Blue Economy refers to the sustainable use of ocean resources for economic growth, improved livelihoods, and ocean ecosystem health.",
            difficulty: "Hard",
            category: "Economy"
        },
        {
            id: 138,
            question: "Which one of the following revolts was directly associated with the tribal community of the Santhals?",
            options: [
            "Kol Uprising",
            "Munda Rebellion",
            "Santhal Rebellion",
            "Bhil Revolt"
            ],
            correctAnswer: 2,
            explanation: "The Santhal Rebellion (1855-56) was led by the Santhal tribal community under the leadership of Sidhu and Kanhu.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 139,
            question: "Which of the following rivers does NOT originate in India?",
            options: [
            "Sutlej",
            "Yamuna",
            "Godavari",
            "Mahanadi"
            ],
            correctAnswer: 0,
            explanation: "Sutlej originates from Lake Rakshastal in Tibet, outside Indian territory.",
            difficulty: "Hard",
            category: "Geography"
        },
        {
            id: 140,
            question: "In the context of the carbon cycle, which of the following is the largest carbon sink?",
            options: [
            "Atmosphere",
            "Terrestrial plants",
            "Soil organic matter",
            "Oceans"
            ],
            correctAnswer: 3,
            explanation: "Oceans are the largest carbon sink, absorbing about 25-30% of global CO₂ emissions annually.",
            difficulty: "Hard",
            category: "Environment"
        },
        {
            id: 141,
            question: "Which Article of the Indian Constitution authorizes the Parliament to create a new State?",
            options: [
            "Article 2",
            "Article 3",
            "Article 5",
            "Article 368"
            ],
            correctAnswer: 1,
            explanation: "Article 3 empowers Parliament to form a new state or alter boundaries/names of existing states.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 142,
            question: "Which of the following pairs is correctly matched?",
            options: [
            "Dampa Tiger Reserve – Arunachal Pradesh",
            "Kawal Tiger Reserve – Telangana",
            "Namdapha Tiger Reserve – Meghalaya",
            "Nagarjunsagar Srisailam – Karnataka"
            ],
            correctAnswer: 1,
            explanation: "Kawal Tiger Reserve is located in Telangana. Other options are mismatched geographically.",
            difficulty: "Hard",
            category: "Environment"
        },
        {
            id: 143,
            question: "Which one of the following is not a part of the Bretton Woods system?",
            options: [
            "World Bank",
            "International Monetary Fund (IMF)",
            "World Trade Organization (WTO)",
            "Fixed exchange rate system"
            ],
            correctAnswer: 2,
            explanation: "WTO was established in 1995, long after the Bretton Woods system (1944).",
            difficulty: "Hard",
            category: "Economy"
        },
        {
            id: 144,
            question: "Which Mughal emperor issued the 'Farman' granting trade privileges to the British East India Company in Bengal?",
            options: [
            "Babur",
            "Aurangzeb",
            "Shah Jahan",
            "Farrukhsiyar"
            ],
            correctAnswer: 3,
            explanation: "Farrukhsiyar issued the 1717 Farman allowing duty-free trade in Bengal, aiding British economic expansion.",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 145,
            question: "Which one of the following regions is known as the ‘Roaring Forties’?",
            options: [
            "Latitudes between 30° and 40° N",
            "Latitudes between 40° and 50° N",
            "Latitudes between 40° and 50° S",
            "Latitudes between 50° and 60° S"
            ],
            correctAnswer: 2,
            explanation: "The Roaring Forties are strong westerly winds found in the Southern Hemisphere between latitudes 40° and 50°.",
            difficulty: "Hard",
            category: "Geography"
        },
        {
            id: 146,
            question: "Which among the following is the most abundant greenhouse gas in Earth’s atmosphere?",
            options: [
            "Methane",
            "Carbon dioxide",
            "Water vapor",
            "Nitrous oxide"
            ],
            correctAnswer: 2,
            explanation: "Water vapor is the most abundant greenhouse gas, though CO₂ and methane are more emphasized due to human activity.",
            difficulty: "Hard",
            category: "Environment"
        },
        {
            id: 147,
            question: "Which of the following bodies approves the Consolidated Fund expenditure in India?",
            options: [
            "Finance Commission",
            "Parliament",
            "Comptroller and Auditor General",
            "Reserve Bank of India"
            ],
            correctAnswer: 1,
            explanation: "All expenditures from the Consolidated Fund of India require parliamentary approval.",
            difficulty: "Hard",
            category: "Polity"
        },
        {
            id: 148,
            question: "Which of the following was a major feature of the Ryotwari System?",
            options: [
            "Revenue collection through Zamindars",
            "Group ownership of land",
            "Direct settlement with the cultivators",
            "Communal revenue sharing"
            ],
            correctAnswer: 2,
            explanation: "The Ryotwari System involved direct settlement between the British government and the ryots (cultivators).",
            difficulty: "Hard",
            category: "History"
        },
        {
            id: 149,
            question: "Which one of the following best describes the purpose of the ‘Montreal Protocol’?",
            options: [
            "To combat desertification",
            "To control air pollution",
            "To phase out ozone-depleting substances",
            "To reduce plastic waste"
            ],
            correctAnswer: 2,
            explanation: "The Montreal Protocol (1987) aims to phase out the production and use of substances that deplete the ozone layer.",
            difficulty: "Hard",
            category: "Environment"
        },
        {
            id: 150,
            question: "Which one of the following correctly explains the term 'Open Market Operations' used by the Reserve Bank of India?",
            options: [
            "Purchase and sale of foreign currency",
            "Auction of government securities",
            "Purchase and sale of government securities in the market",
            "Direct lending to state governments"
            ],
            correctAnswer: 2,
            explanation: "Open Market Operations refer to the RBI’s buying/selling of government securities to control liquidity and money supply.",
            difficulty: "Hard",
            category: "Economy"
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

        // Check if UpscPreVol1 access code exists and is valid
        if (data.accesscode && data.accesscode.UpscPreVol1) {
            const accessCodeData = data.accesscode.UpscPreVol1;
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
            'UpscPreVol1': {
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

        if (data.examanswers && data.examanswers.UpscPreVol1 && data.examanswers.UpscPreVol1.answers) {
            const savedAnswers = data.examanswers.UpscPreVol1.answers;
            
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
        return `UpscPreVol1-${randomPin}`;
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
                description: "Upsc Preliminary Vol - 1 Exam Access",
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
                                examType: 'UpscPreVol1'
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
                    examType: 'UpscPreVol1'
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
                examType: 'UpscPreVol1'
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
        doc.text('Upsc Preliminary Vol - 1: Mock Report', 10, 10);
        
        // Certificate Details
        doc.setFontSize(12);
        doc.text(`Certificate Number: ${examMetadata.certificateNumber}`, 10, 50);
        doc.text(`Exam Name: Upsc Preliminary Vol - 1`, 10, 60);
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
            doc.text('Upsc Preliminary Vol - 1: Mock Report', pageWidth / 2, 30, { align: 'right' });
    
            // Exam Details
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            let yPosition = 50;
    
            const addDetailLine = (label, value) => {
                doc.text(`${label}: ${value}`, margin, yPosition);
                yPosition += 10;
            };
    
            addDetailLine('Report Number', examMetadata.certificateNumber);
            addDetailLine('Exam Name', 'Upsc Preliminary Vol - 1');
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
            doc.text('Upsc Preliminary Vol - 1: Mock Report', pageWidth / 2, 30, { align: 'right' });
    
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
                <h1 style={{fontSize: 24}}><ScanSearch size={20} style={{marginTop: -5}} /> Upsc Preliminary Vol - 1</h1>
                <p><Play size={15} style={{marginTop: -3}} /> Upsc Preliminary Mock Exam</p>
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
                        <Disc size={18} /> Upsc Preliminary Vol - 1: Mock Exam
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
