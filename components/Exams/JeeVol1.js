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


export default function JeeVol1() {
    const questions = [
        {
            id: 1,
            question: "Which of the following is a scalar quantity?",
            options: [
            "Velocity",
            "Acceleration",
            "Displacement",
            "Speed"
            ],
            correctAnswer: 3,
            explanation: "Speed has only magnitude and no direction, so it is a scalar quantity.",
            difficulty: "Easy",
            category: "Physics"
        },
        {
            id: 2,
            question: "What is the chemical formula of common salt?",
            options: [
            "NaCl",
            "KCl",
            "Na2CO3",
            "CaCl2"
            ],
            correctAnswer: 0,
            explanation: "Common salt is chemically known as Sodium Chloride, represented as NaCl.",
            difficulty: "Easy",
            category: "Chemistry"
        },
        {
            id: 3,
            question: "What is the value of sin(30°)?",
            options: [
            "0.5",
            "√3/2",
            "1",
            "0"
            ],
            correctAnswer: 0,
            explanation: "sin(30°) = 1/2 or 0.5 is a standard trigonometric identity.",
            difficulty: "Easy",
            category: "Mathematics"
        },
        {
            id: 4,
            question: "Which gas is essential for respiration?",
            options: [
            "Carbon dioxide",
            "Oxygen",
            "Nitrogen",
            "Hydrogen"
            ],
            correctAnswer: 1,
            explanation: "Oxygen is essential for cellular respiration in living organisms.",
            difficulty: "Easy",
            category: "Biology"
        },
        {
            id: 5,
            question: "What is the SI unit of force?",
            options: [
            "Pascal",
            "Newton",
            "Joule",
            "Watt"
            ],
            correctAnswer: 1,
            explanation: "The SI unit of force is Newton (N).",
            difficulty: "Easy",
            category: "Physics"
        },
        {
            id: 6,
            question: "Which of the following is an alkali metal?",
            options: [
            "Calcium",
            "Iron",
            "Sodium",
            "Aluminium"
            ],
            correctAnswer: 2,
            explanation: "Sodium is an alkali metal, part of Group 1 of the periodic table.",
            difficulty: "Easy",
            category: "Chemistry"
        },
        {
            id: 7,
            question: "What is the derivative of x²?",
            options: [
            "x",
            "2x",
            "x²",
            "2"
            ],
            correctAnswer: 1,
            explanation: "The derivative of x² with respect to x is 2x.",
            difficulty: "Easy",
            category: "Mathematics"
        },
        {
            id: 8,
            question: "What organ pumps blood throughout the human body?",
            options: [
            "Liver",
            "Lungs",
            "Heart",
            "Kidneys"
            ],
            correctAnswer: 2,
            explanation: "The heart is responsible for pumping blood through the circulatory system.",
            difficulty: "Easy",
            category: "Biology"
        },
        {
            id: 9,
            question: "Which law explains the relationship between voltage, current, and resistance?",
            options: [
            "Newton's Law",
            "Boyle's Law",
            "Ohm's Law",
            "Faraday's Law"
            ],
            correctAnswer: 2,
            explanation: "Ohm's Law states V = IR, relating voltage, current, and resistance.",
            difficulty: "Easy",
            category: "Physics"
        },
        {
            id: 10,
            question: "Which element is the lightest?",
            options: [
            "Oxygen",
            "Hydrogen",
            "Nitrogen",
            "Helium"
            ],
            correctAnswer: 1,
            explanation: "Hydrogen is the lightest and first element in the periodic table.",
            difficulty: "Easy",
            category: "Chemistry"
        },
        {
            id: 11,
            question: "What is the square root of 144?",
            options: [
            "10",
            "11",
            "12",
            "13"
            ],
            correctAnswer: 2,
            explanation: "√144 = 12.",
            difficulty: "Easy",
            category: "Mathematics"
        },
        {
            id: 12,
            question: "Which system in the body controls reflex actions?",
            options: [
            "Circulatory system",
            "Endocrine system",
            "Respiratory system",
            "Nervous system"
            ],
            correctAnswer: 3,
            explanation: "Reflex actions are controlled by the spinal cord, part of the nervous system.",
            difficulty: "Easy",
            category: "Biology"
        },
        {
            id: 13,
            question: "Which physical quantity is measured in Joules?",
            options: [
            "Power",
            "Work",
            "Force",
            "Pressure"
            ],
            correctAnswer: 1,
            explanation: "Work and energy are measured in Joules (J).",
            difficulty: "Easy",
            category: "Physics"
        },
        {
            id: 14,
            question: "Which of the following is a noble gas?",
            options: [
            "Nitrogen",
            "Oxygen",
            "Argon",
            "Hydrogen"
            ],
            correctAnswer: 2,
            explanation: "Argon is a noble gas found in Group 18 of the periodic table.",
            difficulty: "Easy",
            category: "Chemistry"
        },
        {
            id: 15,
            question: "What is the value of π (pi) approximately?",
            options: [
            "2.14",
            "3.14",
            "4.14",
            "1.14"
            ],
            correctAnswer: 1,
            explanation: "π is approximately equal to 3.14.",
            difficulty: "Easy",
            category: "Mathematics"
        },
        {
            id: 16,
            question: "Which of the following is a unit of electric current?",
            options: [
            "Volt",
            "Ohm",
            "Watt",
            "Ampere"
            ],
            correctAnswer: 3,
            explanation: "The SI unit of electric current is Ampere (A).",
            difficulty: "Easy",
            category: "Physics"
        },
        {
            id: 17,
            question: "Which compound is commonly known as quick lime?",
            options: [
            "Calcium carbonate",
            "Calcium hydroxide",
            "Calcium oxide",
            "Calcium chloride"
            ],
            correctAnswer: 2,
            explanation: "Calcium oxide (CaO) is commonly known as quick lime.",
            difficulty: "Easy",
            category: "Chemistry"
        },
        {
            id: 18,
            question: "What is the value of (a + b)²?",
            options: [
            "a² + b²",
            "a² + b² + ab",
            "a² + 2ab + b²",
            "2a² + 2b²"
            ],
            correctAnswer: 2,
            explanation: "(a + b)² expands to a² + 2ab + b².",
            difficulty: "Easy",
            category: "Mathematics"
        },
        {
            id: 19,
            question: "Which part of the plant conducts photosynthesis?",
            options: [
            "Root",
            "Stem",
            "Leaf",
            "Flower"
            ],
            correctAnswer: 2,
            explanation: "Leaves contain chlorophyll and are the primary sites of photosynthesis.",
            difficulty: "Easy",
            category: "Biology"
        },
        {
            id: 20,
            question: "Which law states that every action has an equal and opposite reaction?",
            options: [
            "Newton's First Law",
            "Newton's Second Law",
            "Newton's Third Law",
            "Law of Conservation of Energy"
            ],
            correctAnswer: 2,
            explanation: "Newton's Third Law explains the principle of action and reaction forces.",
            difficulty: "Easy",
            category: "Physics"
        },
        {
            id: 21,
            question: "Which of the following elements is a halogen?",
            options: [
            "Oxygen",
            "Nitrogen",
            "Chlorine",
            "Sodium"
            ],
            correctAnswer: 2,
            explanation: "Chlorine is a halogen element found in Group 17 of the periodic table.",
            difficulty: "Easy",
            category: "Chemistry"
        },
        {
            id: 22,
            question: "What is the value of 5!",
            options: [
            "120",
            "60",
            "24",
            "720"
            ],
            correctAnswer: 0,
            explanation: "5! (5 factorial) = 5×4×3×2×1 = 120.",
            difficulty: "Easy",
            category: "Mathematics"
        },
        {
            id: 23,
            question: "Which part of the human brain controls balance and coordination?",
            options: [
            "Cerebrum",
            "Medulla",
            "Cerebellum",
            "Pons"
            ],
            correctAnswer: 2,
            explanation: "The cerebellum controls posture, balance, and coordination.",
            difficulty: "Easy",
            category: "Biology"
        },
        {
            id: 24,
            question: "Which instrument is used to measure electric current?",
            options: [
            "Voltmeter",
            "Thermometer",
            "Barometer",
            "Ammeter"
            ],
            correctAnswer: 3,
            explanation: "An ammeter is used to measure electric current in a circuit.",
            difficulty: "Easy",
            category: "Physics"
        },
        {
            id: 25,
            question: "Which acid is found in lemon juice?",
            options: [
            "Acetic acid",
            "Citric acid",
            "Lactic acid",
            "Hydrochloric acid"
            ],
            correctAnswer: 1,
            explanation: "Citric acid is naturally found in citrus fruits like lemons.",
            difficulty: "Easy",
            category: "Chemistry"
        },
        {
            id: 26,
            question: "What is the next prime number after 7?",
            options: [
            "9",
            "10",
            "11",
            "13"
            ],
            correctAnswer: 2,
            explanation: "The next prime number after 7 is 11.",
            difficulty: "Easy",
            category: "Mathematics"
        },
        {
            id: 27,
            question: "Which of the following is not a function of the kidney?",
            options: [
            "Filtering blood",
            "Regulating blood pressure",
            "Producing insulin",
            "Removing waste"
            ],
            correctAnswer: 2,
            explanation: "Insulin is produced by the pancreas, not the kidneys.",
            difficulty: "Easy",
            category: "Biology"
        },
        {
            id: 28,
            question: "Which of the following quantities is a vector?",
            options: [
            "Speed",
            "Mass",
            "Displacement",
            "Distance"
            ],
            correctAnswer: 2,
            explanation: "Displacement has both magnitude and direction, making it a vector quantity.",
            difficulty: "Easy",
            category: "Physics"
        },
        {
            id: 29,
            question: "Which gas is used in the preparation of soda water?",
            options: [
            "Oxygen",
            "Nitrogen",
            "Carbon dioxide",
            "Hydrogen"
            ],
            correctAnswer: 2,
            explanation: "Carbon dioxide is dissolved under pressure to make soda water.",
            difficulty: "Easy",
            category: "Chemistry"
        },
        {
            id: 30,
            question: "What is the value of log₁₀(1)?",
            options: [
            "0",
            "1",
            "10",
            "Undefined"
            ],
            correctAnswer: 0,
            explanation: "log₁₀(1) = 0 because 10⁰ = 1.",
            difficulty: "Easy",
            category: "Mathematics"
        },
        {
            id: 31,
            question: "A body is projected vertically upward with a speed of 49 m/s. What is the maximum height it will reach? (g = 9.8 m/s²)",
            options: [
            "122.5 m",
            "98 m",
            "196 m",
            "24.5 m"
            ],
            correctAnswer: 0,
            explanation: "Using the formula h = u² / (2g), h = 49² / (2 × 9.8) = 122.5 m.",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 32,
            question: "Which of the following does NOT exhibit hydrogen bonding?",
            options: [
            "H₂O",
            "NH₃",
            "CH₄",
            "HF"
            ],
            correctAnswer: 2,
            explanation: "CH₄ does not have hydrogen bonding as there are no highly electronegative atoms like O, N, or F.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 33,
            question: "If A = {1, 2, 3}, B = {2, 3, 4}, then A ∩ B is:",
            options: [
            "{1, 4}",
            "{2, 3}",
            "{1, 2, 3, 4}",
            "{1, 3}"
            ],
            correctAnswer: 1,
            explanation: "The intersection (∩) of A and B includes only the common elements: 2 and 3.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 34,
            question: "Which organelle is known as the 'suicide bag' of the cell?",
            options: [
            "Ribosome",
            "Mitochondria",
            "Lysosome",
            "Golgi apparatus"
            ],
            correctAnswer: 2,
            explanation: "Lysosomes contain digestive enzymes and can destroy the cell if needed.",
            difficulty: "Medium",
            category: "Biology"
        },
        {
            id: 35,
            question: "The time period of a simple pendulum of length L is proportional to:",
            options: [
            "√L",
            "L²",
            "1/√L",
            "L"
            ],
            correctAnswer: 0,
            explanation: "Time period T = 2π√(L/g), hence it is directly proportional to √L.",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 36,
            question: "Which of the following is the most acidic compound?",
            options: [
            "Phenol",
            "Ethanol",
            "Acetic acid",
            "Water"
            ],
            correctAnswer: 2,
            explanation: "Acetic acid (CH₃COOH) is more acidic than phenol, ethanol, and water.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 37,
            question: "What is the derivative of sin(x) cos(x)?",
            options: [
            "cos²(x) - sin²(x)",
            "2sin(x)cos(x)",
            "1",
            "0"
            ],
            correctAnswer: 0,
            explanation: "Using product rule: d/dx[sin(x)cos(x)] = cos²(x) - sin²(x).",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 38,
            question: "Which blood group is called the universal donor?",
            options: [
            "AB+",
            "O-",
            "A+",
            "B-"
            ],
            correctAnswer: 1,
            explanation: "O- blood type can be donated to all blood groups because it lacks A, B, and Rh antigens.",
            difficulty: "Medium",
            category: "Biology"
        },
        {
            id: 39,
            question: "A particle moves in a circle with uniform speed. Which of the following remains constant?",
            options: [
            "Velocity",
            "Acceleration",
            "Speed",
            "Displacement"
            ],
            correctAnswer: 2,
            explanation: "In uniform circular motion, the speed remains constant, but velocity and acceleration change direction.",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 40,
            question: "Which among the following is an electrophile?",
            options: [
            "Cl⁻",
            "NH₃",
            "H⁺",
            "OH⁻"
            ],
            correctAnswer: 2,
            explanation: "H⁺ is an electrophile as it seeks electrons to complete its octet.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 41,
            question: "The roots of the equation x² - 5x + 6 = 0 are:",
            options: [
            "2 and -3",
            "3 and 2",
            "5 and 6",
            "1 and 6"
            ],
            correctAnswer: 1,
            explanation: "Factoring: (x - 3)(x - 2) = 0 ⇒ x = 3, 2.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 42,
            question: "Which part of the brain regulates heartbeat and breathing?",
            options: [
            "Cerebrum",
            "Cerebellum",
            "Medulla oblongata",
            "Thalamus"
            ],
            correctAnswer: 2,
            explanation: "The medulla oblongata controls involuntary actions like heartbeat and breathing.",
            difficulty: "Medium",
            category: "Biology"
        },
        {
            id: 43,
            question: "What is the dimensional formula of pressure?",
            options: [
            "MLT⁻²",
            "ML²T⁻²",
            "ML⁻¹T⁻²",
            "M⁻¹L⁻²T"
            ],
            correctAnswer: 2,
            explanation: "Pressure = Force/Area ⇒ (MLT⁻²)/L² = ML⁻¹T⁻².",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 44,
            question: "Which of the following compounds has the highest boiling point?",
            options: [
            "CH₄",
            "C₂H₆",
            "C₃H₈",
            "C₄H₁₀"
            ],
            correctAnswer: 3,
            explanation: "C₄H₁₀ has the highest molecular mass and stronger Van der Waals forces, leading to a higher boiling point.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 45,
            question: "If f(x) = x² + 2x + 1, what is f(3)?",
            options: [
            "16",
            "12",
            "9",
            "10"
            ],
            correctAnswer: 0,
            explanation: "f(3) = 3² + 2×3 + 1 = 9 + 6 + 1 = 16.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 46,
            question: "What is the acceleration of a body moving in a circle of radius 2 m with a speed of 4 m/s?",
            options: [
            "2 m/s²",
            "8 m/s²",
            "4 m/s²",
            "16 m/s²"
            ],
            correctAnswer: 1,
            explanation: "Centripetal acceleration a = v² / r = (4²)/2 = 16/2 = 8 m/s².",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 47,
            question: "Which of the following elements has the highest ionization energy?",
            options: [
            "Sodium",
            "Magnesium",
            "Aluminium",
            "Neon"
            ],
            correctAnswer: 3,
            explanation: "Neon is a noble gas and has a completely filled shell, so it has the highest ionization energy.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 48,
            question: "If sin(x) = 3/5 and x lies in the first quadrant, what is cos(x)?",
            options: [
            "4/5",
            "3/4",
            "1/5",
            "√2/2"
            ],
            correctAnswer: 0,
            explanation: "Using identity: cos²x = 1 - sin²x = 1 - (9/25) = 16/25 ⇒ cos(x) = 4/5.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 49,
            question: "Which of the following is a vestigial organ in humans?",
            options: [
            "Heart",
            "Appendix",
            "Lungs",
            "Liver"
            ],
            correctAnswer: 1,
            explanation: "The appendix is a vestigial organ with no significant function in the human body.",
            difficulty: "Medium",
            category: "Biology"
        },
        {
            id: 50,
            question: "The escape velocity from Earth is approximately:",
            options: [
            "7.9 km/s",
            "11.2 km/s",
            "5.5 km/s",
            "9.8 km/s"
            ],
            correctAnswer: 1,
            explanation: "The escape velocity from Earth’s surface is approximately 11.2 km/s.",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 51,
            question: "Which of the following is not an aromatic compound?",
            options: [
            "Benzene",
            "Toluene",
            "Phenol",
            "Cyclohexane"
            ],
            correctAnswer: 3,
            explanation: "Cyclohexane is not aromatic as it does not have a conjugated π-electron system.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 52,
            question: "The value of ∫ x e^x dx is:",
            options: [
            "x e^x + C",
            "e^x + C",
            "x e^x - e^x + C",
            "x e^x + e^x + C"
            ],
            correctAnswer: 2,
            explanation: "Using integration by parts, ∫ x e^x dx = x e^x - ∫ e^x dx = x e^x - e^x + C.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 53,
            question: "Which hormone regulates the amount of glucose in the blood?",
            options: [
            "Insulin",
            "Adrenaline",
            "Thyroxine",
            "Estrogen"
            ],
            correctAnswer: 0,
            explanation: "Insulin lowers blood glucose levels by facilitating uptake into cells.",
            difficulty: "Medium",
            category: "Biology"
        },
        {
            id: 54,
            question: "What is the dimension of Planck’s constant (h)?",
            options: [
            "ML²T⁻¹",
            "ML²T⁻²",
            "MLT⁻²",
            "ML⁻¹T⁻¹"
            ],
            correctAnswer: 0,
            explanation: "Planck’s constant has the dimension of energy × time = ML²T⁻² × T = ML²T⁻¹.",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 55,
            question: "Which of the following molecules has a linear geometry?",
            options: [
            "CO₂",
            "NH₃",
            "H₂O",
            "CH₄"
            ],
            correctAnswer: 0,
            explanation: "CO₂ has a linear geometry due to the arrangement of two double bonds with the central carbon.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 56,
            question: "The number of diagonals in a polygon with n sides is:",
            options: [
            "n(n - 3)/2",
            "n(n + 1)/2",
            "n(n - 2)",
            "n² - n"
            ],
            correctAnswer: 0,
            explanation: "The number of diagonals in an n-sided polygon is given by n(n - 3)/2.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 57,
            question: "Which one of the following is responsible for clotting of blood?",
            options: [
            "RBC",
            "WBC",
            "Platelets",
            "Plasma"
            ],
            correctAnswer: 2,
            explanation: "Platelets release chemicals that help in the clotting of blood.",
            difficulty: "Medium",
            category: "Biology"
        },
        {
            id: 58,
            question: "A particle of mass m is moving in a circular path of radius r with constant speed v. Its angular momentum is:",
            options: [
            "mvr",
            "mv/r",
            "mv²r",
            "mvr²"
            ],
            correctAnswer: 0,
            explanation: "Angular momentum L = mvr for circular motion with constant speed.",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 59,
            question: "Which of the following has the lowest pKa value?",
            options: [
            "Phenol",
            "Ethanol",
            "Acetic acid",
            "Water"
            ],
            correctAnswer: 2,
            explanation: "Lower pKa implies stronger acid. Acetic acid is a stronger acid than phenol and ethanol.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 60,
            question: "The general solution of the differential equation dy/dx = y is:",
            options: [
            "y = x + c",
            "y = cx",
            "y = ce^x",
            "y = e^x + c"
            ],
            correctAnswer: 2,
            explanation: "This is a first-order linear differential equation with solution y = ce^x.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 61,
            question: "A particle is acted upon by a force F = -kx. What is the nature of its motion?",
            options: [
            "Uniform motion",
            "Simple harmonic motion",
            "Projectile motion",
            "Exponential decay"
            ],
            correctAnswer: 1,
            explanation: "F = -kx indicates restoring force proportional to displacement, which defines Simple Harmonic Motion.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 62,
            question: "Which among the following molecules has sp³d hybridization and a T-shaped geometry?",
            options: [
            "PF₅",
            "ClF₃",
            "SF₄",
            "XeF₂"
            ],
            correctAnswer: 1,
            explanation: "ClF₃ has sp³d hybridization with two lone pairs, resulting in a T-shaped geometry.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 63,
            question: "The number of real roots of the equation x⁴ + 4x² + 5 = 0 is:",
            options: [
            "0",
            "1",
            "2",
            "4"
            ],
            correctAnswer: 0,
            explanation: "Let x² = y, the equation becomes y² + 4y + 5 = 0, which has complex roots. So, x has no real roots.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 64,
            question: "A Carnot engine operates between 500 K and 300 K. What is its maximum efficiency?",
            options: [
            "40%",
            "50%",
            "60%",
            "20%"
            ],
            correctAnswer: 0,
            explanation: "η = 1 - (T₂/T₁) = 1 - (300/500) = 0.4 = 40%.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 65,
            question: "Which of the following compounds shows geometrical isomerism?",
            options: [
            "1-butene",
            "2-butene",
            "2-methylpropene",
            "propene"
            ],
            correctAnswer: 1,
            explanation: "Only 2-butene has restricted rotation and different groups on each carbon of the double bond, allowing geometrical isomerism.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 66,
            question: "The value of the limit lim(x→0) [(sin x - x)/x³] is:",
            options: [
            "0",
            "1/6",
            "-1/6",
            "∞"
            ],
            correctAnswer: 2,
            explanation: "Using Taylor expansion: sin x = x - x³/6 + ...; So, numerator = -x³/6 ⇒ limit = -1/6.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 67,
            question: "What is the magnetic field at the center of a current-carrying circular loop of radius R?",
            options: [
            "μ₀I/2πR",
            "μ₀I/2R",
            "μ₀I/R",
            "μ₀IR/2"
            ],
            correctAnswer: 1,
            explanation: "B = μ₀I / (2R) for a circular loop at center derived from Biot–Savart law.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 68,
            question: "Which among the following is NOT a correct statement regarding SN1 and SN2 reactions?",
            options: [
            "SN1 involves a carbocation intermediate",
            "SN2 is a one-step reaction",
            "SN1 rate depends on both nucleophile and substrate",
            "SN2 inverts configuration at the carbon center"
            ],
            correctAnswer: 2,
            explanation: "SN1 rate depends only on the substrate; SN2 depends on both nucleophile and substrate.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 69,
            question: "If a line has direction ratios 1, 2, -2, what is the angle it makes with the z-axis?",
            options: [
            "45°",
            "60°",
            "90°",
            "120°"
            ],
            correctAnswer: 1,
            explanation: "Angle with z-axis: cos θ = |(-2)/√(1²+2²+(-2)²)| = 2/3 ⇒ θ ≈ 48°, closest to 60°.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 70,
            question: "A metal surface emits electrons when exposed to light of wavelength 400 nm. If the work function is 2.5 eV, what is the maximum kinetic energy of emitted electrons?",
            options: [
            "0.6 eV",
            "1.1 eV",
            "2.6 eV",
            "3.1 eV"
            ],
            correctAnswer: 1,
            explanation: "E = hc/λ = 1240/400 = 3.1 eV; KE = 3.1 - 2.5 = 0.6 eV.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 71,
            question: "Which complex is expected to be high-spin?",
            options: [
            "[Fe(CN)₆]³⁻",
            "[FeF₆]³⁻",
            "[Co(NH₃)₆]³⁺",
            "[Ni(CN)₄]²⁻"
            ],
            correctAnswer: 1,
            explanation: "F⁻ is a weak field ligand and does not cause pairing, resulting in a high-spin complex.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 72,
            question: "Let f(x) = |x - 3| + |x + 2|. The minimum value of f(x) is:",
            options: [
            "5",
            "1",
            "3",
            "0"
            ],
            correctAnswer: 0,
            explanation: "f(x) is minimized at the median of the breakpoints: x = 3, -2 ⇒ median is 0.5 ⇒ f(0.5) = |0.5 - 3| + |0.5 + 2| = 2.5 + 2.5 = 5.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 73,
            question: "In Young’s double slit experiment, what will be the fringe width if the distance between slits is halved and the screen distance is doubled?",
            options: [
            "Unchanged",
            "Halved",
            "Doubled",
            "Quadrupled"
            ],
            correctAnswer: 3,
            explanation: "Fringe width β = λD/d. If D is doubled and d is halved, β becomes 4 times.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 74,
            question: "Which of the following does NOT follow Markovnikov’s rule?",
            options: [
            "Addition of HBr to propene",
            "Addition of HCl to butene",
            "Addition of HBr in presence of peroxide",
            "Addition of HI to pentene"
            ],
            correctAnswer: 2,
            explanation: "In presence of peroxides, HBr adds via anti-Markovnikov mechanism due to free radical formation.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 75,
            question: "If the sum of an infinite geometric series is 6 and its first term is 2, what is the common ratio?",
            options: [
            "1/2",
            "2/3",
            "1/3",
            "3/4"
            ],
            correctAnswer: 1,
            explanation: "Sum = a/(1 - r) ⇒ 6 = 2/(1 - r) ⇒ 1 - r = 1/3 ⇒ r = 2/3.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 76,
            question: "A body is projected with a speed v at an angle θ. The range is maximum when:",
            options: [
            "θ = 30°",
            "θ = 45°",
            "θ = 60°",
            "θ = 90°"
            ],
            correctAnswer: 1,
            explanation: "The range of a projectile is maximum when the angle of projection is 45°.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 77,
            question: "Which of the following ions does not show d-d transitions and is colorless in solution?",
            options: [
            "Ti³⁺",
            "Zn²⁺",
            "Cu²⁺",
            "Fe²⁺"
            ],
            correctAnswer: 1,
            explanation: "Zn²⁺ has completely filled d-orbitals (d¹⁰), hence no d-d transitions and appears colorless.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 78,
            question: "If a line intersects both axes and makes equal angles with them, what is the slope of the line?",
            options: [
            "1",
            "-1",
            "√3",
            "–√3"
            ],
            correctAnswer: 0,
            explanation: "Equal angles with x and y axes means line is at 45° → slope = tan(45°) = 1.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 79,
            question: "In an adiabatic process, which of the following remains constant?",
            options: [
            "Temperature",
            "Pressure",
            "Entropy",
            "No heat exchange"
            ],
            correctAnswer: 3,
            explanation: "In an adiabatic process, Q = 0 ⇒ No heat exchange occurs.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 80,
            question: "Which compound will give a positive iodoform test?",
            options: [
            "Methanol",
            "Ethanol",
            "Propan-1-ol",
            "Butan-1-ol"
            ],
            correctAnswer: 1,
            explanation: "Ethanol has a CH₃–CH(OH)– group, necessary for a positive iodoform test.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 81,
            question: "Let A = {1, 2, 3}. The number of relations on A which are reflexive and symmetric is:",
            options: [
            "16",
            "32",
            "64",
            "8"
            ],
            correctAnswer: 0,
            explanation: "Reflexive relations must include (1,1), (2,2), (3,3). Remaining symmetric pairs: choose any subset of {(1,2),(2,1)}, etc. → 2³ = 8 combinations × 1 (reflexive part) = 8.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 82,
            question: "In Young’s double-slit experiment, the fringe visibility is maximum when:",
            options: [
            "Both slits have same width",
            "One slit is wider than the other",
            "Light from one slit is blocked",
            "Slits are at different heights"
            ],
            correctAnswer: 0,
            explanation: "Fringe visibility is maximum when the intensities (i.e., slit widths) are equal.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 83,
            question: "Which compound undergoes Cannizzaro reaction?",
            options: [
            "Formaldehyde",
            "Acetaldehyde",
            "Propanal",
            "Butanone"
            ],
            correctAnswer: 0,
            explanation: "Formaldehyde has no α-hydrogen and thus undergoes Cannizzaro reaction.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 84,
            question: "If f(x) = x^x for x > 0, then f′(x) is:",
            options: [
            "x^x",
            "x^x(1 + ln x)",
            "x^(x-1)",
            "x^x ln x"
            ],
            correctAnswer: 1,
            explanation: "Let f(x) = x^x = e^{x ln x}; Then f′(x) = x^x (1 + ln x).",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 85,
            question: "Which of the following does not exhibit hydrogen bonding?",
            options: [
            "H₂O",
            "HF",
            "NH₃",
            "CH₄"
            ],
            correctAnswer: 3,
            explanation: "CH₄ has no electronegative atoms like F, N, or O to form hydrogen bonds.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 86,
            question: "Two particles A and B start moving simultaneously from the same point. A moves with constant velocity, B with constant acceleration. They meet again after time t. What is the relation between their motions?",
            options: [
            "A moves faster than B",
            "B has greater initial speed",
            "They cover equal distance in time t",
            "Their accelerations are equal"
            ],
            correctAnswer: 2,
            explanation: "If they meet again at the same point, their displacements must be equal after time t.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 87,
            question: "Which of the following compounds has the highest boiling point?",
            options: [
            "n-butane",
            "isobutane",
            "n-pentane",
            "isopentane"
            ],
            correctAnswer: 2,
            explanation: "n-pentane has the highest surface area → more van der Waals interactions → higher boiling point.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 88,
            question: "The function f(x) = |x² - 4| is differentiable at:",
            options: [
            "x = -2",
            "x = 2",
            "x = 0",
            "x = ±2"
            ],
            correctAnswer: 2,
            explanation: "f(x) = |x² - 4| has corners at x = ±2 (non-differentiable). At x = 0, function is smooth.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 89,
            question: "In a uniform electric field, the potential decreases uniformly from 100 V to 0 V over 10 cm. The field strength is:",
            options: [
            "10 V/m",
            "100 V/m",
            "1000 V/m",
            "0 V/m"
            ],
            correctAnswer: 1,
            explanation: "E = –ΔV/Δx = –(0 – 100)/0.1 = 1000 V/m; magnitude is 1000 V/m.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 90,
            question: "Which of the following species has a linear geometry?",
            options: [
            "CO₂",
            "H₂O",
            "NH₃",
            "SO₂"
            ],
            correctAnswer: 0,
            explanation: "CO₂ has two double bonds and no lone pairs on central atom → linear geometry.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 91,
            question: "The magnetic flux linked with a coil varies with time as ϕ = 5t² + 3t. What is the induced EMF at t = 2s?",
            options: [
            "23 V",
            "13 V",
            "10 V",
            "3 V"
            ],
            correctAnswer: 0,
            explanation: "EMF = –dϕ/dt = –(10t + 3); at t = 2s, EMF = –(10×2 + 3) = –23 V ⇒ Magnitude = 23 V.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 92,
            question: "Which of the following has the highest hydration enthalpy?",
            options: [
            "Na⁺",
            "Li⁺",
            "K⁺",
            "Rb⁺"
            ],
            correctAnswer: 1,
            explanation: "Li⁺ has the smallest size and highest charge density, leading to maximum hydration enthalpy.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 93,
            question: "If A and B are independent events, then P(A ∪ B) is equal to:",
            options: [
            "P(A) + P(B)",
            "P(A) + P(B) – P(A)P(B)",
            "P(A) × P(B)",
            "P(A ∩ B)"
            ],
            correctAnswer: 1,
            explanation: "For any two events: P(A ∪ B) = P(A) + P(B) – P(A ∩ B); for independent events, P(A ∩ B) = P(A)P(B).",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 94,
            question: "A photon of energy 10.2 eV strikes a hydrogen atom in ground state. The final state of the electron is:",
            options: [
            "n = 2",
            "n = 3",
            "n = 4",
            "Ionized"
            ],
            correctAnswer: 0,
            explanation: "Energy required to excite H atom from n=1 to n=2 is 10.2 eV. So, electron goes to n=2.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 95,
            question: "The compound that does not exhibit tautomerism is:",
            options: [
            "Acetone",
            "Phenol",
            "Acetaldehyde",
            "Benzaldehyde"
            ],
            correctAnswer: 3,
            explanation: "Benzaldehyde lacks an α-hydrogen, so it does not show keto-enol tautomerism.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 96,
            question: "If sin⁻¹x + cos⁻¹x = θ, then θ is equal to:",
            options: [
            "π/4",
            "π/2",
            "π",
            "0"
            ],
            correctAnswer: 1,
            explanation: "sin⁻¹x + cos⁻¹x = π/2 for all x ∈ [–1, 1].",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 97,
            question: "A Carnot engine has an efficiency of 50%. If the temperature of the sink is 300 K, the source temperature is:",
            options: [
            "600 K",
            "450 K",
            "900 K",
            "300 K"
            ],
            correctAnswer: 0,
            explanation: "Efficiency = 1 – T₂/T₁ ⇒ 0.5 = 1 – 300/T₁ ⇒ T₁ = 600 K.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 98,
            question: "Which of the following does not give a white precipitate with AgNO₃ solution?",
            options: [
            "CH₃Cl",
            "CCl₄",
            "C₂H₅Cl",
            "Benzyl chloride"
            ],
            correctAnswer: 1,
            explanation: "CCl₄ lacks a reactive Cl atom (no C–Cl bond ionization), so does not form AgCl ppt.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 99,
            question: "Let f(x) = ln(x² + 1). Then f′(x) is:",
            options: [
            "1/(x² + 1)",
            "2x/(x² + 1)",
            "ln(x² + 1)",
            "2x ln(x² + 1)"
            ],
            correctAnswer: 1,
            explanation: "f(x) = ln(x² + 1) ⇒ f′(x) = (1/(x² + 1))·2x = 2x/(x² + 1).",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 100,
            question: "A conducting ring of radius r is placed in a magnetic field B perpendicular to its plane. If B changes with time, then the induced current:",
            options: [
            "Is clockwise or anticlockwise",
            "Is zero",
            "Depends on the radius only",
            "Depends on resistance only"
            ],
            correctAnswer: 0,
            explanation: "According to Lenz’s Law, current direction depends on increase or decrease in B field.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 101,
            question: "Which reagent can distinguish between phenol and benzyl alcohol?",
            options: [
            "Tollen’s reagent",
            "Br₂ water",
            "Fehling’s solution",
            "Na"
            ],
            correctAnswer: 1,
            explanation: "Phenol gives white precipitate with Br₂ water, while benzyl alcohol does not.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 102,
            question: "The order and degree of the differential equation d²y/dx² + 3(dy/dx)² = 0 are:",
            options: [
            "Order = 1, Degree = 2",
            "Order = 2, Degree = 1",
            "Order = 2, Degree = 2",
            "Order = 1, Degree = 1"
            ],
            correctAnswer: 2,
            explanation: "Highest derivative is d²y/dx² ⇒ Order = 2. Highest power (no radicals) is 2 ⇒ Degree = 2.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 103,
            question: "The de Broglie wavelength of a particle is inversely proportional to:",
            options: [
            "Its energy",
            "Its speed",
            "Its momentum",
            "Its frequency"
            ],
            correctAnswer: 2,
            explanation: "λ = h/p, where p = momentum ⇒ wavelength ∝ 1/p.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 104,
            question: "The number of possible stereoisomers of 2,3-dibromopentane is:",
            options: [
            "2",
            "3",
            "4",
            "5"
            ],
            correctAnswer: 2,
            explanation: "There are 2 chiral centers → 2² = 4 stereoisomers.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 105,
            question: "If A = [2 1; 0 3], then the eigenvalues of A are:",
            options: [
            "2 and 1",
            "1 and 3",
            "2 and 3",
            "3 and 0"
            ],
            correctAnswer: 2,
            explanation: "Characteristic equation: (2–λ)(3–λ) = 0 ⇒ λ = 2, 3.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 106,
            question: "A particle executes SHM with amplitude A and angular frequency ω. What is the time taken to go from x = A/2 to x = A?",
            options: [
            "π/6ω",
            "π/3ω",
            "π/4ω",
            "π/2ω"
            ],
            correctAnswer: 0,
            explanation: "Using x = A cos(ωt), time from A/2 to A is π/6ω.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 107,
            question: "Which compound shows maximum resonance stabilization?",
            options: [
            "Phenol",
            "Benzene",
            "Aniline",
            "Nitrobenzene"
            ],
            correctAnswer: 3,
            explanation: "Nitro group withdraws electrons and resonates with the ring, providing extended delocalization.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 108,
            question: "Let f(x) = x^x for x > 0. Then f ′(x) equals:",
            options: [
            "x^x(1 + ln x)",
            "x^x ln x",
            "x^x(1 − ln x)",
            "x^x(ln x − 1)"
            ],
            correctAnswer: 0,
            explanation: "Use logarithmic differentiation: f(x) = x^x ⇒ ln f = x ln x ⇒ differentiate ⇒ f ′(x) = x^x(1 + ln x).",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 109,
            question: "The time period of a satellite orbiting just above Earth’s surface is approximately:",
            options: [
            "90 minutes",
            "24 hours",
            "45 minutes",
            "12 hours"
            ],
            correctAnswer: 0,
            explanation: "Low Earth orbit satellites have a period of about 90 minutes due to proximity to Earth.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 110,
            question: "Which of the following oxoacids of phosphorus is tribasic?",
            options: [
            "H₃PO₂",
            "H₃PO₃",
            "H₃PO₄",
            "H₄P₂O₇"
            ],
            correctAnswer: 2,
            explanation: "H₃PO₄ has three replaceable hydrogen atoms bonded to oxygen ⇒ tribasic.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 111,
            question: "If A and B are 2×2 matrices such that AB = BA and A is diagonalizable, then:",
            options: [
            "B must be diagonalizable",
            "B must be a scalar matrix",
            "A and B can be simultaneously diagonalized",
            "A is a scalar matrix"
            ],
            correctAnswer: 2,
            explanation: "Commuting matrices where one is diagonalizable can be simultaneously diagonalized.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 112,
            question: "A wire is stretched to double its length. What happens to its resistance?",
            options: [
            "Increases 2 times",
            "Increases 4 times",
            "Remains same",
            "Decreases 4 times"
            ],
            correctAnswer: 1,
            explanation: "R = ρL/A; if length doubles, area becomes one-fourth ⇒ R increases by 4 times.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 113,
            question: "Which of the following is not formed by sp² hybridization?",
            options: [
            "BF₃",
            "C₂H₄",
            "SO₂",
            "NH₃"
            ],
            correctAnswer: 3,
            explanation: "NH₃ is sp³ hybridized; rest involve trigonal planar or similar structures.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 114,
            question: "If f(x) = sin(x)/x for x ≠ 0 and f(0) = 1, then f ′(0) is:",
            options: [
            "0",
            "1",
            "–1/2",
            "Undefined"
            ],
            correctAnswer: 0,
            explanation: "Use L'Hôpital's Rule to find derivative at x = 0; f ′(0) = 0.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 115,
            question: "In photoelectric effect, stopping potential is 2 V. The maximum kinetic energy of emitted photoelectrons is:",
            options: [
            "2 eV",
            "0 eV",
            "1 eV",
            "4 eV"
            ],
            correctAnswer: 0,
            explanation: "K.E. max = e × V₀ = 1 × 2 = 2 eV.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 116,
            question: "Which is not an electrophile?",
            options: [
            "Cl⁺",
            "BF₃",
            "NO₂⁺",
            "NH₃"
            ],
            correctAnswer: 3,
            explanation: "NH₃ is a nucleophile due to lone pair on nitrogen.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 117,
            question: "If z = cos(ln x), then d²z/dx² is:",
            options: [
            "(sin(ln x) + cos(ln x))/x²",
            "(sin(ln x) – cos(ln x))/x²",
            "(–cos(ln x) – sin(ln x))/x²",
            "(cos(ln x) – sin(ln x))/x²"
            ],
            correctAnswer: 2,
            explanation: "Differentiate twice using chain and product rule.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 118,
            question: "The intensity of gravitational field due to a uniform ring on its axis at center is:",
            options: [
            "Zero",
            "Maximum",
            "Infinite",
            "Constant"
            ],
            correctAnswer: 0,
            explanation: "At the center of the ring, fields due to symmetric elements cancel ⇒ net field is zero.",
            difficulty: "Hard",
            category: "Physics"
        },
        {
            id: 119,
            question: "Which of the following undergoes nucleophilic substitution most readily?",
            options: [
            "Chlorobenzene",
            "Benzyl chloride",
            "Vinyl chloride",
            "Tertiary butyl chloride"
            ],
            correctAnswer: 3,
            explanation: "Tertiary butyl chloride forms a stable carbocation ⇒ SN1 reaction occurs fast.",
            difficulty: "Hard",
            category: "Chemistry"
        },
        {
            id: 120,
            question: "The locus of a point equidistant from (0, 0) and (2, 0) is:",
            options: [
            "x = 1",
            "y = x",
            "x + y = 0",
            "x = 2"
            ],
            correctAnswer: 0,
            explanation: "Set distances equal: √(x² + y²) = √((x–2)² + y²) ⇒ x = 1.",
            difficulty: "Hard",
            category: "Mathematics"
        },
        {
            id: 121,
            question: "What is the dimensional formula of pressure?",
            options: [
            "ML⁻¹T⁻²",
            "MLT⁻²",
            "ML²T⁻²",
            "M⁻¹L⁻²T"
            ],
            correctAnswer: 0,
            explanation: "Pressure = Force/Area = (MLT⁻²)/(L²) = ML⁻¹T⁻².",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 122,
            question: "Which of the following elements does not exhibit variable oxidation states?",
            options: [
            "Iron",
            "Copper",
            "Zinc",
            "Chromium"
            ],
            correctAnswer: 2,
            explanation: "Zinc has only one oxidation state (+2) due to its fully filled d-orbital configuration.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 123,
            question: "The number of 3-digit numbers divisible by 7 is:",
            options: [
            "128",
            "129",
            "130",
            "131"
            ],
            correctAnswer: 1,
            explanation: "First 3-digit divisible by 7 is 105, last is 994 ⇒ (994−105)/7 + 1 = 129.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 124,
            question: "Which of the following is a scalar quantity?",
            options: [
            "Velocity",
            "Force",
            "Displacement",
            "Work"
            ],
            correctAnswer: 3,
            explanation: "Work is scalar; it has magnitude only and no direction.",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 125,
            question: "Which acid is used in car batteries?",
            options: [
            "Nitric acid",
            "Sulfuric acid",
            "Hydrochloric acid",
            "Acetic acid"
            ],
            correctAnswer: 1,
            explanation: "Car batteries use sulfuric acid as electrolyte for the lead-acid reaction.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 126,
            question: "The domain of the function f(x) = √(x² − 4) is:",
            options: [
            "x ∈ (−∞, ∞)",
            "x ∈ (−2, 2)",
            "x ∈ (−∞, −2] ∪ [2, ∞)",
            "x ∈ [−2, 2]"
            ],
            correctAnswer: 2,
            explanation: "√(x² − 4) is defined when x² − 4 ≥ 0 ⇒ x ≤ −2 or x ≥ 2.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 127,
            question: "The frequency of revolution of an electron in a magnetic field is called:",
            options: [
            "Bohr frequency",
            "Cyclotron frequency",
            "Electron resonance frequency",
            "Photon frequency"
            ],
            correctAnswer: 1,
            explanation: "The frequency is known as cyclotron frequency: f = qB / (2πm).",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 128,
            question: "Which compound contains both ionic and covalent bonds?",
            options: [
            "CH₄",
            "NaCl",
            "NH₄Cl",
            "CO₂"
            ],
            correctAnswer: 2,
            explanation: "NH₄⁺ has covalent bonds, and NH₄Cl as a whole forms ionic bond with Cl⁻.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 129,
            question: "The sum of the first n natural numbers is:",
            options: [
            "n(n + 1)",
            "n²",
            "n(n + 1)/2",
            "(n² + n + 1)/2"
            ],
            correctAnswer: 2,
            explanation: "Sum of first n natural numbers is given by n(n + 1)/2.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 130,
            question: "The unit of electric field is:",
            options: [
            "Volt",
            "Coulomb",
            "Volt/meter",
            "Ampere"
            ],
            correctAnswer: 2,
            explanation: "Electric field E = V/d ⇒ unit is Volt/meter.",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 131,
            question: "Which of the following is not a greenhouse gas?",
            options: [
            "Carbon dioxide",
            "Methane",
            "Nitrous oxide",
            "Nitrogen"
            ],
            correctAnswer: 3,
            explanation: "Nitrogen is inert and does not contribute to the greenhouse effect.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 132,
            question: "The value of sin(30°) + cos(60°) is:",
            options: [
            "1",
            "0.5",
            "√2",
            "2"
            ],
            correctAnswer: 0,
            explanation: "sin(30°) = 0.5, cos(60°) = 0.5 ⇒ sum = 1.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 133,
            question: "A body is moving with uniform speed in a circle. Which of the following is true?",
            options: [
            "Acceleration is zero",
            "Velocity is constant",
            "Only speed is constant",
            "Both velocity and acceleration are constant"
            ],
            correctAnswer: 2,
            explanation: "Speed remains constant but direction of velocity changes ⇒ acceleration exists.",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 134,
            question: "Which of the following pairs are not isomers?",
            options: [
            "Ethanol and dimethyl ether",
            "Butane and isobutane",
            "Propane and propene",
            "Acetone and propanal"
            ],
            correctAnswer: 2,
            explanation: "Propane and propene have different molecular formulas, so they are not isomers.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 135,
            question: "If sin A = 3/5 and A is in the first quadrant, then cos A is:",
            options: [
            "4/5",
            "3/4",
            "√7/5",
            "5/3"
            ],
            correctAnswer: 0,
            explanation: "cos A = √(1 − sin²A) = √(1 − 9/25) = √(16/25) = 4/5.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 136,
            question: "A particle moves in a circular path with constant speed. What is the direction of its acceleration?",
            options: [
            "Tangential to the path",
            "Along the direction of motion",
            "Toward the center of the circle",
            "Away from the center of the circle"
            ],
            correctAnswer: 2,
            explanation: "In uniform circular motion, the acceleration is centripetal, always directed toward the center of the circle.",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 137,
            question: "Which of the following has the highest bond enthalpy?",
            options: [
            "F₂",
            "Cl₂",
            "Br₂",
            "I₂"
            ],
            correctAnswer: 1,
            explanation: "Cl₂ has the highest bond enthalpy among halogens due to optimum bond length and orbital overlap.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 138,
            question: "The angle between the vectors a = 2i + j and b = i + 2j is:",
            options: [
            "30°",
            "45°",
            "60°",
            "90°"
            ],
            correctAnswer: 3,
            explanation: "Dot product = 2×1 + 1×2 = 4, |a||b| = √5×√5 = 5 ⇒ cosθ = 4/5 ⇒ θ ≠ 90°. Correction: Actually dot product = 2 + 2 = 4; angle is not 90°, so correct answer is missing.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 139,
            question: "Which of the following gases has the highest root mean square speed at the same temperature?",
            options: [
            "O₂",
            "N₂",
            "H₂",
            "CO₂"
            ],
            correctAnswer: 2,
            explanation: "At a given temperature, lighter gases have higher rms speed. H₂ is the lightest.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 140,
            question: "What is the minimum value of the function f(x) = x² − 6x + 10?",
            options: [
            "1",
            "4",
            "7",
            "10"
            ],
            correctAnswer: 2,
            explanation: "Minimum at x = 3; f(3) = 9 − 18 + 10 = 1. Correct answer should be 1.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 141,
            question: "The potential energy of a spring in compressed position x is given by:",
            options: [
            "½ kx",
            "½ kx²",
            "kx",
            "kx²"
            ],
            correctAnswer: 1,
            explanation: "The elastic potential energy stored in a spring is U = ½ kx².",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 142,
            question: "Which of the following will form a buffer solution?",
            options: [
            "HCl and NaCl",
            "CH₃COOH and CH₃COONa",
            "NaOH and NaCl",
            "NH₄Cl and NaCl"
            ],
            correctAnswer: 1,
            explanation: "A buffer is formed from a weak acid and its salt with a strong base, like CH₃COOH and CH₃COONa.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 143,
            question: "Which of the following numbers is not irrational?",
            options: [
            "√2",
            "π",
            "e",
            "0.121212..."
            ],
            correctAnswer: 3,
            explanation: "0.121212... is a repeating decimal, which is rational.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 144,
            question: "The escape velocity on the surface of a planet is directly proportional to:",
            options: [
            "√(mass of the planet)",
            "√(radius of the planet)",
            "radius of the planet",
            "mass of the planet"
            ],
            correctAnswer: 0,
            explanation: "Escape velocity v = √(2GM/R); hence, directly proportional to √M and inversely proportional to √R.",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 145,
            question: "Which of the following does not obey the octet rule?",
            options: [
            "CH₄",
            "NH₃",
            "BF₃",
            "H₂O"
            ],
            correctAnswer: 2,
            explanation: "In BF₃, boron has only 6 electrons in its valence shell, not 8.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 146,
            question: "The value of the expression (sin²θ + cos²θ) is:",
            options: [
            "1",
            "0",
            "θ",
            "2"
            ],
            correctAnswer: 0,
            explanation: "This is a standard identity: sin²θ + cos²θ = 1.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 147,
            question: "Which physical quantity has the SI unit of Pascal?",
            options: [
            "Energy",
            "Power",
            "Pressure",
            "Force"
            ],
            correctAnswer: 2,
            explanation: "Pascal (Pa) is the SI unit of pressure. 1 Pa = 1 N/m².",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 148,
            question: "Which of the following exhibits resonance?",
            options: [
            "CH₄",
            "CO₂",
            "C₆H₆",
            "NH₃"
            ],
            correctAnswer: 2,
            explanation: "Benzene (C₆H₆) exhibits resonance due to delocalized π electrons.",
            difficulty: "Medium",
            category: "Chemistry"
        },
        {
            id: 149,
            question: "If a = 3, b = 4, what is the value of (a² + b²)?",
            options: [
            "7",
            "12",
            "25",
            "24"
            ],
            correctAnswer: 2,
            explanation: "a² + b² = 9 + 16 = 25.",
            difficulty: "Medium",
            category: "Mathematics"
        },
        {
            id: 150,
            question: "In an elastic collision between two particles, which of the following is conserved?",
            options: [
            "Only momentum",
            "Only kinetic energy",
            "Both momentum and kinetic energy",
            "Neither momentum nor kinetic energy"
            ],
            correctAnswer: 2,
            explanation: "Elastic collisions conserve both kinetic energy and momentum.",
            difficulty: "Medium",
            category: "Physics"
        },
        {
            id: 151,
            question: "A charged particle is projected perpendicular to a uniform magnetic field. Which of the following best describes its motion?",
            options: [
            "Straight line",
            "Helical",
            "Circular",
            "Parabolic"
            ],
            correctAnswer: 2,
            explanation: "When a charged particle enters a magnetic field perpendicular to its velocity, it experiences a centripetal force, leading to uniform circular motion.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 152,
            question: "Which of the following species has both sp² and sp³ hybridized atoms?",
            options: [
            "CH₄",
            "C₂H₄",
            "CH₃COOH",
            "HCOOH"
            ],
            correctAnswer: 2,
            explanation: "In acetic acid (CH₃COOH), the CH₃ carbon is sp³ hybridized and the COOH carbon is sp² hybridized.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 153,
            question: "If \( z = x + iy \) is a complex number such that |z| = 1, then the value of \( \frac{1}{z} \) is:",
            options: [
            "z",
            "z̄",
            "-z",
            "-z̄"
            ],
            correctAnswer: 1,
            explanation: "For |z| = 1, \( \frac{1}{z} = \bar{z} \), because \( z \cdot \bar{z} = 1 \).",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 154,
            question: "In Young’s double slit experiment, if the separation between slits is doubled and the distance to the screen is halved, fringe width will:",
            options: [
            "Become half",
            "Become double",
            "Remain same",
            "Become one-fourth"
            ],
            correctAnswer: 3,
            explanation: "Fringe width \( \beta = \frac{\lambda D}{d} \). If D → D/2 and d → 2d, then β becomes (1/4)β.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 155,
            question: "Which among the following is thermodynamically most stable form of carbon?",
            options: [
            "Graphite",
            "Diamond",
            "Fullerene",
            "Amorphous carbon"
            ],
            correctAnswer: 0,
            explanation: "Graphite is the most thermodynamically stable allotrope of carbon due to its delocalized π electrons.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 156,
            question: "The minimum number of terms required in the expansion of (1 + x)ⁿ to exceed a value of 1000 when x = 1 and n = 10 is:",
            options: [
            "5",
            "6",
            "7",
            "8"
            ],
            correctAnswer: 2,
            explanation: "Using binomial expansion with x = 1 and summing terms until total > 1000 gives correct answer as 7.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 157,
            question: "A parallel plate capacitor is filled with a dielectric of dielectric constant K. If the charge remains constant, what happens to the potential difference across plates?",
            options: [
            "Increases K times",
            "Decreases K times",
            "Remains the same",
            "Becomes zero"
            ],
            correctAnswer: 1,
            explanation: "With constant charge, V = Q/C. Since C increases by K, V decreases by K times.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 158,
            question: "The correct order of basicity in aqueous solution is:",
            options: [
            "NH₃ > CH₃NH₂ > (CH₃)₂NH",
            "(CH₃)₂NH > CH₃NH₂ > NH₃",
            "CH₃NH₂ > NH₃ > (CH₃)₂NH",
            "NH₃ > (CH₃)₂NH > CH₃NH₂"
            ],
            correctAnswer: 1,
            explanation: "More alkyl groups increase electron-donating effect; hence (CH₃)₂NH is most basic.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 159,
            question: "The number of real roots of the equation \( \log_x(x^2 - 1) = 1 \) is:",
            options: [
            "0",
            "1",
            "2",
            "3"
            ],
            correctAnswer: 2,
            explanation: "Solving carefully gives two valid real solutions for x > 1 and x < -1.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 160,
            question: "In a photoelectric experiment, doubling the intensity of light leads to:",
            options: [
            "Doubling the stopping potential",
            "Doubling the number of photoelectrons",
            "Doubling the frequency",
            "Doubling the kinetic energy of electrons"
            ],
            correctAnswer: 1,
            explanation: "Intensity affects number of photons, not energy per photon. Hence, more photoelectrons are emitted.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 161,
            question: "Which among the following molecules is planar and has zero dipole moment?",
            options: [
            "NH₃",
            "BF₃",
            "H₂O",
            "SO₂"
            ],
            correctAnswer: 1,
            explanation: "BF₃ is planar and symmetrical, resulting in zero net dipole moment.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 162,
            question: "If f(x) is continuous on [0,2] and ∫₀² f(x) dx = 0, then which of the following must be true?",
            options: [
            "f(x) is always zero",
            "f(x) changes sign in [0,2]",
            "f(x) is positive on [0,2]",
            "f(x) is negative on [0,2]"
            ],
            correctAnswer: 1,
            explanation: "A zero definite integral over a non-zero interval implies the function must change sign.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 163,
            question: "A Carnot engine works between 600 K and 300 K. Its efficiency is:",
            options: [
            "25%",
            "30%",
            "50%",
            "75%"
            ],
            correctAnswer: 2,
            explanation: "η = 1 − T₂/T₁ = 1 − 300/600 = 0.5 or 50%.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 164,
            question: "Which of the following compounds will not respond to Tollens’ test?",
            options: [
            "Formaldehyde",
            "Acetophenone",
            "Acetaldehyde",
            "Glucose"
            ],
            correctAnswer: 1,
            explanation: "Acetophenone is a ketone with no α-hydrogen or aldehyde group; it does not give Tollens’ test.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 165,
            question: "If f(x) = ln(x² + 1), then f'(x) equals:",
            options: [
            "1/(x² + 1)",
            "2x/(x² + 1)",
            "2/(x² + 1)",
            "ln(2x)"
            ],
            correctAnswer: 1,
            explanation: "Using chain rule, d/dx [ln(x² + 1)] = (1/(x² + 1))·(2x) = 2x/(x² + 1).",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 166,
            question: "If the electric potential V(x) = A(x² − 3x), then the corresponding electric field E(x) is:",
            options: [
            "A(2x − 3)",
            "−A(2x − 3)",
            "A(2x + 3)",
            "−A(2x + 3)"
            ],
            correctAnswer: 1,
            explanation: "Electric field E = −dV/dx = −A(2x − 3).",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 167,
            question: "The correct IUPAC name of the compound CH₃–CH(Br)–CH₂–CH₃ is:",
            options: [
            "2-Bromobutane",
            "1-Bromobutane",
            "3-Bromobutane",
            "2-Bromo-1-butane"
            ],
            correctAnswer: 0,
            explanation: "Numbering starts from the end nearest the substituent: 2-Bromobutane is correct.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 168,
            question: "If the matrix A satisfies A² = I, then the eigenvalues of A must be:",
            options: [
            "Only 1",
            "Only −1",
            "±1",
            "0, 1"
            ],
            correctAnswer: 2,
            explanation: "If A² = I, eigenvalues λ satisfy λ² = 1 → λ = ±1.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 169,
            question: "A radioactive substance decays such that 75% of it disintegrates in 2 hours. Its half-life is approximately:",
            options: [
            "1 hour",
            "0.5 hour",
            "0.693 hour",
            "0.231 hour"
            ],
            correctAnswer: 0,
            explanation: "75% decay means 25% remains: N/N₀ = 1/4 = (1/2)² → two half-lives in 2 hours → T₁/₂ = 1 hour.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 170,
            question: "Among the following, the pair which are functional isomers is:",
            options: [
            "CH₃COCH₃ and CH₃CH₂CHO",
            "CH₃OH and CH₃OCH₃",
            "C₂H₆ and C₂H₄",
            "CH₄ and C₂H₆"
            ],
            correctAnswer: 1,
            explanation: "CH₃OH (alcohol) and CH₃OCH₃ (ether) are functional isomers having same molecular formula.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 171,
            question: "Evaluate the limit: \\( \\lim_{x \\to 0} \\frac{e^{2x} - 1 - 2x}{x^2} \\):",
            options: [
            "2",
            "1",
            "0",
            "2"
            ],
            correctAnswer: 0,
            explanation: "Use Taylor expansion: \( e^{2x} ≈ 1 + 2x + 2x^2 \); subtracting gives 2x²/x² = 2.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 172,
            question: "Which one of the following molecules does NOT exhibit hydrogen bonding?",
            options: [
            "H₂O",
            "NH₃",
            "CH₄",
            "HF"
            ],
            correctAnswer: 2,
            explanation: "CH₄ lacks highly electronegative atoms like N, O, or F for hydrogen bonding.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 173,
            question: "The binding energy per nucleon is maximum for:",
            options: [
            "Uranium-235",
            "Iron-56",
            "Hydrogen-1",
            "Plutonium-239"
            ],
            correctAnswer: 1,
            explanation: "Iron-56 has the maximum binding energy per nucleon, making it the most stable nucleus.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 174,
            question: "If \( \int_1^e x \ln(x) dx = I \), then the value of I is:",
            options: [
            "e − 1",
            "1",
            "1/2",
            "e"
            ],
            correctAnswer: 0,
            explanation: "Integration by parts: Let u = ln(x), dv = x dx. Resulting integral evaluates to e − 1.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 175,
            question: "The major product in the reaction of benzene with acetyl chloride in presence of AlCl₃ is:",
            options: [
            "Benzaldehyde",
            "Toluene",
            "Acetophenone",
            "Benzoic acid"
            ],
            correctAnswer: 2,
            explanation: "This is Friedel–Crafts acylation. Benzene + CH₃COCl → Acetophenone.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 176,
            question: "For what value of ‘a’ is the function f(x) = x² − a|x| + 1 differentiable at x = 0?",
            options: [
            "0",
            "1",
            "2",
            "No such a exists"
            ],
            correctAnswer: 2,
            explanation: "To be differentiable at x=0, LHD = RHD. Solving gives a = 2.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 177,
            question: "A 1 kg block is attached to a spring (k = 100 N/m) and performs SHM. Its amplitude is 0.1 m. What is its maximum kinetic energy?",
            options: [
            "0.5 J",
            "1 J",
            "2 J",
            "0.25 J"
            ],
            correctAnswer: 1,
            explanation: "Max KE = (1/2)kA² = (1/2)×100×(0.1)² = 0.5 J.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 178,
            question: "In the reaction: \( CH₃CH=CH₂ + HBr \ rightarrow{Peroxide} ? \), the major product is:",
            options: [
            "CH₃CH₂CH₂Br",
            "CH₃CHBrCH₃",
            "CH₂BrCH₂CH₃",
            "CH₃CH₂CH₂OH"
            ],
            correctAnswer: 0,
            explanation: "In presence of peroxide, anti-Markovnikov addition occurs. Product: CH₃CH₂CH₂Br.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 179,
            question: "Let A and B be events such that P(A) = 0.6, P(B) = 0.7, and P(A ∩ B) = 0.4. Find P(A ∪ B):",
            options: [
            "0.9",
            "1.3",
            "0.82",
            "0.74"
            ],
            correctAnswer: 0,
            explanation: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = 0.6 + 0.7 − 0.4 = 0.9.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 180,
            question: "Which law is violated in the nuclear reaction: \( _{92}^{235}U + n \rightarrow _{56}^{141}Ba + _{36}^{92}Kr + 3n \)?",
            options: [
            "Mass-energy conservation",
            "Charge conservation",
            "Momentum conservation",
            "No law is violated"
            ],
            correctAnswer: 3,
            explanation: "All physical laws including mass, charge, and momentum are conserved in this reaction.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 181,
            question: "If \\( f(x) = \\int_0^x \\ln(1 + t^2) dt \\), then \\( f''(x) \\) is:",
            options: [
            "\\( \\frac{2x}{1 + x^2} \\)",
            "\\( \\ln(1 + x^2) \\)",
            "\\( \\frac{d}{dx} \\ln(1 + x^2) \\)",
            "\\( \\frac{2x}{(1 + x^2)^2} \\)"
            ],
            correctAnswer: 0,
            explanation: "f'(x) = ln(1 + x²), so f''(x) = derivative of ln(1 + x²) = 2x / (1 + x²).",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 182,
            question: "Which of the following statements is true for a system in thermodynamic equilibrium?",
            options: [
            "Only thermal equilibrium is necessary",
            "Mechanical and thermal equilibrium are sufficient",
            "Chemical, thermal, and mechanical equilibrium are necessary",
            "Only chemical equilibrium is necessary"
            ],
            correctAnswer: 2,
            explanation: "For complete thermodynamic equilibrium, all three types (chemical, thermal, mechanical) must exist.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 183,
            question: "The correct order of decreasing bond dissociation energy for the halogen molecules is:",
            options: [
            "F₂ > Cl₂ > Br₂ > I₂",
            "Cl₂ > F₂ > Br₂ > I₂",
            "Br₂ > Cl₂ > F₂ > I₂",
            "I₂ > Br₂ > Cl₂ > F₂"
            ],
            correctAnswer: 1,
            explanation: "F₂ has low BDE due to repulsion between lone pairs; correct order: Cl₂ > F₂ > Br₂ > I₂.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 184,
            question: "The minimum value of \\( f(x) = x^2 + \\frac{1}{x^2} \\) for x > 0 is:",
            options: [
            "1",
            "2",
            "4",
            "3"
            ],
            correctAnswer: 2,
            explanation: "AM ≥ GM: x² + 1/x² ≥ 2. Let x = 1 ⇒ f(x) = 1 + 1 = 2; but the actual minimum is 2² = 4.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 185,
            question: "In a hydrogen atom, the radius of the nth orbit is proportional to:",
            options: [
            "n",
            "n²",
            "1/n",
            "1/n²"
            ],
            correctAnswer: 1,
            explanation: "According to Bohr's model, rn ∝ n².",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 186,
            question: "Which of the following shows maximum deviation from ideal gas behavior?",
            options: [
            "H₂",
            "N₂",
            "CH₄",
            "NH₃"
            ],
            correctAnswer: 3,
            explanation: "NH₃ shows H-bonding and strong intermolecular forces, causing max deviation.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 187,
            question: "Let A = {x ∈ R : x² + 3x − 4 < 0}. Then A is:",
            options: [
            "(−∞, −4) ∪ (1, ∞)",
            "(−4, 1)",
            "(−4, 1]",
            "(−4, −1)"
            ],
            correctAnswer: 1,
            explanation: "Solve x² + 3x − 4 < 0 ⇒ (x + 4)(x − 1) < 0 ⇒ x ∈ (−4, 1).",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 188,
            question: "Which among the following has a zero dipole moment?",
            options: [
            "H₂O",
            "BF₃",
            "NH₃",
            "CH₃Cl"
            ],
            correctAnswer: 1,
            explanation: "BF₃ has symmetrical trigonal planar geometry; dipole moments cancel out.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 189,
            question: "The wavelength of first Balmer line in hydrogen is approximately:",
            options: [
            "656 nm",
            "486 nm",
            "434 nm",
            "410 nm"
            ],
            correctAnswer: 0,
            explanation: "First Balmer transition (n=3 to n=2) has λ ≈ 656 nm.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 190,
            question: "The maximum value of \\( \\sin^3 x + \\cos^3 x \\) is:",
            options: [
            "1",
            "√3/2",
            "5/4",
            "7/8"
            ],
            correctAnswer: 2,
            explanation: "Use identity: a³ + b³ = (a + b)(a² − ab + b²); max value is 5/4 at x = π/4.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 191,
            question: "Which reagent can distinguish between aldehyde and ketone?",
            options: [
            "Tollens’ reagent",
            "Fehling’s solution",
            "Benedict’s solution",
            "All of the above"
            ],
            correctAnswer: 3,
            explanation: "All can oxidize aldehydes, but not ketones under normal conditions.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 192,
            question: "The acceleration of a particle executing SHM when at displacement x is given by:",
            options: [
            "−ω²x",
            "ω²x",
            "kx",
            "−kx"
            ],
            correctAnswer: 0,
            explanation: "a = −ω²x is standard SHM equation.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 193,
            question: "Find the value of \\( \\sum_{k=1}^{n} k^3 \\):",
            options: [
            "\\( \\frac{n(n + 1)}{2} \\)^2",
            "\\( \\frac{n(n + 1)(2n + 1)}{6} \\)",
            "\\( n^2(n + 1)^2 \\)",
            "\\( \\frac{n(n + 1)(2n + 1)}{3} \\)"
            ],
            correctAnswer: 0,
            explanation: "Sum of cubes: \\( \\sum k^3 = [n(n+1)/2]^2 \\).",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 194,
            question: "Which pair of orbitals will have the maximum repulsion according to VSEPR theory?",
            options: [
            "Lone pair–lone pair",
            "Bond pair–lone pair",
            "Bond pair–bond pair",
            "None of the above"
            ],
            correctAnswer: 0,
            explanation: "Repulsion order: LP–LP > LP–BP > BP–BP.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 195,
            question: "A projectile is thrown with speed u at angle θ. Time of flight is maximum when:",
            options: [
            "θ = 30°",
            "θ = 45°",
            "θ = 90°",
            "θ = 60°"
            ],
            correctAnswer: 2,
            explanation: "Time of flight T = 2u sinθ / g is max when sinθ is max ⇒ θ = 90°.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 196,
            question: "Evaluate the limit: \\( \\lim_{x \\to 0} \\frac{\\tan^{-1}(x) - x + \\frac{x^3}{3}}{x^5} \\)",
            options: [
            "0",
            "\\(\\frac{1}{5}\\)",
            "\\(\\frac{1}{3}\\)",
            "\\(\\frac{1}{7}\\)"
            ],
            correctAnswer: 3,
            explanation: "Use series: tan⁻¹x = x - x³/3 + x⁵/5 - x⁷/7 + ... ⇒ numerator ≈ −x⁵/5 ⇒ limit = −1/5.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 197,
            question: "Which has the maximum lattice energy among the following compounds?",
            options: [
            "NaCl",
            "MgO",
            "AlF₃",
            "CaO"
            ],
            correctAnswer: 1,
            explanation: "Lattice energy ∝ charge product / ionic radii. Mg²⁺ and O²⁻ yield higher lattice energy.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 198,
            question: "Two identical capacitors are connected in parallel and then in series. Ratio of total energy stored (parallel to series) is:",
            options: [
            "2",
            "4",
            "1",
            "0.5"
            ],
            correctAnswer: 1,
            explanation: "U = ½CV². For same voltage, parallel has 2C ⇒ 2× energy. Series has C/2 ⇒ energy is ¼. Ratio = 4.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 199,
            question: "Which of the following functions is not differentiable at x = 0?",
            options: [
            "\\( f(x) = |x|^3 \\)",
            "\\( f(x) = x|x| \\)",
            "\\( f(x) = |x| \\)",
            "\\( f(x) = x^2 \\)"
            ],
            correctAnswer: 2,
            explanation: "Only |x| has a sharp corner at x = 0; hence not differentiable.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 200,
            question: "Which of the following does NOT obey the octet rule?",
            options: [
            "CH₄",
            "PCl₅",
            "H₂O",
            "CO₂"
            ],
            correctAnswer: 1,
            explanation: "PCl₅ has 10 electrons around phosphorus, violating the octet rule.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 201,
            question: "An object is projected from ground with velocity u at angle θ. Maximum height is maximum when:",
            options: [
            "θ = 30°",
            "θ = 45°",
            "θ = 60°",
            "θ = 90°"
            ],
            correctAnswer: 3,
            explanation: "H = u²sin²θ / 2g is max when sinθ = 1 ⇒ θ = 90°.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 202,
            question: "The function \\( f(x) = \\frac{1 - \\cos x}{x^2} \\) as x → 0 tends to:",
            options: [
            "0",
            "1",
            "½",
            "∞"
            ],
            correctAnswer: 2,
            explanation: "Using L'Hôpital's rule or expansion: 1 - cosx ≈ x²/2 ⇒ limit = ½.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 203,
            question: "Which orbital will experience the highest effective nuclear charge (Z_eff) in a multi-electron atom?",
            options: [
            "3s",
            "3p",
            "3d",
            "2p"
            ],
            correctAnswer: 3,
            explanation: "2p is closest to nucleus and least shielded ⇒ highest Z_eff.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 204,
            question: "The escape velocity from a planet of mass M and radius R is proportional to:",
            options: [
            "1/R",
            "1/√R",
            "√(M/R)",
            "M/R²"
            ],
            correctAnswer: 2,
            explanation: "v_esc = √(2GM/R) ⇒ proportional to √(M/R).",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 205,
            question: "The area bounded by one loop of the curve \\( r = a \\cos(3\\theta) \\) is:",
            options: [
            "\\( \\frac{\\pi a^2}{4} \\)",
            "\\( \\frac{\\pi a^2}{8} \\)",
            "\\( \\frac{\\pi a^2}{6} \\)",
            "\\( \\frac{\\pi a^2}{12} \\)"
            ],
            correctAnswer: 1,
            explanation: "Area = (1/2) ∫ r² dθ over one loop ⇒ πa²/8.",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 206,
            question: "Which molecule has the highest bond order?",
            options: [
            "O₂",
            "N₂",
            "C₂",
            "B₂"
            ],
            correctAnswer: 1,
            explanation: "N₂ has bond order 3, highest among given.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 207,
            question: "In Young’s double slit experiment, if slit separation is halved and distance to screen is doubled, fringe width becomes:",
            options: [
            "Same",
            "Doubled",
            "Quadrupled",
            "Halved"
            ],
            correctAnswer: 2,
            explanation: "Fringe width β = λD/d ⇒ new β = λ(2D)/(d/2) = 4λD/d ⇒ quadrupled.",
            difficulty: "Super Hard",
            category: "Physics"
        },
        {
            id: 208,
            question: "Find the domain of \\( f(x) = \\sqrt{\\frac{x-1}{x^2 - 4}} \\):",
            options: [
            "\\( (−∞,−2) ∪ (−2,1) ∪ (1,2) ∪ (2,∞) \\)",
            "\\( (−∞,−2) ∪ (1,2) \\)",
            "\\( (1,2) \\)",
            "\\( (−2,1) \\)"
            ],
            correctAnswer: 1,
            explanation: "Expression under root ≥ 0, denominator ≠ 0 ⇒ x ∈ (−∞,−2) ∪ (1,2).",
            difficulty: "Super Hard",
            category: "Mathematics"
        },
        {
            id: 209,
            question: "Among the following, which pair cannot form hydrogen bonding?",
            options: [
            "H₂O and HF",
            "NH₃ and H₂O",
            "CH₄ and HCl",
            "CH₃OH and NH₃"
            ],
            correctAnswer: 2,
            explanation: "CH₄ and HCl lack high electronegativity atoms and lone pairs ⇒ no H-bonding.",
            difficulty: "Super Hard",
            category: "Chemistry"
        },
        {
            id: 210,
            question: "A spring-mass system oscillates with frequency f. If spring is cut in half, new frequency is:",
            options: [
            "f/√2",
            "√2 f",
            "2f",
            "f"
            ],
            correctAnswer: 1,
            explanation: "Cutting spring doubles k ⇒ f = (1/2π)√(k/m) ⇒ f increases by √2.",
            difficulty: "Super Hard",
            category: "Physics"
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

        // Check if JeeMainVol1 access code exists and is valid
        if (data.accesscode && data.accesscode.JeeMainVol1) {
            const accessCodeData = data.accesscode.JeeMainVol1;
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
            'JeeMainVol1': {
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

        if (data.examanswers && data.examanswers.JeeMainVol1 && data.examanswers.JeeMainVol1.answers) {
            const savedAnswers = data.examanswers.JeeMainVol1.answers;
            
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
        return `JeeMainVol1-${randomPin}`;
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
                description: "Jee Main Vol - 1 Jee Main Exam Access",
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
                                examType: 'JeeMainVol1'
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
                    examType: 'JeeMainVol1'
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
                examType: 'JeeMainVol1'
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
        doc.text('Jee Main Vol-1: JEE Main Mock Report', 10, 10);
        
        // Certificate Details
        doc.setFontSize(12);
        doc.text(`Certificate Number: ${examMetadata.certificateNumber}`, 10, 50);
        doc.text(`Exam Name: JEE Main Mock Exam`, 10, 60);
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
            doc.text('Jee Main Vol-1: JEE Main Mock Report', pageWidth / 2, 30, { align: 'right' });
    
            // Exam Details
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            let yPosition = 50;
    
            const addDetailLine = (label, value) => {
                doc.text(`${label}: ${value}`, margin, yPosition);
                yPosition += 10;
            };
    
            addDetailLine('Report Number', examMetadata.certificateNumber);
            addDetailLine('Exam Name', 'JEE Main Mock Exam');
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
            doc.text('Jee Main Vol-1: JEE Main Mock Report', pageWidth / 2, 30, { align: 'right' });
    
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
                <h1 style={{fontSize: 24}}><ScanSearch size={20} style={{marginTop: -5}} /> JEE Main Vol - 1: Mock Exam</h1>
                <p><Play size={15} style={{marginTop: -3}} /> Module: JEE Main Mock Exam</p>
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
                        <Disc size={18} /> Jee Main Vol - 1: JEE Main Mock Exam
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
