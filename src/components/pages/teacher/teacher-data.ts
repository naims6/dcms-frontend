export interface Teacher {
  id: string;
  name: string;
  nameBn: string;
  subject: string;
  subjectBn: string;
  department: string;
  departmentBn: string;
  level: string;
  levelBn: string;
  email: string;
  phone: string;
  experience: number;
  education: string;
  educationBn: string;
  bio: string;
  bioBn: string;
  image: string;
}

export const teachers: Teacher[] = [
  {
    id: "1",
    name: "SM A Subahan",
    nameBn: "এস এম এ সুবাহান",
    subject: "N/A",
    subjectBn: "এন/এ",
    department: "N/A",
    departmentBn: "এন/এ",
    level: "President",
    levelBn: "সভাপতি",
    email: "ayesha@dcms.edu.bd",
    phone: "+880 1711-000001",
    experience: 0,
    education: "B.Sc,",
    educationBn: "বি.এস.সি,",
    bio: "SM A Subahan is the visionary leader of DCMS, dedicated to fostering a nurturing and innovative educational environment for all students.",
    bioBn:
      "এস এম এ সুবাহান ডিসিএমএসের দৃষ্টিভঙ্গিপূর্ণ নেতা, সকল শিক্ষার্থীর জন্য একটি স্নেহপূর্ণ এবং উদ্ভাবনী শিক্ষার পরিবেশ গড়ে তোলার জন্য নিবেদিত।",
    image:
      "https://res.cloudinary.com/dynxnpj21/image/upload/v1776512089/278056786_930805360926876_7862545157050764468_n_syisvc.jpg",
  },
  {
    id: "2",
    name: "SM Masud Kabir",
    nameBn: "এস এম মাসুদ কবির",
    subject: "Science",
    subjectBn: "বিজ্ঞান",
    department: "Science",
    departmentBn: "বিজ্ঞান",
    level: "Head Teacher",
    levelBn: "প্রধান শিক্ষক",
    email: "masudkabir@dcms.edu.bd",
    phone: "+880 1711-000002",
    experience: 18,
    education: "M.Sc. in Physics, BUET",
    educationBn: "এম.এস.সি. পদার্থবিজ্ঞান, বুয়েট",
    bio: "Rafiq leads the science department with 18 years of experience, fostering a culture of inquiry and hands-on experimentation among students.",
    bioBn:
      "রফিক ১৮ বছরের অভিজ্ঞতা নিয়ে বিজ্ঞান বিভাগ পরিচালনা করেন এবং শিক্ষার্থীদের মধ্যে অনুসন্ধিৎসা ও হাতে-কলমে পরীক্ষার সংস্কৃতি গড়ে তোলেন।",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
  {
    id: "3",
    name: "Mohammad Abul Hosen",
    nameBn: "মোহাম্মদ আবুল হোসেন",
    subject: "Accounting",
    subjectBn: "অ্যাকাউন্টিং",
    department: "Accounting",
    departmentBn: "অ্যাকাউন্টিং",
    level: "Assistant Head Teacher",
    levelBn: "সহায়ক প্রধান শিক্ষক",
    email: "abulhosen@dcms.edu.bd",
    phone: "+880 1711-000003",
    experience: 9,
    education: "M.A. in English Literature, Jahangirnagar University",
    educationBn: "এম.এ. ইংরেজি সাহিত্য, জাহাঙ্গীরনগর বিশ্ববিদ্যালয়",
    bio: "Mohammad Abul Hosen specializes in accounting education, helping students understand financial concepts and develop strong analytical skills.",
    bioBn:
      "মোহাম্মদ আবুল হোসেন অ্যাকাউন্টিং শিক্ষায় বিশেষজ্ঞ, শিক্ষার্থীদের আর্থিক ধারণা বুঝতে এবং শক্তিশালী বিশ্লেষণের দক্ষতা অর্জনে সাহায্য করেন।",
    image:
      "https://res.cloudinary.com/dynxnpj21/image/upload/v1776512089/5_balnma.webp",
  },
  {
    id: "4",
    name: "Arif Chowdhury",
    nameBn: "আরিফ চৌধুরী",
    subject: "History",
    subjectBn: "ইতিহাস",
    department: "Humanities",
    departmentBn: "মানবিক",
    level: "Social Studies Teacher",
    levelBn: "সমাজ বিজ্ঞান শিক্ষক",
    email: "arif@dcms.edu.bd",
    phone: "+880 1711-000004",
    experience: 14,
    education: "M.A. in History, Rajshahi University",
    educationBn: "এম.এ. ইতিহাস, রাজশাহী বিশ্ববিদ্যালয়",
    bio: "Arif brings history to life through storytelling and critical analysis, encouraging students to connect the past with present-day realities.",
    bioBn:
      "আরিফ গল্প বলা ও সমালোচনামূলক বিশ্লেষণের মাধ্যমে ইতিহাসকে জীবন্ত করে তোলেন এবং শিক্ষার্থীদের অতীতকে বর্তমানের সাথে সংযুক্ত করতে উৎসাহিত করেন।",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    id: "5",
    name: "Taslima Noor",
    nameBn: "তাসলিমা নূর",
    subject: "Bangla",
    subjectBn: "বাংলা",
    department: "Languages",
    departmentBn: "ভাষা",
    level: "Literature Mentor",
    levelBn: "সাহিত্য পরামর্শদাতা",
    email: "taslima@dcms.edu.bd",
    phone: "+880 1711-000005",
    experience: 16,
    education: "M.A. in Bangla, Dhaka University",
    educationBn: "এম.এ. বাংলা, ঢাকা বিশ্ববিদ্যালয়",
    bio: "Taslima nurtures a love for Bangla literature and language, guiding students through poetry, prose, and the rich cultural heritage of Bangladesh.",
    bioBn:
      "তাসলিমা বাংলা সাহিত্য ও ভাষার প্রতি ভালোবাসা জাগিয়ে তোলেন এবং কবিতা, গদ্য ও বাংলাদেশের সমৃদ্ধ সাংস্কৃতিক ঐতিহ্যের মধ্য দিয়ে শিক্ষার্থীদের পরিচালিত করেন।",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
  {
    id: "6",
    name: "Nayeem Ahmed",
    nameBn: "নাঈম আহমেদ",
    subject: "Physical Education",
    subjectBn: "শারীরিক শিক্ষা",
    department: "Sports & Wellness",
    departmentBn: "ক্রীড়া ও সুস্থতা",
    level: "Sports & Wellness Coach",
    levelBn: "ক্রীড়া ও সুস্থতা প্রশিক্ষক",
    email: "nayeem@dcms.edu.bd",
    phone: "+880 1711-000006",
    experience: 8,
    education: "B.P.Ed., National Sports Institute",
    educationBn: "বি.পি.এড., জাতীয় ক্রীড়া ইনস্টিটিউট",
    bio: "Nayeem promotes physical fitness, teamwork, and sportsmanship, helping students develop healthy habits and a competitive spirit.",
    bioBn:
      "নাঈম শারীরিক সুস্থতা, দলগত কাজ ও ক্রীড়াসুলভ মনোভাব প্রচার করেন এবং শিক্ষার্থীদের সুস্থ অভ্যাস ও প্রতিযোগিতামূলক মনোভাব গড়ে তুলতে সাহায্য করেন।",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  {
    id: "7",
    name: "Nasrin Begum",
    nameBn: "নাসরিন বেগম",
    subject: "Chemistry",
    subjectBn: "রসায়ন",
    department: "Science",
    departmentBn: "বিজ্ঞান",
    level: "Senior Science Teacher",
    levelBn: "সিনিয়র বিজ্ঞান শিক্ষক",
    email: "nasrin@dcms.edu.bd",
    phone: "+880 1711-000007",
    experience: 11,
    education: "M.Sc. in Chemistry, Chittagong University",
    educationBn: "এম.এস.সি. রসায়ন, চট্টগ্রাম বিশ্ববিদ্যালয়",
    bio: "Nasrin makes chemistry engaging through lab experiments and real-world applications, inspiring students to pursue science careers.",
    bioBn:
      "নাসরিন ল্যাব পরীক্ষা ও বাস্তব প্রয়োগের মাধ্যমে রসায়নকে আকর্ষণীয় করে তোলেন এবং শিক্ষার্থীদের বিজ্ঞান ক্যারিয়ারে অনুপ্রাণিত করেন।",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80",
  },
  {
    id: "8",
    name: "Kamal Hossain",
    nameBn: "কামাল হোসেন",
    subject: "ICT",
    subjectBn: "তথ্য ও যোগাযোগ প্রযুক্তি",
    department: "Technology",
    departmentBn: "প্রযুক্তি",
    level: "ICT Instructor",
    levelBn: "আইসিটি প্রশিক্ষক",
    email: "kamal@dcms.edu.bd",
    phone: "+880 1711-000008",
    experience: 7,
    education: "B.Sc. in Computer Science, BRAC University",
    educationBn: "বি.এস.সি. কম্পিউটার বিজ্ঞান, ব্র্যাক বিশ্ববিদ্যালয়",
    bio: "Kamal equips students with digital literacy and programming fundamentals, preparing them for a technology-driven future.",
    bioBn:
      "কামাল শিক্ষার্থীদের ডিজিটাল সাক্ষরতা ও প্রোগ্রামিংয়ের মূল বিষয়গুলো শেখান এবং তাদের প্রযুক্তি-চালিত ভবিষ্যতের জন্য প্রস্তুত করেন।",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
  },
];
