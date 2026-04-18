export type GalleryWidth = "normal" | "wide" | "tall";

export interface GalleryItem {
  id: number;
  src: string;
  title: string;
  category: string;
  batch: string;
  year: string;
  width: GalleryWidth;
  className: string;
}

export const galleryData: GalleryItem[] = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dynxnpj21/image/upload/v1776513314/486665829_1184789560100233_464054022241562860_n_urbx9z.jpg",
    title: "Science Fair 2025",
    category: "Events",
    batch: "SSC 2025",
    year: "2025",
    width: "wide",
    className: "col-span-2 row-span-2 md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dynxnpj21/image/upload/v1776513311/486861209_1183349200244269_497215588616879568_n_x83pzk.jpg",
    title: "Classroom Activities",
    category: "Academic",
    batch: "Class 10",
    year: "2024",
    width: "normal",
    className: "col-span-1 row-span-1",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dynxnpj21/image/upload/v1776513312/637515210_1444407760805077_5694837561836936762_n_v1kjf8.jpg",
    title: "Library Study Session",
    category: "Campus",
    batch: "HSC 2025",
    year: "2023",
    width: "normal",
    className: "col-span-1 row-span-1",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dynxnpj21/image/upload/v1776513312/560555838_1341863654392822_102613112685936378_n_lk4d0i.jpg",
    title: "Coding Workshop",
    category: "Workshop",
    batch: "Science Group",
    year: "2023",
    width: "wide",
    className: "col-span-2 md:col-span-2 row-span-1",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dynxnpj21/image/upload/v1776513313/672314494_1318466850179824_6486759301264425826_n_zvvrep.jpg",
    title: "Annual Sports Meet",
    category: "Sports",
    batch: "All Batches",
    year: "2024",
    width: "normal",
    className: "col-span-1 row-span-1",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/dynxnpj21/image/upload/v1776513312/618599273_1422493856329801_2616360197938715890_n_wzcwru.jpg",
    title: "Campus Aerial View",
    category: "Campus",
    batch: "N/A",
    year: "2022",
    width: "tall",
    className: "col-span-1 row-span-1",
  },
  {
    id: 7,
    src: "https://res.cloudinary.com/dynxnpj21/image/upload/v1776513313/659140435_1476546187591234_5190187836425522146_n_qvechi.jpg",
    title: "Graduation Party",
    category: "Events",
    batch: "SSC 2023",
    year: "2023",
    width: "normal",
    className: "col-span-2 md:col-span-2 lg:col-span-2 row-span-1",
  },
  {
    id: 8,
    src: "https://res.cloudinary.com/dynxnpj21/image/upload/v1776513314/486665829_1184789560100233_464054022241562860_n_urbx9z.jpg",
    title: "Prize Giving Ceremony",
    category: "Events",
    batch: "All Batches",
    year: "2024",
    width: "wide",
    className: "col-span-2 md:col-span-2 row-span-1",
  },
  {
    id: 9,
    src: "https://res.cloudinary.com/dynxnpj21/image/upload/v1776513313/672314494_1318466850179824_6486759301264425826_n_zvvrep.jpg",
    title: "Football Tournament",
    category: "Sports",
    batch: "Batch 2024",
    year: "2024",
    width: "normal",
    className: "col-span-1 row-span-1",
  },
];

export const landingGalleryItems = galleryData.slice(0, 7);
