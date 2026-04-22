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


export default function NeetPractice1() {
    const questions = [
        {
            id: 1,
            question: "Which of the following is a scalar quantity?",
            options: [
              "Velocity",
              "Acceleration",
              "Force",
              "Speed"
            ],
            correctAnswer: 3,
            explanation: "Speed has magnitude only and no direction, making it a scalar quantity.",
            difficulty: "Easy",
            category: "Physics"
          },
          {
            id: 2,
            question: "What is the SI unit of electric current?",
            options: [
              "Volt",
              "Ohm",
              "Ampere",
              "Coulomb"
            ],
            correctAnswer: 2,
            explanation: "The SI unit of electric current is Ampere, which measures the flow of electric charge.",
            difficulty: "Easy",
            category: "Physics"
          },
          {
            id: 3,
            question: "Which of the following elements has the highest electronegativity?",
            options: [
              "Oxygen",
              "Fluorine",
              "Chlorine",
              "Nitrogen"
            ],
            correctAnswer: 1,
            explanation: "Fluorine has the highest electronegativity due to its high effective nuclear charge and small atomic radius.",
            difficulty: "Easy",
            category: "Chemistry"
          },
          {
            id: 4,
            question: "What is the pH of a neutral solution at 25°C?",
            options: [
              "0",
              "7",
              "14",
              "1"
            ],
            correctAnswer: 1,
            explanation: "A neutral solution has a pH of 7 at 25°C, indicating equal concentrations of H⁺ and OH⁻ ions.",
            difficulty: "Easy",
            category: "Chemistry"
          },
          {
            id: 5,
            question: "Which plant hormone is responsible for cell elongation?",
            options: [
              "Cytokinin",
              "Gibberellin",
              "Auxin",
              "Ethylene"
            ],
            correctAnswer: 2,
            explanation: "Auxins promote cell elongation by loosening cell walls, facilitating growth.",
            difficulty: "Easy",
            category: "Botany"
          },
          {
            id: 6,
            question: "Which part of the human brain is responsible for maintaining posture and balance?",
            options: [
              "Cerebrum",
              "Cerebellum",
              "Medulla oblongata",
              "Hypothalamus"
            ],
            correctAnswer: 1,
            explanation: "The cerebellum coordinates voluntary movements and maintains posture and balance.",
            difficulty: "Easy",
            category: "Zoology"
          },
          {
            id: 7,
            question: "Which of the following is a greenhouse gas?",
            options: [
              "Oxygen",
              "Nitrogen",
              "Carbon dioxide",
              "Hydrogen"
            ],
            correctAnswer: 2,
            explanation: "Carbon dioxide traps heat in the atmosphere, contributing to the greenhouse effect.",
            difficulty: "Easy",
            category: "Chemistry"
          },
          {
            id: 8,
            question: "Which blood group is known as the universal donor?",
            options: [
              "A",
              "B",
              "AB",
              "O"
            ],
            correctAnswer: 3,
            explanation: "Blood group O lacks A and B antigens, making it compatible with all other blood types.",
            difficulty: "Easy",
            category: "Zoology"
          },
          {
            id: 9,
            question: "Which gas is released during photosynthesis?",
            options: [
              "Carbon dioxide",
              "Oxygen",
              "Nitrogen",
              "Hydrogen"
            ],
            correctAnswer: 1,
            explanation: "Oxygen is released as a byproduct during the light-dependent reactions of photosynthesis.",
            difficulty: "Easy",
            category: "Botany"
          },
          {
            id: 10,
            question: "What is the basic unit of heredity?",
            options: [
              "Chromosome",
              "DNA",
              "Gene",
              "RNA"
            ],
            correctAnswer: 2,
            explanation: "A gene is a segment of DNA that encodes for a specific protein, serving as the basic unit of heredity.",
            difficulty: "Easy",
            category: "Botany"
          },
          {
            id: 11,
            question: "Which vitamin is synthesized by the skin upon exposure to sunlight?",
            options: [
              "Vitamin A",
              "Vitamin B12",
              "Vitamin C",
              "Vitamin D"
            ],
            correctAnswer: 3,
            explanation: "Vitamin D is synthesized in the skin when exposed to ultraviolet rays from sunlight.",
            difficulty: "Easy",
            category: "Zoology"
          },
          {
            id: 12,
            question: "Which of the following is not a component of the cell membrane?",
            options: [
              "Phospholipids",
              "Proteins",
              "Cholesterol",
              "DNA"
            ],
            correctAnswer: 3,
            explanation: "DNA is located in the nucleus and is not a component of the cell membrane.",
            difficulty: "Easy",
            category: "Botany"
          },
          {
            id: 13,
            question: "Which organ is primarily responsible for detoxification in the human body?",
            options: [
              "Heart",
              "Liver",
              "Kidney",
              "Lungs"
            ],
            correctAnswer: 1,
            explanation: "The liver detoxifies various metabolites and processes drugs and alcohol.",
            difficulty: "Easy",
            category: "Zoology"
          },
          {
            id: 14,
            question: "Which of the following is a non-renewable source of energy?",
            options: [
              "Solar energy",
              "Wind energy",
              "Coal",
              "Hydroelectric energy"
            ],
            correctAnswer: 2,
            explanation: "Coal is a fossil fuel that cannot be replenished on a human timescale, making it non-renewable.",
            difficulty: "Easy",
            category: "Physics"
          },
          {
            id: 15,
            question: "What is the chemical formula of water?",
            options: [
              "H2O",
              "CO2",
              "O2",
              "NaCl"
            ],
            correctAnswer: 0,
            explanation: "Water consists of two hydrogen atoms bonded to one oxygen atom, hence H2O.",
            difficulty: "Easy",
            category: "Chemistry"
          },
          {
            id: 16,
            question: "Which organ in the human body produces insulin?",
            options: [
              "Liver",
              "Pancreas",
              "Stomach",
              "Kidney"
            ],
            correctAnswer: 1,
            explanation: "The pancreas produces insulin, which regulates blood glucose levels.",
            difficulty: "Easy",
            category: "Human Physiology"
          },
          {
            id: 17,
            question: "What is the basic unit of heredity?",
            options: [
              "Chromosome",
              "Gene",
              "DNA",
              "RNA"
            ],
            correctAnswer: 1,
            explanation: "A gene is the basic physical and functional unit of heredity.",
            difficulty: "Easy",
            category: "Genetics"
          },
          {
            id: 18,
            question: "Which vitamin is primarily obtained from sunlight?",
            options: [
              "Vitamin A",
              "Vitamin B12",
              "Vitamin C",
              "Vitamin D"
            ],
            correctAnswer: 3,
            explanation: "Vitamin D is synthesized in the skin upon exposure to sunlight.",
            difficulty: "Easy",
            category: "Biology"
          },
          {
            id: 19,
            question: "Which gas is used by plants during photosynthesis?",
            options: [
              "Oxygen",
              "Carbon dioxide",
              "Nitrogen",
              "Hydrogen"
            ],
            correctAnswer: 1,
            explanation: "Plants absorb carbon dioxide from the atmosphere to perform photosynthesis.",
            difficulty: "Easy",
            category: "Botany"
          },
          {
            id: 20,
            question: "Which blood cells help in clotting of blood?",
            options: [
              "Red blood cells",
              "White blood cells",
              "Platelets",
              "Plasma"
            ],
            correctAnswer: 2,
            explanation: "Platelets, also called thrombocytes, are responsible for blood clotting.",
            difficulty: "Easy",
            category: "Human Physiology"
          },
          {
            id: 21,
            question: "Which part of the plant conducts water?",
            options: [
              "Phloem",
              "Xylem",
              "Cambium",
              "Parenchyma"
            ],
            correctAnswer: 1,
            explanation: "Xylem conducts water and minerals from roots to aerial parts of the plant.",
            difficulty: "Easy",
            category: "Botany"
          },
          {
            id: 22,
            question: "Which type of reproduction involves only one parent?",
            options: [
              "Sexual reproduction",
              "Vegetative propagation",
              "Asexual reproduction",
              "Binary fission"
            ],
            correctAnswer: 2,
            explanation: "Asexual reproduction involves a single parent and produces genetically identical offspring.",
            difficulty: "Easy",
            category: "Reproduction"
          },
          {
            id: 23,
            question: "Which enzyme breaks down starch into sugar?",
            options: [
              "Lipase",
              "Pepsin",
              "Amylase",
              "Trypsin"
            ],
            correctAnswer: 2,
            explanation: "Amylase breaks down starch into simple sugars.",
            difficulty: "Easy",
            category: "Biomolecules"
          },
          {
            id: 24,
            question: "Which of the following is a connective tissue?",
            options: [
              "Muscle",
              "Nerve",
              "Blood",
              "Skin"
            ],
            correctAnswer: 2,
            explanation: "Blood is considered a connective tissue because it connects body systems by transporting nutrients and waste.",
            difficulty: "Easy",
            category: "Tissues"
          },
          {
            id: 25,
            question: "What is the shape of the DNA molecule?",
            options: [
              "Linear chain",
              "Zigzag",
              "Double helix",
              "Spiral cord"
            ],
            correctAnswer: 2,
            explanation: "The DNA molecule has a double helix shape, consisting of two strands twisted around each other.",
            difficulty: "Easy",
            category: "Genetics"
          },
          {
            id: 26,
            question: "Which pigment gives green color to leaves?",
            options: [
              "Chlorophyll",
              "Carotene",
              "Xanthophyll",
              "Anthocyanin"
            ],
            correctAnswer: 0,
            explanation: "Chlorophyll absorbs light for photosynthesis and gives leaves their green color.",
            difficulty: "Easy",
            category: "Botany"
          },
          {
            id: 27,
            question: "Which disease is caused by the deficiency of iodine?",
            options: [
              "Anemia",
              "Goiter",
              "Rickets",
              "Scurvy"
            ],
            correctAnswer: 1,
            explanation: "Iodine deficiency leads to goiter, a swelling of the thyroid gland.",
            difficulty: "Easy",
            category: "Health & Nutrition"
          },
          {
            id: 28,
            question: "Which structure in the cell is known as the control center?",
            options: [
              "Mitochondria",
              "Ribosome",
              "Nucleus",
              "Golgi body"
            ],
            correctAnswer: 2,
            explanation: "The nucleus contains genetic material and controls cell activities.",
            difficulty: "Easy",
            category: "Cell Biology"
          },
          {
            id: 29,
            question: "Which of the following is an excretory organ in humans?",
            options: [
              "Lungs",
              "Heart",
              "Liver",
              "Kidney"
            ],
            correctAnswer: 3,
            explanation: "The kidneys filter blood and remove waste as urine.",
            difficulty: "Easy",
            category: "Excretory System"
          },
          {
            id: 30,
            question: "Which among the following is the smallest bone in the human body?",
            options: [
              "Femur",
              "Stapes",
              "Ulna",
              "Humerus"
            ],
            correctAnswer: 1,
            explanation: "The stapes, located in the middle ear, is the smallest bone in the human body.",
            difficulty: "Easy",
            category: "Human Anatomy"
          },
          {
            id: 31,
            question: "Which hormone is responsible for the 'fight or flight' response?",
            options: [
              "Insulin",
              "Adrenaline",
              "Thyroxine",
              "Estrogen"
            ],
            correctAnswer: 1,
            explanation: "Adrenaline is secreted by the adrenal glands during stress and prepares the body for quick action.",
            difficulty: "Medium",
            category: "Human Physiology"
          },
          {
            id: 32,
            question: "Which structure in the kidney filters blood to form urine?",
            options: [
              "Loop of Henle",
              "Bowman's capsule",
              "Collecting duct",
              "Renal pelvis"
            ],
            correctAnswer: 1,
            explanation: "Bowman's capsule is part of the nephron that encloses the glomerulus and filters blood plasma.",
            difficulty: "Medium",
            category: "Excretory System"
          },
          {
            id: 33,
            question: "In which phase of mitosis do chromosomes align at the equatorial plate?",
            options: [
              "Prophase",
              "Metaphase",
              "Anaphase",
              "Telophase"
            ],
            correctAnswer: 1,
            explanation: "During metaphase, chromosomes line up along the metaphase plate for equal division.",
            difficulty: "Medium",
            category: "Cell Division"
          },
          {
            id: 34,
            question: "What is the function of the enzyme DNA polymerase?",
            options: [
              "Replication of RNA",
              "Joining Okazaki fragments",
              "Catalyzing DNA synthesis",
              "Unwinding DNA strands"
            ],
            correctAnswer: 2,
            explanation: "DNA polymerase catalyzes the synthesis of new DNA strands using existing strands as templates.",
            difficulty: "Medium",
            category: "Genetics"
          },
          {
            id: 35,
            question: "Which plant hormone is responsible for cell elongation?",
            options: [
              "Cytokinin",
              "Ethylene",
              "Gibberellin",
              "Auxin"
            ],
            correctAnswer: 3,
            explanation: "Auxins promote elongation of cells, especially in the shoot system.",
            difficulty: "Medium",
            category: "Plant Physiology"
          },
          {
            id: 36,
            question: "Which part of the human brain regulates balance and coordination?",
            options: [
              "Cerebrum",
              "Medulla oblongata",
              "Thalamus",
              "Cerebellum"
            ],
            correctAnswer: 3,
            explanation: "The cerebellum is responsible for maintaining posture, balance, and coordination.",
            difficulty: "Medium",
            category: "Neural Control"
          },
          {
            id: 37,
            question: "What is the genetic makeup of Turner’s syndrome?",
            options: [
              "XXY",
              "XO",
              "XXX",
              "XY"
            ],
            correctAnswer: 1,
            explanation: "Turner’s syndrome occurs in females with a single X chromosome (XO).",
            difficulty: "Medium",
            category: "Human Genetics"
          },
          {
            id: 38,
            question: "Which of the following is the first enzyme to act on carbohydrates in the digestive tract?",
            options: [
              "Pepsin",
              "Trypsin",
              "Salivary amylase",
              "Lipase"
            ],
            correctAnswer: 2,
            explanation: "Salivary amylase begins the digestion of starch in the mouth.",
            difficulty: "Medium",
            category: "Digestive System"
          },
          {
            id: 39,
            question: "Which part of the chloroplast contains the photosynthetic pigment?",
            options: [
              "Stroma",
              "Thylakoid",
              "Granum",
              "Matrix"
            ],
            correctAnswer: 1,
            explanation: "Thylakoids are membrane-bound compartments that contain chlorophyll.",
            difficulty: "Medium",
            category: "Photosynthesis"
          },
          {
            id: 40,
            question: "Which law explains the segregation of alleles during gamete formation?",
            options: [
              "Law of Independent Assortment",
              "Law of Segregation",
              "Law of Dominance",
              "Law of Variation"
            ],
            correctAnswer: 1,
            explanation: "Mendel’s Law of Segregation states that allele pairs separate during gamete formation.",
            difficulty: "Medium",
            category: "Genetics"
          },
          {
            id: 41,
            question: "What is the role of calcium ions in muscle contraction?",
            options: [
              "Initiates ATP synthesis",
              "Stimulates neuron firing",
              "Unblocks actin-binding sites",
              "Maintains muscle tone"
            ],
            correctAnswer: 2,
            explanation: "Calcium ions bind to troponin, causing tropomyosin to shift and expose binding sites on actin.",
            difficulty: "Medium",
            category: "Locomotion"
          },
          {
            id: 42,
            question: "Which group of animals belongs to the phylum Echinodermata?",
            options: [
              "Snails and slugs",
              "Spiders and scorpions",
              "Starfish and sea urchins",
              "Earthworms and leeches"
            ],
            correctAnswer: 2,
            explanation: "Echinoderms like starfish and sea urchins have radial symmetry and water vascular systems.",
            difficulty: "Medium",
            category: "Animal Kingdom"
          },
          {
            id: 43,
            question: "Which of the following is not a greenhouse gas?",
            options: [
              "Carbon dioxide",
              "Methane",
              "Nitrous oxide",
              "Oxygen"
            ],
            correctAnswer: 3,
            explanation: "Oxygen does not trap heat and is not considered a greenhouse gas.",
            difficulty: "Medium",
            category: "Ecology"
          },
          {
            id: 44,
            question: "Which component of blood helps in immunity?",
            options: [
              "Red blood cells",
              "White blood cells",
              "Platelets",
              "Plasma"
            ],
            correctAnswer: 1,
            explanation: "White blood cells defend the body against infections and diseases.",
            difficulty: "Medium",
            category: "Human Physiology"
          },
          {
            id: 45,
            question: "In which organelle does the Krebs cycle occur?",
            options: [
              "Cytoplasm",
              "Nucleus",
              "Mitochondria",
              "Golgi apparatus"
            ],
            correctAnswer: 2,
            explanation: "The Krebs cycle, part of cellular respiration, takes place in the mitochondrial matrix.",
            difficulty: "Medium",
            category: "Cellular Respiration"
          },
          {
            id: 46,
            question: "Which vitamin is essential for the synthesis of prothrombin?",
            options: [
              "Vitamin A",
              "Vitamin B12",
              "Vitamin K",
              "Vitamin C"
            ],
            correctAnswer: 2,
            explanation: "Vitamin K is necessary for blood clotting and aids in the synthesis of prothrombin.",
            difficulty: "Medium",
            category: "Human Physiology"
          },
          {
            id: 47,
            question: "Which of the following is a symbiotic nitrogen-fixing bacterium?",
            options: [
              "Azotobacter",
              "Rhizobium",
              "Clostridium",
              "Nitrobacter"
            ],
            correctAnswer: 1,
            explanation: "Rhizobium forms a symbiotic relationship with leguminous plants and fixes nitrogen.",
            difficulty: "Medium",
            category: "Biological Classification"
          },
          {
            id: 48,
            question: "Which component of the eye controls the size of the pupil?",
            options: [
              "Cornea",
              "Retina",
              "Lens",
              "Iris"
            ],
            correctAnswer: 3,
            explanation: "The iris regulates the amount of light entering the eye by controlling the pupil size.",
            difficulty: "Medium",
            category: "Human Physiology"
          },
          {
            id: 49,
            question: "In DNA, which nitrogenous base pairs with cytosine?",
            options: [
              "Thymine",
              "Adenine",
              "Guanine",
              "Uracil"
            ],
            correctAnswer: 2,
            explanation: "In DNA, guanine pairs with cytosine via three hydrogen bonds.",
            difficulty: "Medium",
            category: "Molecular Biology"
          },
          {
            id: 50,
            question: "Which of the following is a vestigial organ in humans?",
            options: [
              "Liver",
              "Appendix",
              "Pancreas",
              "Gall bladder"
            ],
            correctAnswer: 1,
            explanation: "The appendix is considered a vestigial organ as it has lost much of its ancestral function.",
            difficulty: "Medium",
            category: "Evolution"
          },
          {
            id: 51,
            question: "Which of the following diseases is caused by a protozoan?",
            options: [
              "Tuberculosis",
              "Malaria",
              "Influenza",
              "Ringworm"
            ],
            correctAnswer: 1,
            explanation: "Malaria is caused by the protozoan Plasmodium, transmitted by Anopheles mosquitoes.",
            difficulty: "Medium",
            category: "Human Health and Disease"
          },
          {
            id: 52,
            question: "Which biome is characterized by permafrost?",
            options: [
              "Desert",
              "Tundra",
              "Tropical rainforest",
              "Grassland"
            ],
            correctAnswer: 1,
            explanation: "Tundra is a cold biome with permanently frozen subsoil known as permafrost.",
            difficulty: "Medium",
            category: "Ecology"
          },
          {
            id: 53,
            question: "Which plant tissue is responsible for the transport of water?",
            options: [
              "Xylem",
              "Phloem",
              "Parenchyma",
              "Collenchyma"
            ],
            correctAnswer: 0,
            explanation: "Xylem conducts water and dissolved minerals from roots to other parts of the plant.",
            difficulty: "Medium",
            category: "Plant Anatomy"
          },
          {
            id: 54,
            question: "Which process increases the genetic variation in sexually reproducing organisms?",
            options: [
              "Binary fission",
              "Mutation",
              "Crossing over",
              "Mitosis"
            ],
            correctAnswer: 2,
            explanation: "Crossing over during meiosis increases genetic variability by exchanging DNA segments.",
            difficulty: "Medium",
            category: "Genetics"
          },
          {
            id: 55,
            question: "Which organ secretes the hormone insulin?",
            options: [
              "Liver",
              "Pancreas",
              "Adrenal gland",
              "Pituitary gland"
            ],
            correctAnswer: 1,
            explanation: "Insulin is secreted by the pancreas and helps regulate blood sugar levels.",
            difficulty: "Medium",
            category: "Human Endocrine System"
          },
          {
            id: 56,
            question: "Which of these is an example of passive immunity?",
            options: [
              "Vaccination",
              "Breastfeeding",
              "Recovery from infection",
              "Immunological memory"
            ],
            correctAnswer: 1,
            explanation: "Breastfeeding transfers ready-made antibodies from mother to child, providing passive immunity.",
            difficulty: "Medium",
            category: "Immunity"
          },
          {
            id: 57,
            question: "Which part of the human brain controls involuntary actions like heartbeat?",
            options: [
              "Cerebrum",
              "Cerebellum",
              "Medulla oblongata",
              "Hypothalamus"
            ],
            correctAnswer: 2,
            explanation: "The medulla oblongata controls involuntary activities such as breathing and heartbeat.",
            difficulty: "Medium",
            category: "Neural Control"
          },
          {
            id: 58,
            question: "Which of the following animals is oviparous?",
            options: [
              "Cow",
              "Dog",
              "Frog",
              "Cat"
            ],
            correctAnswer: 2,
            explanation: "Frogs lay eggs and are classified as oviparous animals.",
            difficulty: "Medium",
            category: "Animal Reproduction"
          },
          {
            id: 59,
            question: "Which one of the following structures is not found in a prokaryotic cell?",
            options: [
              "Ribosome",
              "Plasma membrane",
              "Nucleus",
              "Cell wall"
            ],
            correctAnswer: 2,
            explanation: "Prokaryotic cells lack a membrane-bound nucleus.",
            difficulty: "Medium",
            category: "Cell Structure"
          },
          {
            id: 60,
            question: "Which type of RNA carries amino acids to the ribosome?",
            options: [
              "rRNA",
              "mRNA",
              "tRNA",
              "snRNA"
            ],
            correctAnswer: 2,
            explanation: "Transfer RNA (tRNA) carries specific amino acids to the ribosome for protein synthesis.",
            difficulty: "Medium",
            category: "Molecular Biology"
          },
          {
            id: 61,
            question: "Which hormone is responsible for the 'fight or flight' response?",
            options: [
              "Insulin",
              "Thyroxine",
              "Adrenaline",
              "Estrogen"
            ],
            correctAnswer: 2,
            explanation: "Adrenaline, secreted by the adrenal glands, prepares the body for emergency responses.",
            difficulty: "Medium",
            category: "Human Endocrine System"
          },
          {
            id: 62,
            question: "Which of the following organs is the main site for urea formation?",
            options: [
              "Liver",
              "Kidney",
              "Lungs",
              "Heart"
            ],
            correctAnswer: 0,
            explanation: "The liver converts ammonia into urea through the urea cycle.",
            difficulty: "Medium",
            category: "Human Physiology"
          },
          {
            id: 63,
            question: "Which plant hormone promotes seed dormancy?",
            options: [
              "Auxin",
              "Gibberellin",
              "Cytokinin",
              "Abscisic acid"
            ],
            correctAnswer: 3,
            explanation: "Abscisic acid inhibits seed germination and promotes dormancy.",
            difficulty: "Medium",
            category: "Plant Physiology"
          },
          {
            id: 64,
            question: "Which of the following structures is responsible for the absorption of nutrients in the small intestine?",
            options: [
              "Villi",
              "Crypts",
              "Cilia",
              "Microtubules"
            ],
            correctAnswer: 0,
            explanation: "Villi increase the surface area for efficient absorption of nutrients in the small intestine.",
            difficulty: "Medium",
            category: "Human Digestive System"
          },
          {
            id: 65,
            question: "Which part of the nephron is primarily responsible for filtration?",
            options: [
              "Loop of Henle",
              "Distal convoluted tubule",
              "Bowman’s capsule",
              "Collecting duct"
            ],
            correctAnswer: 2,
            explanation: "Bowman’s capsule receives the filtrate from the glomerulus in the nephron.",
            difficulty: "Medium",
            category: "Excretory System"
          },
          {
            id: 66,
            question: "In which phase of mitosis do chromosomes align at the equator?",
            options: [
              "Prophase",
              "Metaphase",
              "Anaphase",
              "Telophase"
            ],
            correctAnswer: 1,
            explanation: "During metaphase, chromosomes align at the cell’s equatorial plane.",
            difficulty: "Medium",
            category: "Cell Cycle"
          },
          {
            id: 67,
            question: "Which disease is caused due to deficiency of iodine?",
            options: [
              "Goitre",
              "Scurvy",
              "Rickets",
              "Night blindness"
            ],
            correctAnswer: 0,
            explanation: "Iodine deficiency leads to enlargement of the thyroid gland, causing goitre.",
            difficulty: "Medium",
            category: "Human Health and Disease"
          },
          {
            id: 68,
            question: "Which of the following is an example of a connective tissue?",
            options: [
              "Muscle",
              "Blood",
              "Skin",
              "Nerve"
            ],
            correctAnswer: 1,
            explanation: "Blood is considered a fluid connective tissue.",
            difficulty: "Medium",
            category: "Animal Tissues"
          },
          {
            id: 69,
            question: "Which of the following is a correct match for a digestive enzyme and its substrate?",
            options: [
              "Lipase – Starch",
              "Amylase – Protein",
              "Pepsin – Protein",
              "Trypsin – Fat"
            ],
            correctAnswer: 2,
            explanation: "Pepsin breaks down proteins into smaller peptides in the stomach.",
            difficulty: "Medium",
            category: "Digestive Enzymes"
          },
          {
            id: 70,
            question: "What type of joint is found between the vertebrae of the spine?",
            options: [
              "Ball and socket",
              "Hinge",
              "Gliding",
              "Pivot"
            ],
            correctAnswer: 2,
            explanation: "Gliding joints between vertebrae allow limited movement and flexibility.",
            difficulty: "Medium",
            category: "Locomotion and Movement"
          },
          {
            id: 71,
            question: "Which layer of the atmosphere is responsible for the ozone layer?",
            options: [
              "Troposphere",
              "Stratosphere",
              "Mesosphere",
              "Thermosphere"
            ],
            correctAnswer: 1,
            explanation: "The ozone layer, which absorbs harmful UV rays, is found in the stratosphere.",
            difficulty: "Medium",
            category: "Environmental Science"
          },
          {
            id: 72,
            question: "Which process is used by green plants to convert sunlight into chemical energy?",
            options: [
              "Respiration",
              "Fermentation",
              "Photosynthesis",
              "Transpiration"
            ],
            correctAnswer: 2,
            explanation: "Photosynthesis uses light energy to synthesize glucose from carbon dioxide and water.",
            difficulty: "Medium",
            category: "Plant Physiology"
          },
          {
            id: 73,
            question: "Which of the following is not a greenhouse gas?",
            options: [
              "Carbon dioxide",
              "Methane",
              "Oxygen",
              "Nitrous oxide"
            ],
            correctAnswer: 2,
            explanation: "Oxygen is not a greenhouse gas; it does not trap heat in the atmosphere.",
            difficulty: "Medium",
            category: "Ecology"
          },
          {
            id: 74,
            question: "Which organelle is known as the 'powerhouse of the cell'?",
            options: [
              "Nucleus",
              "Mitochondria",
              "Golgi apparatus",
              "Lysosome"
            ],
            correctAnswer: 1,
            explanation: "Mitochondria generate ATP through cellular respiration, earning them the title 'powerhouse'.",
            difficulty: "Medium",
            category: "Cell Biology"
          },
          {
            id: 75,
            question: "Which part of the human ear is responsible for maintaining balance?",
            options: [
              "Cochlea",
              "Tympanic membrane",
              "Semicircular canals",
              "Eustachian tube"
            ],
            correctAnswer: 2,
            explanation: "The semicircular canals detect rotational movements and help maintain balance.",
            difficulty: "Medium",
            category: "Neural Control and Coordination"
          },
          {
            id: 76,
            question: "Which of the following elements is an essential component of chlorophyll?",
            options: [
              "Iron",
              "Magnesium",
              "Zinc",
              "Copper"
            ],
            correctAnswer: 1,
            explanation: "Magnesium is the central atom in the chlorophyll molecule, crucial for photosynthesis.",
            difficulty: "Medium",
            category: "Plant Physiology"
          },
          {
            id: 77,
            question: "In which part of the human eye does the image formation take place?",
            options: [
              "Cornea",
              "Retina",
              "Lens",
              "Pupil"
            ],
            correctAnswer: 1,
            explanation: "The retina is the part of the eye where the image is formed and detected by photoreceptors.",
            difficulty: "Medium",
            category: "Human Physiology"
          },
          {
            id: 78,
            question: "What is the main function of the nephron’s glomerulus?",
            options: [
              "Reabsorption of water",
              "Filtration of blood",
              "Secretion of waste",
              "Formation of urine"
            ],
            correctAnswer: 1,
            explanation: "The glomerulus filters blood, allowing small molecules to pass into the Bowman’s capsule.",
            difficulty: "Medium",
            category: "Excretory System"
          },
          {
            id: 79,
            question: "Which part of the plant absorbs water and minerals from the soil?",
            options: [
              "Stem",
              "Leaf",
              "Root",
              "Flower"
            ],
            correctAnswer: 2,
            explanation: "Roots are responsible for absorbing water and essential minerals from the soil.",
            difficulty: "Medium",
            category: "Plant Physiology"
          },
          {
            id: 80,
            question: "Which of the following is the site of aerobic respiration in a cell?",
            options: [
              "Nucleus",
              "Mitochondria",
              "Golgi apparatus",
              "Lysosome"
            ],
            correctAnswer: 1,
            explanation: "Mitochondria are the powerhouse of the cell, where aerobic respiration takes place, producing energy.",
            difficulty: "Medium",
            category: "Cell Biology"
          },
          {
            id: 81,
            question: "Which of the following diseases is caused by a deficiency of vitamin D?",
            options: [
              "Scurvy",
              "Rickets",
              "Pellagra",
              "Beriberi"
            ],
            correctAnswer: 1,
            explanation: "Rickets is caused by vitamin D deficiency, leading to weakened bones in children.",
            difficulty: "Medium",
            category: "Human Health and Disease"
          },
          {
            id: 82,
            question: "Which process helps plants to lose excess water?",
            options: [
              "Transpiration",
              "Absorption",
              "Photosynthesis",
              "Germination"
            ],
            correctAnswer: 0,
            explanation: "Transpiration is the process by which plants lose water vapor through stomata.",
            difficulty: "Medium",
            category: "Plant Physiology"
          },
          {
            id: 83,
            question: "Which component of blood is involved in clotting?",
            options: [
              "Red blood cells",
              "White blood cells",
              "Platelets",
              "Plasma"
            ],
            correctAnswer: 2,
            explanation: "Platelets help in blood clotting by aggregating at the site of injury and forming a clot.",
            difficulty: "Medium",
            category: "Human Physiology"
          },
          {
            id: 84,
            question: "What is the basic unit of heredity?",
            options: [
              "Gene",
              "Chromosome",
              "DNA",
              "RNA"
            ],
            correctAnswer: 0,
            explanation: "Genes are the basic units of heredity, containing instructions for trait inheritance.",
            difficulty: "Medium",
            category: "Genetics"
          },
          {
            id: 85,
            question: "What is the main function of the stomata in plants?",
            options: [
              "Photosynthesis",
              "Transpiration",
              "Absorption of water",
              "Gas exchange"
            ],
            correctAnswer: 3,
            explanation: "Stomata allow for gas exchange (oxygen and carbon dioxide) during photosynthesis.",
            difficulty: "Medium",
            category: "Plant Physiology"
          },
          {
            id: 86,
            question: "Which organ in humans is primarily responsible for the regulation of body temperature?",
            options: [
              "Brain",
              "Heart",
              "Liver",
              "Skin"
            ],
            correctAnswer: 0,
            explanation: "The brain, particularly the hypothalamus, regulates body temperature by triggering responses like sweating or shivering.",
            difficulty: "Medium",
            category: "Human Physiology"
          },
          {
            id: 87,
            question: "Which blood group is considered the universal donor?",
            options: [
              "A",
              "B",
              "AB",
              "O"
            ],
            correctAnswer: 3,
            explanation: "Blood group O negative is the universal donor, as it can be given to all other blood groups.",
            difficulty: "Medium",
            category: "Human Physiology"
          },
          {
            id: 88,
            question: "Which of the following is a characteristic of asexual reproduction?",
            options: [
              "Fusion of gametes",
              "Formation of zygote",
              "No fusion of gametes",
              "Involves two parents"
            ],
            correctAnswer: 2,
            explanation: "Asexual reproduction involves only one parent and does not require fusion of gametes.",
            difficulty: "Medium",
            category: "Reproduction"
          },
          {
            id: 89,
            question: "What is the process by which a cell divides into two identical daughter cells?",
            options: [
              "Meiosis",
              "Mitosis",
              "Binary fission",
              "Budding"
            ],
            correctAnswer: 1,
            explanation: "Mitosis is the process by which a single cell divides into two genetically identical daughter cells.",
            difficulty: "Medium",
            category: "Cell Division"
          },
          {
            id: 90,
            question: "Which hormone is responsible for the regulation of blood sugar?",
            options: [
              "Insulin",
              "Adrenaline",
              "Thyroxine",
              "Estrogen"
            ],
            correctAnswer: 0,
            explanation: "Insulin, produced by the pancreas, helps regulate blood glucose levels.",
            difficulty: "Medium",
            category: "Human Endocrine System"
          },
          {
            id: 91,
            question: "Which of the following proteins is responsible for the regulation of the cell cycle?",
            options: [
              "Actin",
              "Cyclin",
              "Tubulin",
              "Keratin"
            ],
            correctAnswer: 1,
            explanation: "Cyclins are proteins that regulate the progression of cells through the cell cycle.",
            difficulty: "Hard",
            category: "Cell Biology"
          },
          {
            id: 92,
            question: "In the electron transport chain, which molecule acts as the final electron acceptor?",
            options: [
              "Oxygen",
              "Carbon dioxide",
              "NADH",
              "FADH2"
            ],
            correctAnswer: 0,
            explanation: "Oxygen acts as the final electron acceptor in the electron transport chain, forming water as a byproduct.",
            difficulty: "Hard",
            category: "Cell Respiration"
          },
          {
            id: 93,
            question: "Which of the following is NOT a characteristic of the genetic code?",
            options: [
              "Universal",
              "Degenerate",
              "Ambiguous",
              "Non-overlapping"
            ],
            correctAnswer: 2,
            explanation: "The genetic code is degenerate, universal, and non-overlapping, but it is not ambiguous.",
            difficulty: "Hard",
            category: "Genetics"
          },
          {
            id: 94,
            question: "What is the main function of the smooth endoplasmic reticulum (SER)?",
            options: [
              "Protein synthesis",
              "Lipid synthesis",
              "DNA replication",
              "Ribosome production"
            ],
            correctAnswer: 1,
            explanation: "The smooth endoplasmic reticulum (SER) is primarily involved in lipid synthesis and detoxification.",
            difficulty: "Hard",
            category: "Cell Biology"
          },
          {
            id: 95,
            question: "Which structure in the plant cell contains digestive enzymes for intracellular digestion?",
            options: [
              "Nucleus",
              "Lysosome",
              "Mitochondria",
              "Chloroplast"
            ],
            correctAnswer: 1,
            explanation: "Lysosomes contain digestive enzymes that break down waste materials and cellular debris.",
            difficulty: "Hard",
            category: "Plant Physiology"
          },
          {
            id: 96,
            question: "What type of mutation occurs when a base pair is substituted in the DNA sequence?",
            options: [
              "Point mutation",
              "Frameshift mutation",
              "Duplication",
              "Inversion"
            ],
            correctAnswer: 0,
            explanation: "A point mutation occurs when a single base pair is replaced by another in the DNA sequence.",
            difficulty: "Hard",
            category: "Genetics"
          },
          {
            id: 97,
            question: "Which of the following gases is produced as a byproduct of photosynthesis?",
            options: [
              "Oxygen",
              "Nitrogen",
              "Carbon dioxide",
              "Methane"
            ],
            correctAnswer: 0,
            explanation: "Oxygen is produced as a byproduct of photosynthesis when plants convert carbon dioxide and water into glucose.",
            difficulty: "Hard",
            category: "Plant Physiology"
          },
          {
            id: 98,
            question: "Which enzyme is responsible for the synthesis of RNA from a DNA template during transcription?",
            options: [
              "DNA polymerase",
              "RNA polymerase",
              "Ligase",
              "Helicase"
            ],
            correctAnswer: 1,
            explanation: "RNA polymerase synthesizes RNA from a DNA template during the process of transcription.",
            difficulty: "Hard",
            category: "Molecular Biology"
          },
          {
            id: 99,
            question: "In which phase of the cell cycle does DNA replication occur?",
            options: [
              "G1 phase",
              "S phase",
              "G2 phase",
              "M phase"
            ],
            correctAnswer: 1,
            explanation: "DNA replication occurs during the S phase of the cell cycle.",
            difficulty: "Hard",
            category: "Cell Biology"
          },
          {
            id: 100,
            question: "What is the significance of the P site during translation in protein synthesis?",
            options: [
              "It holds the growing peptide chain",
              "It adds new amino acids to the polypeptide",
              "It binds the mRNA",
              "It is where the ribosome dissociates"
            ],
            correctAnswer: 0,
            explanation: "The P site holds the growing polypeptide chain during translation in protein synthesis.",
            difficulty: "Hard",
            category: "Molecular Biology"
          },
          {
            id: 101,
            question: "What is the term for the process by which mRNA is synthesized from a DNA template?",
            options: [
              "Transcription",
              "Replication",
              "Translation",
              "Splicing"
            ],
            correctAnswer: 0,
            explanation: "Transcription is the process by which mRNA is synthesized from a DNA template in the nucleus.",
            difficulty: "Hard",
            category: "Molecular Biology"
          },
          {
            id: 102,
            question: "Which of the following gases is responsible for the greenhouse effect?",
            options: [
              "Oxygen",
              "Carbon dioxide",
              "Nitrogen",
              "Methane"
            ],
            correctAnswer: 1,
            explanation: "Carbon dioxide is a major greenhouse gas that contributes to the greenhouse effect and global warming.",
            difficulty: "Hard",
            category: "Ecology"
          },
          {
            id: 103,
            question: "Which type of bond holds the two strands of DNA together?",
            options: [
              "Ionic bonds",
              "Covalent bonds",
              "Hydrogen bonds",
              "Peptide bonds"
            ],
            correctAnswer: 2,
            explanation: "Hydrogen bonds hold the two complementary strands of DNA together, allowing base pairing between adenine and thymine, and cytosine and guanine.",
            difficulty: "Hard",
            category: "Molecular Biology"
          },
          {
            id: 104,
            question: "What is the role of the TATA box in eukaryotic transcription?",
            options: [
              "It serves as a promoter region",
              "It helps in RNA splicing",
              "It binds to the ribosome",
              "It synthesizes DNA"
            ],
            correctAnswer: 0,
            explanation: "The TATA box is a conserved sequence found in the promoter region of eukaryotic genes, crucial for initiating transcription.",
            difficulty: "Hard",
            category: "Molecular Biology"
          },
          {
            id: 105,
            question: "Which of the following is a characteristic of the ABO blood group system?",
            options: [
              "Codominance",
              "Complete dominance",
              "Incomplete dominance",
              "Polygenic inheritance"
            ],
            correctAnswer: 0,
            explanation: "The ABO blood group system exhibits codominance, where both alleles A and B are equally expressed in heterozygotes.",
            difficulty: "Hard",
            category: "Genetics"
          },
          {
            id: 106,
            question: "Which of the following is the largest organ in the human body?",
            options: [
              "Heart",
              "Skin",
              "Liver",
              "Brain"
            ],
            correctAnswer: 1,
            explanation: "The skin is the largest organ in the human body, covering the body and protecting internal organs.",
            difficulty: "Hard",
            category: "Human Physiology"
          },
          {
            id: 107,
            question: "Which part of the human brain controls balance and coordination?",
            options: [
              "Cerebellum",
              "Medulla Oblongata",
              "Cerebrum",
              "Hypothalamus"
            ],
            correctAnswer: 0,
            explanation: "The cerebellum is responsible for controlling balance, coordination, and motor control.",
            difficulty: "Hard",
            category: "Human Physiology"
          },
          {
            id: 108,
            question: "Which of the following blood cells is responsible for carrying oxygen?",
            options: [
              "White blood cells",
              "Red blood cells",
              "Platelets",
              "Neutrophils"
            ],
            correctAnswer: 1,
            explanation: "Red blood cells are responsible for carrying oxygen from the lungs to the rest of the body.",
            difficulty: "Hard",
            category: "Human Physiology"
          },
          {
            id: 109,
            question: "Which of the following processes directly produces ATP in cells?",
            options: [
              "Photosynthesis",
              "Glycolysis",
              "Fermentation",
              "Cellular respiration"
            ],
            correctAnswer: 3,
            explanation: "Cellular respiration is the process by which ATP is produced in cells, especially in the mitochondria.",
            difficulty: "Hard",
            category: "Biochemistry"
          },
          {
            id: 110,
            question: "Which structure in the cell is responsible for packaging proteins?",
            options: [
              "Rough Endoplasmic Reticulum",
              "Golgi apparatus",
              "Lysosome",
              "Mitochondrion"
            ],
            correctAnswer: 1,
            explanation: "The Golgi apparatus is responsible for packaging proteins and lipids into vesicles for transport or secretion.",
            difficulty: "Hard",
            category: "Cell Biology"
          },
          {
            id: 111,
            question: "What type of bond is formed between amino acids in proteins?",
            options: [
              "Ionic bond",
              "Peptide bond",
              "Hydrogen bond",
              "Disulfide bond"
            ],
            correctAnswer: 1,
            explanation: "A peptide bond is formed between the amino group of one amino acid and the carboxyl group of another.",
            difficulty: "Hard",
            category: "Biochemistry"
          },
          {
            id: 112,
            question: "Which of the following is the process by which green plants make their own food?",
            options: [
              "Glycolysis",
              "Photosynthesis",
              "Respiration",
              "Fermentation"
            ],
            correctAnswer: 1,
            explanation: "Photosynthesis is the process by which green plants make their own food by converting light energy into chemical energy.",
            difficulty: "Hard",
            category: "Plant Physiology"
          },
          {
            id: 113,
            question: "Which of the following is NOT a product of the light reactions of photosynthesis?",
            options: [
              "ATP",
              "Oxygen",
              "Glucose",
              "NADPH"
            ],
            correctAnswer: 2,
            explanation: "Glucose is not produced in the light reactions of photosynthesis; it is synthesized in the dark reactions (Calvin cycle).",
            difficulty: "Hard",
            category: "Plant Physiology"
          },
          {
            id: 114,
            question: "Which type of RNA is responsible for carrying amino acids to the ribosome during protein synthesis?",
            options: [
              "mRNA",
              "rRNA",
              "tRNA",
              "snRNA"
            ],
            correctAnswer: 2,
            explanation: "tRNA (transfer RNA) is responsible for carrying amino acids to the ribosome for protein synthesis.",
            difficulty: "Hard",
            category: "Molecular Biology"
          },
          {
            id: 115,
            question: "Which of the following is a product of the Calvin cycle in photosynthesis?",
            options: [
              "Oxygen",
              "ATP",
              "Glucose",
              "NADPH"
            ],
            correctAnswer: 2,
            explanation: "The Calvin cycle uses ATP and NADPH to produce glucose, which is the main product of this cycle.",
            difficulty: "Hard",
            category: "Plant Physiology"
          },
          {
            id: 116,
            question: "Which molecule is responsible for storing genetic information in living organisms?",
            options: [
              "Proteins",
              "Lipids",
              "DNA",
              "Carbohydrates"
            ],
            correctAnswer: 2,
            explanation: "DNA (Deoxyribonucleic acid) is the molecule that stores genetic information in living organisms.",
            difficulty: "Hard",
            category: "Genetics"
          },
          {
            id: 117,
            question: "What is the process by which a cell divides into two daughter cells?",
            options: [
              "Mitosis",
              "Meiosis",
              "Binary fission",
              "Endocytosis"
            ],
            correctAnswer: 0,
            explanation: "Mitosis is the process by which a cell divides into two genetically identical daughter cells.",
            difficulty: "Hard",
            category: "Cell Division"
          },
          {
            id: 118,
            question: "What is the term for the transfer of genetic material between two non-homologous chromosomes?",
            options: [
              "Crossing over",
              "Translocation",
              "Mutation",
              "Replication"
            ],
            correctAnswer: 1,
            explanation: "Translocation refers to the transfer of genetic material between two non-homologous chromosomes.",
            difficulty: "Hard",
            category: "Genetics"
          },
          {
            id: 119,
            question: "Which organ is responsible for filtering blood and producing urine?",
            options: [
              "Heart",
              "Liver",
              "Kidney",
              "Lungs"
            ],
            correctAnswer: 2,
            explanation: "The kidneys are responsible for filtering blood, removing waste, and producing urine.",
            difficulty: "Hard",
            category: "Human Physiology"
          },
          {
            id: 120,
            question: "What is the primary function of white blood cells?",
            options: [
              "Transport oxygen",
              "Clot blood",
              "Fight infections",
              "Carry nutrients"
            ],
            correctAnswer: 2,
            explanation: "White blood cells are responsible for defending the body against infections and foreign invaders.",
            difficulty: "Hard",
            category: "Human Physiology"
          },
          {
            id: 121,
            question: "Which of the following best describes the role of the myelin sheath in a neuron?",
            options: [
              "Protects the neuron from infections",
              "Helps in the transmission of electrical signals faster",
              "Helps in neurotransmitter release",
              "Acts as a source of energy for the neuron"
            ],
            correctAnswer: 1,
            explanation: "The myelin sheath insulates the axon of the neuron, allowing faster transmission of electrical signals.",
            difficulty: "Hard",
            category: "Neurobiology"
          },
          {
            id: 122,
            question: "Which of the following cells are involved in the immune response by producing antibodies?",
            options: [
              "T-cells",
              "B-cells",
              "Neutrophils",
              "Macrophages"
            ],
            correctAnswer: 1,
            explanation: "B-cells are responsible for producing antibodies that target pathogens in the immune response.",
            difficulty: "Hard",
            category: "Immunology"
          },
          {
            id: 123,
            question: "Which enzyme is responsible for catalyzing the conversion of glucose to glucose-6-phosphate in glycolysis?",
            options: [
              "Hexokinase",
              "Phosphofructokinase",
              "Pyruvate kinase",
              "Aldolase"
            ],
            correctAnswer: 0,
            explanation: "Hexokinase catalyzes the conversion of glucose to glucose-6-phosphate, the first step of glycolysis.",
            difficulty: "Hard",
            category: "Biochemistry"
          },
          {
            id: 124,
            question: "Which of the following is a characteristic feature of cancer cells?",
            options: [
              "Undergo apoptosis",
              "Have a controlled rate of division",
              "Lack contact inhibition and grow uncontrollably",
              "Produce fewer telomerase enzymes"
            ],
            correctAnswer: 2,
            explanation: "Cancer cells lack contact inhibition and grow uncontrollably, which is a key feature of malignant tumors.",
            difficulty: "Hard",
            category: "Cell Biology"
          },
          {
            id: 125,
            question: "Which part of the chloroplast contains the enzymes required for the Calvin cycle?",
            options: [
              "Stroma",
              "Thylakoid membrane",
              "Lumen",
              "Outer membrane"
            ],
            correctAnswer: 0,
            explanation: "The stroma of the chloroplast contains the enzymes required for the Calvin cycle, where carbon fixation occurs.",
            difficulty: "Hard",
            category: "Photosynthesis"
          },
          {
            id: 126,
            question: "In humans, which of the following is the function of the liver?",
            options: [
              "Production of insulin",
              "Production of bile",
              "Absorption of nutrients",
              "Production of hemoglobin"
            ],
            correctAnswer: 1,
            explanation: "The liver produces bile, which aids in the digestion and absorption of fats.",
            difficulty: "Hard",
            category: "Human Physiology"
          },
          {
            id: 127,
            question: "Which process is responsible for the generation of genetic diversity during sexual reproduction?",
            options: [
              "Mitosis",
              "Meiosis",
              "Crossing over",
              "Fertilization"
            ],
            correctAnswer: 2,
            explanation: "Crossing over during meiosis contributes to genetic diversity by exchanging genetic material between homologous chromosomes.",
            difficulty: "Hard",
            category: "Genetics"
          },
          {
            id: 128,
            question: "Which of the following best describes the role of RNA polymerase in transcription?",
            options: [
              "Unwinds the DNA double helix",
              "Synthesizes RNA from a DNA template",
              "Synthesizes proteins from mRNA",
              "Repairs damaged DNA"
            ],
            correctAnswer: 1,
            explanation: "RNA polymerase synthesizes RNA from a DNA template during the process of transcription.",
            difficulty: "Hard",
            category: "Molecular Biology"
          },
          {
            id: 129,
            question: "Which of the following ions is most important for the action potential in neurons?",
            options: [
              "Sodium (Na+)",
              "Potassium (K+)",
              "Calcium (Ca2+)",
              "Chlorine (Cl-)"
            ],
            correctAnswer: 0,
            explanation: "Sodium ions (Na+) play a crucial role in depolarization during the action potential in neurons.",
            difficulty: "Hard",
            category: "Neurobiology"
          },
          {
            id: 130,
            question: "Which of the following is the primary product of the electron transport chain in cellular respiration?",
            options: [
              "ATP",
              "NADH",
              "Oxygen",
              "Water"
            ],
            correctAnswer: 0,
            explanation: "The electron transport chain generates ATP by using the energy from electrons to pump protons across the membrane.",
            difficulty: "Hard",
            category: "Cellular Respiration"
          },
          {
            id: 131,
            question: "Which of the following is a key characteristic of an enzyme-catalyzed reaction?",
            options: [
              "The activation energy of the reaction is increased",
              "The enzyme is consumed in the reaction",
              "The reaction rate is not affected by the enzyme",
              "The enzyme lowers the activation energy of the reaction"
            ],
            correctAnswer: 3,
            explanation: "Enzymes lower the activation energy required for a reaction to occur, thus increasing the reaction rate.",
            difficulty: "Hard",
            category: "Biochemistry"
          },
          {
            id: 132,
            question: "Which molecule in the human body is primarily responsible for the storage of genetic information?",
            options: [
              "DNA",
              "RNA",
              "Proteins",
              "Lipids"
            ],
            correctAnswer: 0,
            explanation: "DNA is the primary molecule that stores and transmits genetic information in living organisms.",
            difficulty: "Hard",
            category: "Genetics"
          },
          {
            id: 133,
            question: "Which of the following structures in the cell is responsible for protein synthesis?",
            options: [
              "Mitochondria",
              "Ribosomes",
              "Nucleus",
              "Golgi apparatus"
            ],
            correctAnswer: 1,
            explanation: "Ribosomes are responsible for protein synthesis by translating messenger RNA into polypeptide chains.",
            difficulty: "Hard",
            category: "Cell Biology"
          },
          {
            id: 134,
            question: "Which vitamin is primarily involved in the process of blood clotting?",
            options: [
              "Vitamin A",
              "Vitamin B12",
              "Vitamin C",
              "Vitamin K"
            ],
            correctAnswer: 3,
            explanation: "Vitamin K plays a crucial role in the synthesis of clotting factors involved in blood coagulation.",
            difficulty: "Hard",
            category: "Human Physiology"
          },
          {
            id: 135,
            question: "Which of the following is an example of a prokaryotic organism?",
            options: [
              "Bacteria",
              "Fungi",
              "Plants",
              "Animals"
            ],
            correctAnswer: 0,
            explanation: "Bacteria are prokaryotic organisms that lack a membrane-bound nucleus and organelles.",
            difficulty: "Hard",
            category: "Microbiology"
          },
          {
            id: 136,
            question: "Which of the following factors contributes most significantly to the secondary structure of proteins?",
            options: [
              "Disulfide bonds",
              "Hydrogen bonds",
              "Ionic bonds",
              "Peptide bonds"
            ],
            correctAnswer: 1,
            explanation: "The secondary structure of proteins is primarily stabilized by hydrogen bonds between the backbone atoms of the polypeptide chain.",
            difficulty: "Hard",
            category: "Biochemistry"
          },
          {
            id: 137,
            question: "In which part of the human brain does the control of heartbeat primarily occur?",
            options: [
              "Medulla oblongata",
              "Cerebellum",
              "Cerebrum",
              "Hypothalamus"
            ],
            correctAnswer: 0,
            explanation: "The medulla oblongata is responsible for regulating autonomic functions like heartbeat and breathing.",
            difficulty: "Hard",
            category: "Neurobiology"
          },
          {
            id: 138,
            question: "Which of the following metabolic pathways occurs in the mitochondria?",
            options: [
              "Glycolysis",
              "Krebs cycle",
              "Fermentation",
              "Pentose phosphate pathway"
            ],
            correctAnswer: 1,
            explanation: "The Krebs cycle (Citric acid cycle) occurs in the mitochondria and is involved in aerobic respiration.",
            difficulty: "Hard",
            category: "Cellular Respiration"
          },
          {
            id: 139,
            question: "Which of the following molecules is primarily responsible for the initiation of transcription in prokaryotes?",
            options: [
              "RNA polymerase",
              "DNA polymerase",
              "Ribosomes",
              "Sigma factor"
            ],
            correctAnswer: 3,
            explanation: "In prokaryotes, the sigma factor helps RNA polymerase recognize the promoter and initiate transcription.",
            difficulty: "Hard",
            category: "Molecular Biology"
          },
          {
            id: 140,
            question: "Which of the following ions is primarily involved in muscle contraction?",
            options: [
              "Calcium ions (Ca2+)",
              "Sodium ions (Na+)",
              "Potassium ions (K+)",
              "Chloride ions (Cl-)"
            ],
            correctAnswer: 0,
            explanation: "Calcium ions (Ca2+) bind to troponin and facilitate muscle contraction by exposing binding sites on actin.",
            difficulty: "Hard",
            category: "Human Physiology"
          },
          {
            id: 141,
            question: "Which of the following is the function of the Golgi apparatus in eukaryotic cells?",
            options: [
              "Protein synthesis",
              "DNA replication",
              "Modification and packaging of proteins",
              "Production of energy (ATP)"
            ],
            correctAnswer: 2,
            explanation: "The Golgi apparatus modifies, sorts, and packages proteins for secretion or delivery to other organelles.",
            difficulty: "Hard",
            category: "Cell Biology"
          },
          {
            id: 142,
            question: "Which phase of the cell cycle is characterized by the replication of DNA?",
            options: [
              "G1 phase",
              "S phase",
              "G2 phase",
              "M phase"
            ],
            correctAnswer: 1,
            explanation: "DNA replication occurs during the S phase of the cell cycle, preparing the cell for mitosis.",
            difficulty: "Hard",
            category: "Cell Biology"
          },
          {
            id: 143,
            question: "Which of the following is a key feature of both prokaryotic and eukaryotic cells?",
            options: [
              "Presence of a nucleus",
              "Presence of a plasma membrane",
              "Presence of mitochondria",
              "Presence of chloroplasts"
            ],
            correctAnswer: 1,
            explanation: "Both prokaryotic and eukaryotic cells have a plasma membrane that surrounds the cell and regulates material exchange.",
            difficulty: "Hard",
            category: "Cell Biology"
          },
          {
            id: 144,
            question: "Which of the following vitamins plays a crucial role in the synthesis of collagen?",
            options: [
              "Vitamin A",
              "Vitamin B12",
              "Vitamin C",
              "Vitamin D"
            ],
            correctAnswer: 2,
            explanation: "Vitamin C is essential for the synthesis of collagen, which is important for connective tissue health.",
            difficulty: "Hard",
            category: "Human Physiology"
          },
          {
            id: 145,
            question: "What is the role of the smooth endoplasmic reticulum (SER) in the cell?",
            options: [
              "Protein synthesis",
              "Lipid synthesis and detoxification",
              "DNA replication",
              "Transport of proteins"
            ],
            correctAnswer: 1,
            explanation: "The smooth endoplasmic reticulum is involved in lipid synthesis and detoxification processes.",
            difficulty: "Hard",
            category: "Cell Biology"
          },
          {
            id: 146,
            question: "What is the primary source of ATP in a cell during intense exercise?",
            options: [
              "Anaerobic glycolysis",
              "Electron transport chain",
              "Citric acid cycle",
              "Beta-oxidation of fatty acids"
            ],
            correctAnswer: 0,
            explanation: "During intense exercise, anaerobic glycolysis is the primary source of ATP, as oxygen availability is limited.",
            difficulty: "Hard",
            category: "Human Physiology"
          },
          {
            id: 147,
            question: "Which of the following molecules is the most abundant form of energy storage in plants?",
            options: [
              "Starch",
              "Glucose",
              "Fructose",
              "Sucrose"
            ],
            correctAnswer: 0,
            explanation: "Starch is the most abundant form of energy storage in plants, stored mainly in roots, tubers, and seeds.",
            difficulty: "Hard",
            category: "Plant Biology"
          },
          {
            id: 148,
            question: "Which of the following best describes the function of the T helper cells in the immune system?",
            options: [
              "Activate B cells to produce antibodies",
              "Phagocytize pathogens",
              "Induce apoptosis in infected cells",
              "Neutralize toxins"
            ],
            correctAnswer: 0,
            explanation: "T helper cells activate B cells, which are responsible for antibody production, a key part of the immune response.",
            difficulty: "Hard",
            category: "Immunology"
          },
          {
            id: 149,
            question: "What is the primary role of the p53 protein in the cell cycle?",
            options: [
              "Promote cell cycle progression",
              "Induce apoptosis in damaged cells",
              "Facilitate DNA replication",
              "Synthesize proteins for repair"
            ],
            correctAnswer: 1,
            explanation: "The p53 protein is a tumor suppressor that induces apoptosis in cells with DNA damage to prevent cancer development.",
            difficulty: "Hard",
            category: "Cell Biology"
          },
          {
            id: 150,
            question: "Which of the following is the result of a mutation in the BRCA1 gene?",
            options: [
              "Increased susceptibility to Alzheimer's disease",
              "Increased risk of breast and ovarian cancer",
              "Resistance to viral infections",
              "Increased risk of type 2 diabetes"
            ],
            correctAnswer: 1,
            explanation: "Mutations in the BRCA1 gene increase the risk of breast and ovarian cancers due to impaired DNA repair mechanisms.",
            difficulty: "Hard",
            category: "Genetics"
          },
          {
            id: 151,
            question: "Which of the following amino acids can participate in the formation of disulfide bonds?",
            options: [
              "Valine",
              "Cysteine",
              "Glutamine",
              "Serine"
            ],
            correctAnswer: 1,
            explanation: "Cysteine contains a thiol (-SH) group in its side chain that can form disulfide bonds, stabilizing protein structure.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 152,
            question: "In photosynthesis, the splitting of water molecules occurs in which of the following processes?",
            options: [
              "Calvin cycle",
              "Light-dependent reactions",
              "Light-independent reactions",
              "Electron transport chain"
            ],
            correctAnswer: 1,
            explanation: "Water splitting (photolysis) occurs during the light-dependent reactions of photosynthesis to release oxygen.",
            difficulty: "Super Hard",
            category: "Plant Biology"
          },
          {
            id: 153,
            question: "Which of the following enzymes is responsible for unwinding the DNA helix during replication?",
            options: [
              "DNA polymerase",
              "Helicase",
              "Ligase",
              "Topoisomerase"
            ],
            correctAnswer: 1,
            explanation: "Helicase is responsible for unwinding the DNA double helix by breaking the hydrogen bonds between base pairs during DNA replication.",
            difficulty: "Super Hard",
            category: "Molecular Biology"
          },
          {
            id: 154,
            question: "Which of the following is a function of the smooth endoplasmic reticulum (SER)?",
            options: [
              "Synthesis of ribosomal RNA",
              "Synthesis of steroid hormones",
              "Protein degradation",
              "Synthesis of ATP"
            ],
            correctAnswer: 1,
            explanation: "The smooth endoplasmic reticulum is involved in the synthesis of lipids, including steroid hormones, and detoxification.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 155,
            question: "Which of the following statements about the human circulatory system is true?",
            options: [
              "The right atrium pumps oxygenated blood to the lungs",
              "The left ventricle pumps oxygenated blood to the body",
              "The pulmonary artery carries oxygenated blood to the lungs",
              "The superior vena cava carries blood from the lungs"
            ],
            correctAnswer: 1,
            explanation: "The left ventricle pumps oxygenated blood to the body through the aorta, while the right atrium receives deoxygenated blood from the body.",
            difficulty: "Super Hard",
            category: "Human Physiology"
          },
          {
            id: 156,
            question: "Which of the following is NOT involved in the regulation of blood glucose levels?",
            options: [
              "Insulin",
              "Glucagon",
              "Epinephrine",
              "Thyroxine"
            ],
            correctAnswer: 3,
            explanation: "Thyroxine regulates metabolism but does not directly regulate blood glucose levels like insulin, glucagon, and epinephrine do.",
            difficulty: "Super Hard",
            category: "Endocrinology"
          },
          {
            id: 157,
            question: "In which phase of the cell cycle does the synthesis of proteins required for mitosis occur?",
            options: [
              "G1 phase",
              "S phase",
              "G2 phase",
              "M phase"
            ],
            correctAnswer: 2,
            explanation: "The G2 phase is where the cell synthesizes proteins required for mitosis and checks for any DNA errors before cell division.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 158,
            question: "Which of the following best describes the role of the Na+/K+ ATPase pump in neurons?",
            options: [
              "To maintain the resting membrane potential by pumping sodium into the cell",
              "To generate action potentials by pumping potassium into the cell",
              "To maintain the resting membrane potential by pumping potassium into the cell",
              "To facilitate the influx of calcium ions into the cell"
            ],
            correctAnswer: 2,
            explanation: "The Na+/K+ ATPase pump helps maintain the resting membrane potential by pumping potassium ions into the neuron and sodium ions out.",
            difficulty: "Super Hard",
            category: "Neurobiology"
          },
          {
            id: 159,
            question: "Which of the following is a characteristic of prokaryotic cells?",
            options: [
              "Presence of a membrane-bound nucleus",
              "Presence of mitochondria",
              "Presence of ribosomes",
              "Presence of chloroplasts"
            ],
            correctAnswer: 2,
            explanation: "Prokaryotic cells do not have membrane-bound organelles like a nucleus or mitochondria but do have ribosomes for protein synthesis.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 160,
            question: "Which of the following is the product of the Calvin cycle in photosynthesis?",
            options: [
              "ATP",
              "Oxygen",
              "Glucose",
              "NADPH"
            ],
            correctAnswer: 2,
            explanation: "The Calvin cycle produces glucose from carbon dioxide and water, using the energy from ATP and NADPH generated in the light-dependent reactions.",
            difficulty: "Super Hard",
            category: "Plant Biology"
          },
          {
            id: 161,
            question: "Which of the following hormones is produced by the hypothalamus and acts on the anterior pituitary?",
            options: [
              "Thyroid-stimulating hormone",
              "Growth hormone",
              "Antidiuretic hormone",
              "Gonadotropin-releasing hormone"
            ],
            correctAnswer: 3,
            explanation: "Gonadotropin-releasing hormone (GnRH) is produced by the hypothalamus and stimulates the anterior pituitary to release gonadotropins.",
            difficulty: "Super Hard",
            category: "Endocrinology"
          },
          {
            id: 162,
            question: "Which of the following ions is responsible for the depolarization phase of the action potential?",
            options: [
              "Sodium ions (Na+)",
              "Potassium ions (K+)",
              "Calcium ions (Ca2+)",
              "Chloride ions (Cl-)"
            ],
            correctAnswer: 0,
            explanation: "Sodium ions (Na+) rush into the neuron during depolarization, causing the inside of the cell to become more positive.",
            difficulty: "Super Hard",
            category: "Neurobiology"
          },
          {
            id: 163,
            question: "Which of the following best describes the role of the ribosome in the cell?",
            options: [
              "Synthesize proteins from amino acids",
              "Store genetic information",
              "Transport proteins within the cell",
              "Produce ATP"
            ],
            correctAnswer: 0,
            explanation: "Ribosomes are responsible for protein synthesis by translating mRNA into polypeptides using amino acids.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 164,
            question: "Which of the following structures is directly involved in the translation process of protein synthesis?",
            options: [
              "mRNA",
              "tRNA",
              "Ribosome",
              "DNA"
            ],
            correctAnswer: 2,
            explanation: "The ribosome facilitates translation by reading the mRNA and assembling the corresponding amino acids into a protein.",
            difficulty: "Super Hard",
            category: "Molecular Biology"
          },
          {
            id: 165,
            question: "Which of the following is an example of a feedback mechanism in the endocrine system?",
            options: [
              "Negative feedback in the regulation of blood glucose",
              "Positive feedback in the release of insulin",
              "Negative feedback in the release of oxytocin during childbirth",
              "Positive feedback in the regulation of blood pressure"
            ],
            correctAnswer: 0,
            explanation: "Negative feedback mechanisms help regulate hormone levels, such as insulin and glucagon in blood glucose regulation.",
            difficulty: "Super Hard",
            category: "Endocrinology"
          },
          {
            id: 166,
            question: "In the process of glycolysis, which of the following enzymes is responsible for converting glucose-6-phosphate into fructose-6-phosphate?",
            options: [
              "Hexokinase",
              "Phosphoglucose isomerase",
              "Phosphofructokinase",
              "Aldolase"
            ],
            correctAnswer: 1,
            explanation: "The enzyme phosphoglucose isomerase is responsible for converting glucose-6-phosphate into fructose-6-phosphate during glycolysis.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 167,
            question: "Which of the following is the final electron acceptor in the electron transport chain?",
            options: [
              "NADH",
              "Oxygen",
              "FADH2",
              "ATP"
            ],
            correctAnswer: 1,
            explanation: "Oxygen is the final electron acceptor in the electron transport chain, combining with electrons and protons to form water.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 168,
            question: "Which of the following hormones is released from the anterior pituitary and stimulates the release of corticosteroids?",
            options: [
              "ACTH",
              "FSH",
              "LH",
              "PRL"
            ],
            correctAnswer: 0,
            explanation: "Adrenocorticotropic hormone (ACTH) stimulates the adrenal cortex to release corticosteroids.",
            difficulty: "Super Hard",
            category: "Endocrinology"
          },
          {
            id: 169,
            question: "Which of the following substances is primarily responsible for the resting membrane potential in a neuron?",
            options: [
              "Sodium ions",
              "Potassium ions",
              "Chloride ions",
              "Calcium ions"
            ],
            correctAnswer: 1,
            explanation: "Potassium ions play a key role in establishing the resting membrane potential by diffusing out of the neuron.",
            difficulty: "Super Hard",
            category: "Neurobiology"
          },
          {
            id: 170,
            question: "Which of the following is the main role of the TATA box in transcription?",
            options: [
              "Binding site for RNA polymerase",
              "Binding site for ribosomes",
              "Initiates DNA replication",
              "Regulates the production of mRNA"
            ],
            correctAnswer: 0,
            explanation: "The TATA box is a DNA sequence that serves as a binding site for RNA polymerase and initiates transcription.",
            difficulty: "Super Hard",
            category: "Molecular Biology"
          },
          {
            id: 171,
            question: "Which of the following is true about a double-stranded DNA molecule?",
            options: [
              "Both strands are complementary and parallel",
              "Both strands are complementary and anti-parallel",
              "The strands are identical in sequence",
              "The strands are held together by hydrogen bonds between the sugar-phosphate backbone"
            ],
            correctAnswer: 1,
            explanation: "In a double-stranded DNA molecule, the two strands are complementary and anti-parallel, meaning they run in opposite directions.",
            difficulty: "Super Hard",
            category: "Molecular Biology"
          },
          {
            id: 172,
            question: "Which of the following processes is most directly responsible for generating ATP in the mitochondria?",
            options: [
              "Citric acid cycle",
              "Electron transport chain",
              "Glycolysis",
              "Fermentation"
            ],
            correctAnswer: 1,
            explanation: "The electron transport chain is the primary process in the mitochondria that generates the majority of ATP during cellular respiration.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 173,
            question: "Which of the following is true regarding the principle of independent assortment in genetics?",
            options: [
              "Genes located on the same chromosome are inherited together",
              "Genes located on different chromosomes assort independently",
              "Linked genes assort independently",
              "Independent assortment occurs only during mitosis"
            ],
            correctAnswer: 1,
            explanation: "Independent assortment occurs during meiosis, where genes located on different chromosomes assort independently of each other.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 174,
            question: "Which of the following is NOT a function of the smooth endoplasmic reticulum?",
            options: [
              "Synthesis of steroid hormones",
              "Detoxification of harmful substances",
              "Protein synthesis",
              "Storage of calcium ions"
            ],
            correctAnswer: 2,
            explanation: "Protein synthesis occurs in the rough endoplasmic reticulum, not the smooth endoplasmic reticulum.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 175,
            question: "Which of the following enzymes is involved in the conversion of glucose to glucose-6-phosphate?",
            options: [
              "Hexokinase",
              "Phosphofructokinase",
              "Glucokinase",
              "Phosphoglucose isomerase"
            ],
            correctAnswer: 0,
            explanation: "Hexokinase catalyzes the phosphorylation of glucose to form glucose-6-phosphate during the first step of glycolysis.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 176,
            question: "Which of the following best describes the role of the sodium-potassium pump in nerve cells?",
            options: [
              "It helps to maintain the resting membrane potential by pumping sodium ions into the cell",
              "It helps to generate action potentials by allowing potassium ions to enter the cell",
              "It helps to maintain the resting membrane potential by pumping sodium ions out and potassium ions in",
              "It is responsible for the depolarization of the neuron during action potentials"
            ],
            correctAnswer: 2,
            explanation: "The sodium-potassium pump helps maintain the resting membrane potential by pumping sodium ions out of the cell and potassium ions into the cell.",
            difficulty: "Super Hard",
            category: "Neurobiology"
          },
          {
            id: 177,
            question: "Which of the following compounds inhibits the activity of cytochrome c oxidase in the electron transport chain?",
            options: [
              "Cyanide",
              "Oxygen",
              "NADH",
              "ATP"
            ],
            correctAnswer: 0,
            explanation: "Cyanide inhibits cytochrome c oxidase, a key enzyme in the electron transport chain, thus blocking cellular respiration.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 178,
            question: "Which of the following is true regarding the structure of the plasma membrane?",
            options: [
              "It is primarily composed of proteins, with a small amount of lipids",
              "It is composed of a double layer of phospholipids with proteins embedded in it",
              "It is composed of a single layer of phospholipids",
              "It is primarily composed of carbohydrates, with some lipids and proteins"
            ],
            correctAnswer: 1,
            explanation: "The plasma membrane is composed of a phospholipid bilayer with embedded proteins, which provides selective permeability and structural integrity.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 179,
            question: "Which of the following molecules is responsible for carrying amino acids to the ribosome during protein synthesis?",
            options: [
              "tRNA",
              "mRNA",
              "rRNA",
              "DNA"
            ],
            correctAnswer: 0,
            explanation: "Transfer RNA (tRNA) molecules carry amino acids to the ribosome during translation, where they are added to the growing polypeptide chain.",
            difficulty: "Super Hard",
            category: "Molecular Biology"
          },
          {
            id: 180,
            question: "Which of the following best describes the concept of genetic recombination?",
            options: [
              "The exchange of DNA between homologous chromosomes during meiosis",
              "The mutation of genes during mitosis",
              "The random assortment of chromosomes during metaphase",
              "The production of identical alleles during DNA replication"
            ],
            correctAnswer: 0,
            explanation: "Genetic recombination occurs during meiosis when homologous chromosomes exchange segments of their DNA, leading to genetic diversity.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 181,
            question: "Which of the following best describes the function of a ribosome?",
            options: [
              "It synthesizes proteins by linking amino acids together",
              "It produces ATP for cellular energy",
              "It stores genetic information",
              "It catalyzes the transcription of RNA"
            ],
            correctAnswer: 0,
            explanation: "Ribosomes are responsible for protein synthesis by linking amino acids into polypeptide chains during translation.",
            difficulty: "Super Hard",
            category: "Molecular Biology"
          },
          {
            id: 182,
            question: "In the Calvin cycle, which of the following is the primary molecule that reacts with carbon dioxide?",
            options: [
              "NADPH",
              "Ribulose bisphosphate",
              "ATP",
              "Glucose"
            ],
            correctAnswer: 1,
            explanation: "Ribulose bisphosphate (RuBP) reacts with carbon dioxide in the Calvin cycle to form an unstable 6-carbon compound.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 183,
            question: "Which of the following enzymes is involved in the conversion of pyruvate to acetyl-CoA?",
            options: [
              "Pyruvate kinase",
              "Pyruvate dehydrogenase",
              "Citrate synthase",
              "Isocitrate dehydrogenase"
            ],
            correctAnswer: 1,
            explanation: "Pyruvate dehydrogenase is the enzyme that converts pyruvate to acetyl-CoA, which enters the citric acid cycle.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 184,
            question: "Which of the following best describes the function of the smooth endoplasmic reticulum?",
            options: [
              "Synthesis of proteins",
              "Synthesis of lipids and detoxification of chemicals",
              "Packaging of proteins for secretion",
              "Storage of calcium ions"
            ],
            correctAnswer: 1,
            explanation: "The smooth endoplasmic reticulum is involved in lipid synthesis and detoxification of harmful substances.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 185,
            question: "Which of the following statements about the mitochondria is false?",
            options: [
              "Mitochondria have their own DNA",
              "Mitochondria are involved in cellular respiration",
              "Mitochondria are involved in protein synthesis",
              "Mitochondria have a double membrane structure"
            ],
            correctAnswer: 2,
            explanation: "Mitochondria are involved in cellular respiration, but they are not involved in protein synthesis. Protein synthesis occurs in ribosomes.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 186,
            question: "During meiosis, which of the following events contributes to genetic variation?",
            options: [
              "Crossing over",
              "DNA replication",
              "Cytokinesis",
              "Mitosis"
            ],
            correctAnswer: 0,
            explanation: "Crossing over during prophase I of meiosis contributes to genetic variation by exchanging genetic material between homologous chromosomes.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 187,
            question: "Which of the following is a consequence of a frameshift mutation?",
            options: [
              "It results in a completely different protein",
              "It does not affect protein function",
              "It alters the number of amino acids in a protein without changing the sequence",
              "It leads to the deletion of a codon"
            ],
            correctAnswer: 0,
            explanation: "A frameshift mutation alters the reading frame of the mRNA, leading to a completely different protein due to the shift in codon alignment.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 188,
            question: "In the context of the Hardy-Weinberg equilibrium, which of the following is NOT a factor that disrupts equilibrium?",
            options: [
              "Gene flow",
              "Mutation",
              "Large population size",
              "Non-random mating"
            ],
            correctAnswer: 2,
            explanation: "A large population size is not a factor that disrupts Hardy-Weinberg equilibrium. In fact, large populations help maintain genetic stability.",
            difficulty: "Super Hard",
            category: "Evolutionary Biology"
          },
          {
            id: 189,
            question: "Which of the following best describes the role of phosphofructokinase in glycolysis?",
            options: [
              "It catalyzes the first step of glycolysis",
              "It regulates the rate-limiting step in glycolysis",
              "It breaks down glucose into pyruvate",
              "It regenerates NAD+ for glycolysis"
            ],
            correctAnswer: 1,
            explanation: "Phosphofructokinase is the rate-limiting enzyme of glycolysis, controlling the pace at which the pathway proceeds.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 190,
            question: "Which of the following structures is involved in the synthesis of ribosomal RNA?",
            options: [
              "Nucleolus",
              "Endoplasmic reticulum",
              "Golgi apparatus",
              "Lysosome"
            ],
            correctAnswer: 0,
            explanation: "The nucleolus is responsible for the synthesis of ribosomal RNA (rRNA) and the assembly of ribosomes.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 191,
            question: "Which of the following molecules is NOT involved in the light reactions of photosynthesis?",
            options: [
              "Chlorophyll",
              "ATP",
              "NADP+",
              "Glucose"
            ],
            correctAnswer: 3,
            explanation: "Glucose is not involved in the light reactions of photosynthesis. ATP, NADP+, and chlorophyll are essential for the light reactions.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 192,
            question: "Which of the following best describes the concept of incomplete dominance?",
            options: [
              "Both alleles are fully expressed in the phenotype",
              "Neither allele is expressed in the phenotype",
              "The heterozygous phenotype is a blend of the two alleles",
              "Only one allele is expressed in the phenotype"
            ],
            correctAnswer: 2,
            explanation: "Incomplete dominance occurs when the heterozygous phenotype is a blend of the two alleles, neither of which is completely dominant.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 193,
            question: "Which of the following best describes a prokaryotic cell?",
            options: [
              "It has a nucleus that contains the cell's genetic material",
              "It has no membrane-bound organelles",
              "It has a complex internal structure",
              "It has multiple chromosomes"
            ],
            correctAnswer: 1,
            explanation: "Prokaryotic cells do not have membrane-bound organelles or a nucleus. Their genetic material is found in the nucleoid region.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 194,
            question: "Which of the following processes occurs in the cytoplasm of the cell?",
            options: [
              "Citric acid cycle",
              "Electron transport chain",
              "Glycolysis",
              "Pyruvate dehydrogenase reaction"
            ],
            correctAnswer: 2,
            explanation: "Glycolysis occurs in the cytoplasm, while the citric acid cycle, electron transport chain, and pyruvate dehydrogenase reaction occur in the mitochondria.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 195,
            question: "Which of the following is a major difference between mitosis and meiosis?",
            options: [
              "Mitosis produces genetically identical cells, whereas meiosis results in genetically diverse cells",
              "Mitosis results in four daughter cells, whereas meiosis results in two daughter cells",
              "Mitosis occurs only in gametes, whereas meiosis occurs in somatic cells",
              "Mitosis involves two rounds of cell division, whereas meiosis involves only one round"
            ],
            correctAnswer: 0,
            explanation: "Mitosis produces genetically identical cells, whereas meiosis results in genetically diverse cells due to processes like crossing over and independent assortment.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 196,
            question: "Which of the following statements best describes the function of a non-competitive inhibitor?",
            options: [
              "It binds to the enzyme’s active site, preventing substrate binding",
              "It binds to an allosteric site and decreases enzyme activity",
              "It increases the enzyme’s affinity for the substrate",
              "It accelerates the enzyme-catalyzed reaction"
            ],
            correctAnswer: 1,
            explanation: "Non-competitive inhibitors bind to an allosteric site on the enzyme, causing a conformational change that decreases the enzyme's activity.",
            difficulty: "Super Hard",
            category: "Enzyme Regulation"
          },
          {
            id: 197,
            question: "In the light reactions of photosynthesis, which molecule acts as the final electron acceptor?",
            options: [
              "ATP",
              "NADP+",
              "Oxygen",
              "Water"
            ],
            correctAnswer: 1,
            explanation: "NADP+ acts as the final electron acceptor in the light reactions, forming NADPH which is used in the Calvin cycle.",
            difficulty: "Super Hard",
            category: "Photosynthesis"
          },
          {
            id: 198,
            question: "What is the primary purpose of the citric acid cycle in cellular respiration?",
            options: [
              "To generate ATP directly",
              "To produce NADPH for the electron transport chain",
              "To break down glucose into pyruvate",
              "To produce high-energy electron carriers (NADH, FADH2)"
            ],
            correctAnswer: 3,
            explanation: "The citric acid cycle produces high-energy electron carriers (NADH and FADH2), which are used in the electron transport chain to generate ATP.",
            difficulty: "Super Hard",
            category: "Cellular Respiration"
          },
          {
            id: 199,
            question: "Which of the following is the most likely result of a mutation in the promoter region of a gene?",
            options: [
              "Increased gene expression",
              "Decreased gene expression",
              "No change in gene expression",
              "Expression of the gene in different tissues"
            ],
            correctAnswer: 1,
            explanation: "Mutations in the promoter region often lead to decreased or no gene expression because the promoter is required for RNA polymerase binding and transcription initiation.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 200,
            question: "Which of the following is a key difference between prokaryotic and eukaryotic cells?",
            options: [
              "Prokaryotic cells lack a plasma membrane",
              "Eukaryotic cells have circular DNA, while prokaryotic cells have linear DNA",
              "Prokaryotic cells lack a membrane-bound nucleus",
              "Eukaryotic cells lack ribosomes"
            ],
            correctAnswer: 2,
            explanation: "Prokaryotic cells lack a membrane-bound nucleus, whereas eukaryotic cells have a true nucleus enclosed by a nuclear membrane.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 201,
            question: "Which of the following processes directly results in the production of the most ATP in cellular respiration?",
            options: [
              "Glycolysis",
              "Citric acid cycle",
              "Fermentation",
              "Electron transport chain and oxidative phosphorylation"
            ],
            correctAnswer: 3,
            explanation: "The electron transport chain and oxidative phosphorylation produce the most ATP in cellular respiration, with NADH and FADH2 donating electrons to generate a proton gradient.",
            difficulty: "Super Hard",
            category: "Cellular Respiration"
          },
          {
            id: 202,
            question: "Which of the following molecules is involved in the process of crossing over during meiosis?",
            options: [
              "mRNA",
              "Chromatids",
              "Centromeres",
              "Synaptonemal complex"
            ],
            correctAnswer: 3,
            explanation: "The synaptonemal complex is a protein structure that forms between homologous chromosomes during meiosis, facilitating the process of crossing over.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 203,
            question: "Which of the following is NOT a characteristic of enzymes?",
            options: [
              "They increase the rate of biochemical reactions",
              "They are consumed in the reaction",
              "They lower the activation energy of reactions",
              "They are highly specific to their substrates"
            ],
            correctAnswer: 1,
            explanation: "Enzymes are not consumed in the reaction; they catalyze reactions without being used up or altered permanently.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 204,
            question: "Which of the following would most likely lead to a change in the secondary structure of a protein?",
            options: [
              "A mutation in the coding sequence of the gene",
              "A mutation in the promoter region of the gene",
              "A change in the temperature of the cell",
              "An increase in the concentration of ribosomes"
            ],
            correctAnswer: 0,
            explanation: "A mutation in the coding sequence of the gene can result in changes to the amino acid sequence, which in turn can alter the protein's secondary structure.",
            difficulty: "Super Hard",
            category: "Protein Structure"
          },
          {
            id: 205,
            question: "What is the effect of a point mutation in a coding region of a gene?",
            options: [
              "It always results in a non-functional protein",
              "It may change a single amino acid in the protein",
              "It always leads to a frameshift mutation",
              "It cannot affect the protein at all"
            ],
            correctAnswer: 1,
            explanation: "A point mutation in a coding region can change a single amino acid in the protein, which may affect the protein's function.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 206,
            question: "Which of the following events occurs during the G2 phase of the cell cycle?",
            options: [
              "Chromosomes condense and become visible",
              "DNA is replicated",
              "Organelles are duplicated",
              "The cell prepares for mitosis"
            ],
            correctAnswer: 3,
            explanation: "During the G2 phase, the cell prepares for mitosis by synthesizing proteins required for cell division and ensuring all DNA replication is completed.",
            difficulty: "Super Hard",
            category: "Cell Cycle"
          },
          {
            id: 207,
            question: "Which of the following is NOT a direct function of the smooth endoplasmic reticulum (ER)?",
            options: [
              "Synthesis of lipids",
              "Detoxification of drugs",
              "Protein synthesis",
              "Calcium ion storage"
            ],
            correctAnswer: 2,
            explanation: "Protein synthesis occurs in the rough endoplasmic reticulum (RER), not the smooth ER, which is involved in lipid synthesis and detoxification.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 208,
            question: "Which of the following describes a situation where a gene is expressed in a tissue-specific manner?",
            options: [
              "All genes are expressed equally in all tissues",
              "The expression of a gene is regulated by the transcription factors",
              "Some genes are only transcribed in specific tissues or at certain stages of development",
              "None of the above"
            ],
            correctAnswer: 2,
            explanation: "Tissue-specific gene expression occurs when certain genes are transcribed only in specific tissues or at particular stages of development.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 209,
            question: "In a plant, what is the direct product of the Calvin cycle that can be used to form glucose?",
            options: [
              "NADPH",
              "G3P (Glyceraldehyde-3-phosphate)",
              "ATP",
              "Oxygen"
            ],
            correctAnswer: 1,
            explanation: "G3P (Glyceraldehyde-3-phosphate) is the direct product of the Calvin cycle that can be used to form glucose and other carbohydrates.",
            difficulty: "Super Hard",
            category: "Photosynthesis"
          },
          {
            id: 210,
            question: "Which of the following best describes a restriction enzyme?",
            options: [
              "An enzyme that synthesizes RNA",
              "An enzyme that cleaves nucleic acids at specific sequences",
              "An enzyme that catalyzes the binding of two DNA fragments",
              "An enzyme that stabilizes the DNA replication fork"
            ],
            correctAnswer: 1,
            explanation: "Restriction enzymes cleave DNA at specific nucleotide sequences, which is essential for processes like DNA manipulation and genetic research.",
            difficulty: "Super Hard",
            category: "Molecular Biology"
          },
          {
            id: 211,
            question: "Which of the following compounds is a direct source of energy for cellular activities?",
            options: [
              "ATP",
              "Glucose",
              "NADH",
              "FADH2"
            ],
            correctAnswer: 0,
            explanation: "ATP is the immediate source of energy for most cellular processes, unlike glucose, NADH, and FADH2, which must undergo further processing to release energy.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 212,
            question: "Which process in cellular respiration is responsible for the production of the most NADH?",
            options: [
              "Glycolysis",
              "Citric acid cycle",
              "Electron transport chain",
              "Fermentation"
            ],
            correctAnswer: 1,
            explanation: "The citric acid cycle produces the most NADH during cellular respiration by oxidizing acetyl-CoA.",
            difficulty: "Super Hard",
            category: "Cellular Respiration"
          },
          {
            id: 213,
            question: "Which of the following best describes the role of the nucleolus?",
            options: [
              "RNA synthesis",
              "Ribosome synthesis",
              "DNA replication",
              "Protein synthesis"
            ],
            correctAnswer: 1,
            explanation: "The nucleolus is primarily involved in the synthesis and assembly of ribosomal RNA (rRNA) and ribosome subunits.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 214,
            question: "In a plant, which structure is directly involved in the synthesis of ATP during photosynthesis?",
            options: [
              "Mitochondria",
              "Chloroplasts",
              "Nucleus",
              "Endoplasmic reticulum"
            ],
            correctAnswer: 1,
            explanation: "ATP synthesis during photosynthesis occurs in the chloroplasts, particularly in the thylakoid membrane during the light reactions.",
            difficulty: "Super Hard",
            category: "Photosynthesis"
          },
          {
            id: 215,
            question: "Which of the following is a primary function of ribosomes?",
            options: [
              "DNA replication",
              "Protein synthesis",
              "RNA processing",
              "Lipid synthesis"
            ],
            correctAnswer: 1,
            explanation: "Ribosomes are responsible for translating messenger RNA (mRNA) into proteins during the process of translation.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 216,
            question: "Which of the following phases of mitosis is characterized by the alignment of chromosomes at the metaphase plate?",
            options: [
              "Prophase",
              "Metaphase",
              "Anaphase",
              "Telophase"
            ],
            correctAnswer: 1,
            explanation: "During metaphase, chromosomes align at the cell’s equatorial plane, called the metaphase plate, before being separated during anaphase.",
            difficulty: "Super Hard",
            category: "Cell Division"
          },
          {
            id: 217,
            question: "Which enzyme is responsible for unzipping the DNA strand during DNA replication?",
            options: [
              "DNA polymerase",
              "Helicase",
              "Ligase",
              "Primase"
            ],
            correctAnswer: 1,
            explanation: "Helicase is the enzyme that unwinds and separates the two strands of the DNA double helix, making them available for replication.",
            difficulty: "Super Hard",
            category: "Molecular Biology"
          },
          {
            id: 218,
            question: "Which of the following would most likely occur if a mutation occurred in the 5' UTR of a gene?",
            options: [
              "Altered protein sequence",
              "Increased gene expression",
              "Decreased gene expression",
              "No effect on gene expression"
            ],
            correctAnswer: 2,
            explanation: "A mutation in the 5' untranslated region (UTR) can affect the translation initiation, often leading to decreased gene expression.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 219,
            question: "Which of the following best describes the function of the Golgi apparatus?",
            options: [
              "Protein synthesis",
              "Lipid synthesis",
              "Post-translational modification of proteins",
              "Storage of genetic material"
            ],
            correctAnswer: 2,
            explanation: "The Golgi apparatus is responsible for modifying, sorting, and packaging proteins for secretion or delivery to other organelles.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 220,
            question: "Which of the following processes is not involved in the formation of a protein's tertiary structure?",
            options: [
              "Hydrogen bonding",
              "Ionic bonding",
              "Covalent bonding",
              "Phosphorylation"
            ],
            correctAnswer: 3,
            explanation: "Phosphorylation is a modification that affects protein activity but does not directly contribute to the formation of a protein's tertiary structure.",
            difficulty: "Super Hard",
            category: "Protein Structure"
          },
          {
            id: 221,
            question: "Which of the following molecules is not involved in the electron transport chain?",
            options: [
              "NADH",
              "Oxygen",
              "ATP",
              "Cytochromes"
            ],
            correctAnswer: 2,
            explanation: "ATP is the product of the electron transport chain and oxidative phosphorylation, not a participant in the process.",
            difficulty: "Super Hard",
            category: "Cellular Respiration"
          },
          {
            id: 222,
            question: "Which of the following best describes the function of the synaptonemal complex during meiosis?",
            options: [
              "It facilitates homologous chromosome pairing and recombination",
              "It separates sister chromatids during anaphase I",
              "It anchors spindle fibers to centromeres",
              "It breaks down the nuclear envelope"
            ],
            correctAnswer: 0,
            explanation: "The synaptonemal complex forms during prophase I of meiosis and plays a crucial role in the pairing and recombination of homologous chromosomes.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 223,
            question: "What is the main result of the Calvin cycle in photosynthesis?",
            options: [
              "Production of glucose",
              "Production of ATP",
              "Production of NADPH",
              "Production of G3P"
            ],
            correctAnswer: 3,
            explanation: "The Calvin cycle produces G3P (Glyceraldehyde-3-phosphate), which can be used to synthesize glucose and other organic molecules.",
            difficulty: "Super Hard",
            category: "Photosynthesis"
          },
          {
            id: 224,
            question: "What is the major difference between prokaryotic and eukaryotic cells in terms of genetic material?",
            options: [
              "Prokaryotes have linear DNA, while eukaryotes have circular DNA",
              "Eukaryotes have membrane-bound organelles, while prokaryotes do not",
              "Eukaryotic cells contain ribosomes, while prokaryotic cells do not",
              "Prokaryotes lack a membrane-bound nucleus, while eukaryotes have one"
            ],
            correctAnswer: 3,
            explanation: "Prokaryotic cells do not have a membrane-bound nucleus, whereas eukaryotic cells possess a true nucleus that encloses their genetic material.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 225,
            question: "Which of the following factors does not influence enzyme activity?",
            options: [
              "Temperature",
              "pH",
              "Substrate concentration",
              "Molecular weight of substrate"
            ],
            correctAnswer: 3,
            explanation: "While temperature, pH, and substrate concentration can affect enzyme activity, the molecular weight of the substrate does not directly influence enzyme activity.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 226,
            question: "Which of the following mechanisms directly contributes to genetic variation in sexually reproducing organisms?",
            options: [
              "DNA replication",
              "Gene mutation",
              "Independent assortment of chromosomes",
              "DNA repair"
            ],
            correctAnswer: 2,
            explanation: "Independent assortment of chromosomes during meiosis leads to genetic variation by shuffling maternal and paternal chromosomes into new combinations.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 227,
            question: "Which of the following molecules is responsible for providing the energy required to drive active transport across the plasma membrane?",
            options: [
              "ATP",
              "ADP",
              "NADPH",
              "GTP"
            ],
            correctAnswer: 0,
            explanation: "ATP is the primary energy source used to drive active transport, where molecules are transported against their concentration gradient.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 228,
            question: "Which of the following is the primary reason why the Calvin cycle does not occur in the dark?",
            options: [
              "The absence of ATP",
              "The absence of NADPH",
              "The absence of CO2",
              "The absence of ribulose bisphosphate"
            ],
            correctAnswer: 1,
            explanation: "The Calvin cycle requires NADPH, which is generated during the light reactions of photosynthesis. Without light, NADPH is not available.",
            difficulty: "Super Hard",
            category: "Photosynthesis"
          },
          {
            id: 229,
            question: "Which of the following best describes the role of the spindle fibers during mitosis?",
            options: [
              "They hold the chromatids together",
              "They pull the chromosomes to opposite poles",
              "They dissolve the nuclear envelope",
              "They synthesize the microtubules"
            ],
            correctAnswer: 1,
            explanation: "Spindle fibers are responsible for separating the chromosomes by pulling sister chromatids toward opposite poles during mitosis.",
            difficulty: "Super Hard",
            category: "Cell Division"
          },
          {
            id: 230,
            question: "Which enzyme is responsible for the synthesis of mRNA from a DNA template during transcription?",
            options: [
              "DNA polymerase",
              "RNA polymerase",
              "Reverse transcriptase",
              "Helicase"
            ],
            correctAnswer: 1,
            explanation: "RNA polymerase synthesizes mRNA from the DNA template during transcription, enabling gene expression.",
            difficulty: "Super Hard",
            category: "Molecular Biology"
          },
          {
            id: 231,
            question: "Which of the following is a characteristic of aneuploidy?",
            options: [
              "An organism has extra or missing chromosomes",
              "An organism has mutations in its gene sequence",
              "An organism has two sets of chromosomes",
              "An organism has abnormal amounts of proteins"
            ],
            correctAnswer: 0,
            explanation: "Aneuploidy refers to a condition where an organism has extra or missing chromosomes, leading to abnormal chromosome numbers.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 232,
            question: "Which of the following structures is responsible for increasing the surface area for absorption in the small intestine?",
            options: [
              "Villi",
              "Microvilli",
              "Goblet cells",
              "Crypts of Lieberkühn"
            ],
            correctAnswer: 1,
            explanation: "Microvilli, located on the epithelial cells of the villi, greatly increase the surface area for nutrient absorption in the small intestine.",
            difficulty: "Super Hard",
            category: "Human Physiology"
          },
          {
            id: 233,
            question: "Which of the following directly regulates the activity of the sodium-potassium pump?",
            options: [
              "ATP",
              "Na+ concentration",
              "K+ concentration",
              "Both Na+ and K+ concentrations"
            ],
            correctAnswer: 3,
            explanation: "The sodium-potassium pump activity is regulated by the concentrations of both Na+ and K+, as well as the hydrolysis of ATP.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 234,
            question: "Which of the following is the most significant difference between prokaryotic and eukaryotic cells regarding cellular organization?",
            options: [
              "Prokaryotic cells have a membrane-bound nucleus",
              "Eukaryotic cells lack organelles",
              "Prokaryotic cells lack membrane-bound organelles",
              "Eukaryotic cells do not have DNA"
            ],
            correctAnswer: 2,
            explanation: "Prokaryotic cells lack membrane-bound organelles, unlike eukaryotic cells which have organelles such as the mitochondria and nucleus.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 235,
            question: "Which of the following is true regarding a species' ecological niche?",
            options: [
              "It only includes its habitat",
              "It is defined by the physical space it occupies",
              "It includes both its role and habitat",
              "It is the species' location within its habitat"
            ],
            correctAnswer: 2,
            explanation: "An ecological niche encompasses both the habitat of a species and its role in the ecosystem, including how it obtains resources and interacts with other organisms.",
            difficulty: "Super Hard",
            category: "Ecology"
          },
          {
            id: 236,
            question: "Which of the following factors most directly influences the rate of enzyme-catalyzed reactions?",
            options: [
              "Temperature",
              "Concentration of enzyme",
              "Concentration of product",
              "Presence of cofactors"
            ],
            correctAnswer: 1,
            explanation: "The concentration of enzyme directly affects the rate of enzyme-catalyzed reactions, as more enzyme molecules increase the rate of reaction.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 237,
            question: "Which of the following best describes a function of the rough endoplasmic reticulum (RER)?",
            options: [
              "Lipid synthesis",
              "Protein synthesis for secretion",
              "Packaging of cellular waste",
              "Detoxification of harmful substances"
            ],
            correctAnswer: 1,
            explanation: "The rough endoplasmic reticulum (RER) is involved in the synthesis of proteins that are secreted or sent to other organelles.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 238,
            question: "Which of the following statements about hydrogen bonding in water is true?",
            options: [
              "Hydrogen bonds are weaker than covalent bonds",
              "Hydrogen bonds cause water molecules to repel each other",
              "Hydrogen bonds do not influence water's boiling point",
              "Hydrogen bonds form between water molecules and ionic compounds only"
            ],
            correctAnswer: 0,
            explanation: "Hydrogen bonds are weaker than covalent bonds, but they play a crucial role in water's unique properties, including its high boiling point.",
            difficulty: "Super Hard",
            category: "Chemistry"
          },
          {
            id: 239,
            question: "Which of the following is an example of a non-competitive inhibitor?",
            options: [
              "A molecule binding to an enzyme's active site",
              "A molecule binding to a site other than the active site and altering the enzyme's shape",
              "A molecule that mimics the substrate and binds to the active site",
              "A molecule that breaks down the enzyme"
            ],
            correctAnswer: 1,
            explanation: "Non-competitive inhibitors bind to a site other than the active site, causing a conformational change in the enzyme that reduces its activity.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 240,
            question: "Which of the following is most likely to occur during the G1 phase of the cell cycle?",
            options: [
              "DNA replication",
              "Chromosome segregation",
              "Cell growth and preparation for DNA synthesis",
              "Cytokinesis"
            ],
            correctAnswer: 2,
            explanation: "The G1 phase is characterized by cell growth and preparation for DNA synthesis, where the cell increases in size and synthesizes necessary proteins.",
            difficulty: "Super Hard",
            category: "Cell Cycle"
          },
          {
            id: 241,
            question: "Which of the following events happens first during the process of DNA replication?",
            options: [
              "Primase synthesizes RNA primer",
              "Helicase unwinds the DNA double helix",
              "DNA polymerase extends the RNA primer",
              "Ligase joins the Okazaki fragments"
            ],
            correctAnswer: 1,
            explanation: "Helicase unwinds the DNA double helix before primase can synthesize the RNA primer, which is required for DNA polymerase to begin replication.",
            difficulty: "Super Hard",
            category: "Molecular Biology"
          },
          {
            id: 242,
            question: "Which of the following is the most accurate description of the term 'epistasis'?",
            options: [
              "The interaction between two alleles of the same gene",
              "The expression of one gene is affected by another gene at a different locus",
              "A gene that masks the expression of other genes",
              "A genetic interaction where one gene causes a new phenotype"
            ],
            correctAnswer: 1,
            explanation: "Epistasis refers to the interaction where the expression of one gene is affected by another gene located at a different locus.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 243,
            question: "Which of the following is a consequence of crossing over during meiosis?",
            options: [
              "Chromosomes become identical",
              "Genetic recombination occurs between homologous chromosomes",
              "The number of chromosomes is halved",
              "The spindle fibers dissolve"
            ],
            correctAnswer: 1,
            explanation: "Crossing over leads to genetic recombination, resulting in new combinations of alleles on homologous chromosomes.",
            difficulty: "Super Hard",
            category: "Cell Division"
          },
          {
            id: 244,
            question: "Which of the following best explains why the Calvin cycle is considered a cycle?",
            options: [
              "It produces glucose and oxygen from carbon dioxide",
              "It uses ATP to fix carbon dioxide into organic molecules",
              "It regenerates the starting molecule, ribulose bisphosphate",
              "It produces NADH and NADPH"
            ],
            correctAnswer: 2,
            explanation: "The Calvin cycle is considered a cycle because the molecule ribulose bisphosphate is regenerated at the end of the cycle, enabling the process to repeat.",
            difficulty: "Super Hard",
            category: "Photosynthesis"
          },
          {
            id: 245,
            question: "Which of the following processes contributes to the formation of an electrochemical gradient across the mitochondrial inner membrane?",
            options: [
              "The flow of protons through ATP synthase",
              "The reduction of oxygen to form water",
              "The pumping of protons into the intermembrane space by the electron transport chain",
              "The splitting of water molecules"
            ],
            correctAnswer: 2,
            explanation: "The electron transport chain pumps protons from the mitochondrial matrix into the intermembrane space, establishing an electrochemical gradient that drives ATP synthesis.",
            difficulty: "Super Hard",
            category: "Cell Respiration"
          },
          {
            id: 246,
            question: "Which of the following molecules would most likely function as an allosteric activator in enzyme regulation?",
            options: [
              "A molecule that binds to the enzyme's active site",
              "A molecule that binds to a site other than the active site and enhances the enzyme's activity",
              "A molecule that decreases the enzyme's binding affinity for the substrate",
              "A molecule that prevents the enzyme from interacting with its substrate"
            ],
            correctAnswer: 1,
            explanation: "An allosteric activator binds to a site other than the active site, causing a conformational change that increases the enzyme's activity.",
            difficulty: "Super Hard",
            category: "Biochemistry"
          },
          {
            id: 247,
            question: "Which of the following is a characteristic feature of the Golgi apparatus?",
            options: [
              "It is involved in protein synthesis",
              "It is a site of RNA splicing",
              "It modifies, sorts, and packages proteins for secretion",
              "It contains enzymes for cellular respiration"
            ],
            correctAnswer: 2,
            explanation: "The Golgi apparatus is responsible for modifying, sorting, and packaging proteins for secretion or delivery to other parts of the cell.",
            difficulty: "Super Hard",
            category: "Cell Biology"
          },
          {
            id: 248,
            question: "Which of the following best describes the function of the enzyme catalase?",
            options: [
              "It converts hydrogen peroxide into water and oxygen",
              "It synthesizes glucose from pyruvate",
              "It converts ADP to ATP",
              "It helps in the synthesis of RNA"
            ],
            correctAnswer: 0,
            explanation: "Catalase is an enzyme that breaks down hydrogen peroxide, a toxic byproduct of cellular metabolism, into harmless water and oxygen.",
            difficulty: "Super Hard",
            category: "Enzyme Function"
          },
          {
            id: 249,
            question: "Which of the following is most likely to result in a change in phenotype in a population?",
            options: [
              "A mutation in a gene that is not expressed",
              "A mutation in a gene that changes the protein function",
              "A mutation in a non-coding region of DNA",
              "A mutation that occurs in somatic cells"
            ],
            correctAnswer: 1,
            explanation: "A mutation that changes the protein function can lead to a change in phenotype, as it may alter the organism's traits.",
            difficulty: "Super Hard",
            category: "Genetics"
          },
          {
            id: 250,
            question: "Which of the following is the result of a frameshift mutation?",
            options: [
              "A change in a single amino acid in a protein",
              "A premature stop codon in the mRNA",
              "A shift in the reading frame of the mRNA, altering the entire protein",
              "No change in the protein's amino acid sequence"
            ],
            correctAnswer: 2,
            explanation: "A frameshift mutation causes a shift in the reading frame of the mRNA, leading to the alteration of the entire protein sequence from the mutation site onward.",
            difficulty: "Super Hard",
            category: "Molecular Biology"
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

        // Check if NEET1 access code exists and is valid
        if (data.accesscode && data.accesscode.NEET1) {
            const accessCodeData = data.accesscode.NEET1;
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
            'NEET1': {
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

        if (data.examanswers && data.examanswers.NEET1 && data.examanswers.NEET1.answers) {
            const savedAnswers = data.examanswers.NEET1.answers;
            
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
        return `NEET1-${randomPin}`;
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
                amount: "14900", // 149 INR
                currency: "INR",
                name: "Exam Paper Academy",
                description: "NEET Vol.1 Mock Engine",
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
                                examType: 'NEET1'
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
                    examType: 'NEET1'
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
                examType: 'NEET1'
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
        doc.text('NEET-Vol1: NEET Vol.1 Mock Report', 10, 10);
        
        // Certificate Details
        doc.setFontSize(12);
        doc.text(`Certificate Number: ${examMetadata.certificateNumber}`, 10, 50);
        doc.text(`NEET Vol.1 Mock Engine`, 10, 60);
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
            doc.text('NEET-Vol1: NEET Vol.1 Mock Report', pageWidth / 2, 30, { align: 'right' });
    
            // Exam Details
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            let yPosition = 50;
    
            const addDetailLine = (label, value) => {
                doc.text(`${label}: ${value}`, margin, yPosition);
                yPosition += 10;
            };
    
            addDetailLine('Report Number', examMetadata.certificateNumber);
            addDetailLine('Exam Name', 'NEET Vol.1 Mock Engine');
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
            doc.text('NEET-Vol1: NEET Vol.1 Mock Report', pageWidth / 2, 30, { align: 'right' });
    
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
                <h1 style={{fontSize: 24}}><ScanSearch size={20} style={{marginTop: -5}} /> NEET Vol.1</h1>
                <p><Play size={15} style={{marginTop: -3}} /> Module: Biology | Phsyics | Chemistry</p>
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
                        <Disc size={18} /> NEET Vol.1 Mock Engine
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
                    placeholder="Ask for more details about this NEET Mock Question"
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
