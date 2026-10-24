'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage, useFilters } from '@/lib/context';
import {
  calculateBuiltUpNorms,
  calculateFacultyNorms,
  calculateHaversineDistance,
  validateMultiPlotContiguity,
  CampusPlot,
} from '@/lib/aph-engine';
import { BlueprintVectorViewer } from '@/components/workbench/BlueprintVectorViewer';
import { toast } from 'sonner';
import {
  Layers,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  MapPin,
  Camera,
  Compass,
  Building,
  RefreshCw,
  Users,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  Eye,
  EyeOff,
  Crosshair,
  Sparkles,
  FileText,
  Check,
  Search,
  ChevronDown,
} from 'lucide-react';

// Institution-specific Cadastral GIS & Multi-Plot Data
interface InstitutionSpatialProfile {
  plots: CampusPlot[];
  photos: Array<{
    id: string;
    title: string;
    facilityType: string;
    exif: {
      lat: number;
      lon: number;
      altitude: string;
      dateTime: string;
      device: string;
      focalLength: string;
    };
    pHash: string;
    dinoCosine: number;
    isDuplicate: boolean;
    duplicateSource?: string;
    detections: Array<{
      id: string;
      label: string;
      model: 'RT-DETR-L' | 'YOLOv8x';
      confidence: number;
      bbox: [number, number, number, number]; // [x, y, w, h] in %
      category: 'equipment' | 'compliance' | 'safety' | 'accessibility';
    }>;
  }>;
}

const INSTITUTION_SPATIAL_PROFILES: Record<string, InstitutionSpatialProfile> = {
  // 1. Apex Institute (Gurugram) - Urban, Discrepant Lab
  'AICTE-2026-NW-0842': {
    plots: [
      {
        id: 'PLOT-1',
        name: 'Plot 1 (Primary Academic & Administrative Complex)',
        lat: 28.4595,
        lon: 77.0266,
        areaAcres: 1.85,
        khasraNo: '114/2',
        containsAcademicBuiltUp: true,
        isContiguousToMain: true,
      },
      {
        id: 'PLOT-2',
        name: 'Plot 2 (Hostel Blocks & Sports Annex)',
        lat: 28.4682,
        lon: 77.0345,
        areaAcres: 0.85,
        khasraNo: '115/1',
        containsAcademicBuiltUp: false,
        isContiguousToMain: false,
      },
    ],
    photos: [
      {
        id: 'PHOTO-01',
        title: '1. VLSI & Embedded Systems Lab',
        facilityType: 'Instructional Specialized Lab (INA)',
        exif: {
          lat: 28.4596,
          lon: 77.0267,
          altitude: '224.5 m',
          dateTime: '2026-03-20 11:24:18',
          device: 'Sony α7 IV (FE 24-70mm GM)',
          focalLength: '28mm f/4.0',
        },
        pHash: '8f3a9e2d1c4b7a60',
        dinoCosine: 0.284,
        isDuplicate: false,
        detections: [
          { id: 'DET-101', label: 'Digital Storage Oscilloscope (Tektronix)', model: 'RT-DETR-L', confidence: 0.941, bbox: [12, 38, 26, 28], category: 'equipment' },
          { id: 'DET-102', label: 'FPGA Development Boards (Xilinx x24)', model: 'YOLOv8x', confidence: 0.968, bbox: [42, 45, 34, 25], category: 'equipment' },
          { id: 'DET-103', label: 'ESD Anti-Static Workstation Bench', model: 'RT-DETR-L', confidence: 0.925, bbox: [8, 58, 84, 38], category: 'compliance' },
        ],
      },
      {
        id: 'PHOTO-02',
        title: '2. Mechanical CAD / CNC Workshop',
        facilityType: 'Instructional Central Workshop (INA)',
        exif: {
          lat: 28.4598,
          lon: 77.0269,
          altitude: '223.8 m',
          dateTime: '2026-03-20 12:05:42',
          device: 'Sony α7 IV (FE 24-70mm GM)',
          focalLength: '24mm f/5.6',
        },
        pHash: 'c7d2e1b4a9f83062',
        dinoCosine: 0.312,
        isDuplicate: false,
        detections: [
          { id: 'DET-201', label: 'CNC 5-Axis Milling Center (Haas)', model: 'RT-DETR-L', confidence: 0.962, bbox: [18, 22, 38, 56], category: 'equipment' },
          { id: 'DET-202', label: 'Computer Workstation Cluster (x32)', model: 'YOLOv8x', confidence: 0.981, bbox: [60, 35, 32, 42], category: 'equipment' },
          { id: 'DET-203', label: 'Safety Eyewash & Perimeter Guard', model: 'RT-DETR-L', confidence: 0.914, bbox: [5, 40, 14, 38], category: 'safety' },
        ],
      },
      {
        id: 'PHOTO-03',
        title: '3. Barrier-Free PWD Wheelchair Ramp & Tactile Pathway',
        facilityType: 'Mandatory Accessibility Infrastructure (AMA)',
        exif: {
          lat: 28.4593,
          lon: 77.0264,
          altitude: '225.1 m',
          dateTime: '2026-03-20 14:15:09',
          device: 'iPhone 15 Pro Max',
          focalLength: '24mm f/1.78',
        },
        pHash: '5e8b1d9f2a7c4031',
        dinoCosine: 0.198,
        isDuplicate: false,
        detections: [
          { id: 'DET-301', label: 'PWD Ramp Slope 1:12 Verified Gradient', model: 'RT-DETR-L', confidence: 0.924, bbox: [15, 32, 70, 52], category: 'accessibility' },
          { id: 'DET-302', label: 'Yellow Tactile Warning Paving Blocks', model: 'YOLOv8x', confidence: 0.953, bbox: [25, 74, 52, 22], category: 'accessibility' },
          { id: 'DET-303', label: 'Continuous Double Handrail (900mm)', model: 'RT-DETR-L', confidence: 0.938, bbox: [10, 20, 20, 68], category: 'accessibility' },
        ],
      },
      {
        id: 'PHOTO-04',
        title: '4. Fire Hydrant & Safety Assembly Point',
        facilityType: 'Life Safety & Statutory Compliance',
        exif: {
          lat: 28.4592,
          lon: 77.0271,
          altitude: '224.0 m',
          dateTime: '2026-03-20 15:32:00',
          device: 'iPhone 15 Pro Max',
          focalLength: '24mm f/1.78',
        },
        pHash: '1a4d7b2e9c8f0356',
        dinoCosine: 0.225,
        isDuplicate: false,
        detections: [
          { id: 'DET-401', label: '50kL Pressurized Fire Standpipe Hydrant', model: 'RT-DETR-L', confidence: 0.978, bbox: [22, 34, 25, 48], category: 'safety' },
          { id: 'DET-402', label: 'Photoluminescent Assembly Point Sign', model: 'YOLOv8x', confidence: 0.942, bbox: [55, 18, 30, 28], category: 'safety' },
          { id: 'DET-403', label: 'CO2 Fire Extinguisher (IS 15683)', model: 'RT-DETR-L', confidence: 0.965, bbox: [52, 52, 18, 34], category: 'safety' },
        ],
      },
    ],
  },

  // 2. Deccan Academy (Bengaluru) - Discontinuous Multi-Plot Violation (3.80 km > 2.0 km norm)
  'AICTE-2026-SW-0592': {
    plots: [
      {
        id: 'PLOT-1',
        name: 'Plot 1 (Primary Academic Block - Koramangala)',
        lat: 12.9352,
        lon: 77.6245,
        areaAcres: 1.6,
        khasraNo: '44/2',
        containsAcademicBuiltUp: true,
        isContiguousToMain: true,
      },
      {
        id: 'PLOT-2',
        name: 'Plot 2 (Sports Ground & Extended Workshop Annex - Sarjapur)',
        lat: 12.905,
        lon: 77.652,
        areaAcres: 1.0,
        khasraNo: '89/1',
        containsAcademicBuiltUp: false,
        isContiguousToMain: false,
      },
    ],
    photos: [
      {
        id: 'PHOTO-01',
        title: '1. VLSI & Embedded Systems Lab',
        facilityType: 'Instructional Specialized Lab (INA)',
        exif: {
          lat: 12.9353,
          lon: 77.6246,
          altitude: '912.4 m',
          dateTime: '2026-03-21 10:14:00',
          device: 'Canon EOS R6 Mark II',
          focalLength: '35mm f/2.8',
        },
        pHash: '9a1c4b8e2f3d7065',
        dinoCosine: 0.271,
        isDuplicate: false,
        detections: [
          { id: 'DET-101', label: 'Mixed-Signal Oscilloscope 200MHz', model: 'RT-DETR-L', confidence: 0.935, bbox: [15, 40, 28, 30], category: 'equipment' },
          { id: 'DET-102', label: 'Robotic Arm Manipulator (ABB)', model: 'YOLOv8x', confidence: 0.972, bbox: [50, 32, 38, 48], category: 'equipment' },
        ],
      },
      {
        id: 'PHOTO-02',
        title: '2. Mechanical CAD / CNC Workshop',
        facilityType: 'Instructional Central Workshop (INA)',
        exif: {
          lat: 12.9051,
          lon: 77.6521,
          altitude: '908.2 m',
          dateTime: '2026-03-21 14:40:22',
          device: 'Canon EOS R6 Mark II',
          focalLength: '24mm f/4.0',
        },
        pHash: '3d8e2a1b9f4c7056',
        dinoCosine: 0.295,
        isDuplicate: false,
        detections: [
          { id: 'DET-201', label: 'CNC Vertical Machining Center', model: 'RT-DETR-L', confidence: 0.954, bbox: [20, 25, 42, 54], category: 'equipment' },
          { id: 'DET-202', label: 'Computer Workstation Cluster (x32)', model: 'YOLOv8x', confidence: 0.985, bbox: [65, 40, 28, 40], category: 'equipment' },
        ],
      },
      {
        id: 'PHOTO-03',
        title: '3. Barrier-Free PWD Wheelchair Ramp & Tactile Pathway',
        facilityType: 'Mandatory Accessibility Infrastructure (AMA)',
        exif: {
          lat: 12.9351,
          lon: 77.6244,
          altitude: '913.0 m',
          dateTime: '2026-03-21 11:20:15',
          device: 'Canon EOS R6 Mark II',
          focalLength: '28mm f/2.8',
        },
        pHash: '6f2a9c1e4b8d7032',
        dinoCosine: 0.21,
        isDuplicate: false,
        detections: [
          { id: 'DET-301', label: 'PWD Ramp Slope 1:12 Gradient', model: 'RT-DETR-L', confidence: 0.918, bbox: [12, 35, 68, 50], category: 'accessibility' },
          { id: 'DET-302', label: 'Tactile Guideway Warning Blocks', model: 'YOLOv8x', confidence: 0.949, bbox: [22, 72, 55, 20], category: 'accessibility' },
        ],
      },
      {
        id: 'PHOTO-04',
        title: '4. Fire Hydrant & Safety Assembly Point',
        facilityType: 'Life Safety & Statutory Compliance',
        exif: {
          lat: 12.9355,
          lon: 77.6248,
          altitude: '911.8 m',
          dateTime: '2026-03-21 12:05:50',
          device: 'Canon EOS R6 Mark II',
          focalLength: '24mm f/4.0',
        },
        pHash: '2e7a1b9f4c8d0361',
        dinoCosine: 0.238,
        isDuplicate: false,
        detections: [
          { id: 'DET-401', label: 'Pressurized Fire Hydrant Post', model: 'RT-DETR-L', confidence: 0.971, bbox: [25, 30, 22, 50], category: 'safety' },
          { id: 'DET-402', label: 'Assembly Zone Signpost', model: 'YOLOv8x', confidence: 0.939, bbox: [58, 20, 28, 26], category: 'safety' },
        ],
      },
    ],
  },

  // 3. Vindhya Valley (Bhopal) - Duplicate Photo Re-use Detected
  'AICTE-2026-CE-0928': {
    plots: [
      {
        id: 'PLOT-1',
        name: 'Plot 1 (Consolidated Rural Technical Campus - Bhopal Bypass)',
        lat: 23.2599,
        lon: 77.4126,
        areaAcres: 7.6,
        khasraNo: '201/3',
        containsAcademicBuiltUp: true,
        isContiguousToMain: true,
      },
    ],
    photos: [
      {
        id: 'PHOTO-01',
        title: '1. VLSI & Embedded Systems Lab (Submitted as AI Lab)',
        facilityType: 'Instructional Specialized Lab (INA)',
        exif: {
          lat: 23.2601,
          lon: 77.4128,
          altitude: '512.0 m',
          dateTime: '2026-03-22 09:30:10',
          device: 'Nikon Z6 II',
          focalLength: '28mm f/3.5',
        },
        // EXACT HASH CLONE of Photo 02!
        pHash: 'ffff0000aaaa5555ffff0000aaaa5555',
        dinoCosine: 0.997,
        isDuplicate: true,
        duplicateSource: 'REUSED FROM MECHANICAL CAD LAB (2024 ARCHIVE)',
        detections: [
          { id: 'DET-101', label: 'Computer Workstation Cluster (x32)', model: 'YOLOv8x', confidence: 0.988, bbox: [15, 30, 70, 50], category: 'equipment' },
          { id: 'DET-102', label: 'Wall Mounted Switch Rack', model: 'RT-DETR-L', confidence: 0.942, bbox: [75, 15, 20, 30], category: 'equipment' },
        ],
      },
      {
        id: 'PHOTO-02',
        title: '2. Mechanical CAD / CNC Workshop',
        facilityType: 'Instructional Central Workshop (INA)',
        exif: {
          lat: 23.2601,
          lon: 77.4128,
          altitude: '512.0 m',
          dateTime: '2024-04-12 11:15:00', // Submitted 2 years ago!
          device: 'Nikon Z6 II',
          focalLength: '28mm f/3.5',
        },
        pHash: 'ffff0000aaaa5555ffff0000aaaa5555',
        dinoCosine: 0.997,
        isDuplicate: true,
        duplicateSource: 'ORIGINAL CAD WORKSHOP IMAGE (2024 ARCHIVE)',
        detections: [
          { id: 'DET-201', label: 'Computer Workstation Cluster (x32)', model: 'YOLOv8x', confidence: 0.988, bbox: [15, 30, 70, 50], category: 'equipment' },
          { id: 'DET-202', label: 'Wall Mounted Switch Rack', model: 'RT-DETR-L', confidence: 0.942, bbox: [75, 15, 20, 30], category: 'equipment' },
        ],
      },
      {
        id: 'PHOTO-03',
        title: '3. Barrier-Free PWD Wheelchair Ramp & Tactile Pathway',
        facilityType: 'Mandatory Accessibility Infrastructure (AMA)',
        exif: {
          lat: 23.2598,
          lon: 77.4124,
          altitude: '513.2 m',
          dateTime: '2026-03-22 10:45:00',
          device: 'Nikon Z6 II',
          focalLength: '35mm f/2.8',
        },
        pHash: '4a8b2d1c7e9f0361',
        dinoCosine: 0.205,
        isDuplicate: false,
        detections: [
          { id: 'DET-301', label: 'PWD Ramp Slope 1:12 Gradient', model: 'RT-DETR-L', confidence: 0.921, bbox: [10, 32, 75, 52], category: 'accessibility' },
          { id: 'DET-302', label: 'Tactile Warning Paving Tiles', model: 'YOLOv8x', confidence: 0.945, bbox: [20, 70, 55, 22], category: 'accessibility' },
        ],
      },
      {
        id: 'PHOTO-04',
        title: '4. Fire Hydrant & Safety Assembly Point',
        facilityType: 'Life Safety & Statutory Compliance',
        exif: {
          lat: 23.2603,
          lon: 77.4129,
          altitude: '511.5 m',
          dateTime: '2026-03-22 11:30:15',
          device: 'Nikon Z6 II',
          focalLength: '24mm f/4.0',
        },
        pHash: '7b1c4e8a2d9f0352',
        dinoCosine: 0.219,
        isDuplicate: false,
        detections: [
          { id: 'DET-401', label: 'Pressurized Fire Hydrant Post', model: 'RT-DETR-L', confidence: 0.974, bbox: [20, 35, 25, 45], category: 'safety' },
          { id: 'DET-402', label: 'Emergency Assembly Sign', model: 'YOLOv8x', confidence: 0.948, bbox: [60, 20, 25, 25], category: 'safety' },
        ],
      },
    ],
  },
};

// Default profile generator for institutions 4, 5, 6
function getDefaultProfile(appId: string, city: string, state: string): InstitutionSpatialProfile {
  return {
    plots: [
      {
        id: 'PLOT-1',
        name: `Plot 1 (Main Academic Campus - ${city})`,
        lat: 13.0827,
        lon: 80.2707,
        areaAcres: 3.5,
        khasraNo: '101/A',
        containsAcademicBuiltUp: true,
        isContiguousToMain: true,
      },
      {
        id: 'PLOT-2',
        name: `Plot 2 (Hostel & Amenities Campus)`,
        lat: 13.091,
        lon: 80.279,
        areaAcres: 1.5,
        khasraNo: '102/B',
        containsAcademicBuiltUp: false,
        isContiguousToMain: false,
      },
    ],
    photos: [
      {
        id: 'PHOTO-01',
        title: '1. VLSI & Embedded Systems Lab',
        facilityType: 'Instructional Specialized Lab (INA)',
        exif: { lat: 13.0828, lon: 80.2708, altitude: '14.2 m', dateTime: '2026-03-19 10:15:00', device: 'Sony FX3', focalLength: '28mm' },
        pHash: '8b2e1a9c4d7f0351',
        dinoCosine: 0.245,
        isDuplicate: false,
        detections: [
          { id: 'DET-101', label: 'Digital Storage Oscilloscope', model: 'RT-DETR-L', confidence: 0.945, bbox: [15, 35, 30, 30], category: 'equipment' },
          { id: 'DET-102', label: 'Logic Analyzer & FPGA Kit', model: 'YOLOv8x', confidence: 0.962, bbox: [50, 40, 35, 28], category: 'equipment' },
        ],
      },
      {
        id: 'PHOTO-02',
        title: '2. Mechanical CAD / CNC Workshop',
        facilityType: 'Instructional Central Workshop (INA)',
        exif: { lat: 13.0829, lon: 80.2709, altitude: '14.0 m', dateTime: '2026-03-19 11:20:00', device: 'Sony FX3', focalLength: '24mm' },
        pHash: '1f4e9b2a7d8c0362',
        dinoCosine: 0.28,
        isDuplicate: false,
        detections: [
          { id: 'DET-201', label: 'CNC Milling Center', model: 'RT-DETR-L', confidence: 0.965, bbox: [20, 25, 40, 55], category: 'equipment' },
          { id: 'DET-202', label: 'Computer Workstation Cluster (x32)', model: 'YOLOv8x', confidence: 0.982, bbox: [65, 35, 28, 45], category: 'equipment' },
        ],
      },
      {
        id: 'PHOTO-03',
        title: '3. Barrier-Free PWD Wheelchair Ramp & Tactile Pathway',
        facilityType: 'Mandatory Accessibility Infrastructure (AMA)',
        exif: { lat: 13.0826, lon: 80.2705, altitude: '14.5 m', dateTime: '2026-03-19 12:45:00', device: 'Sony FX3', focalLength: '24mm' },
        pHash: '3a7b1c9e4d8f0256',
        dinoCosine: 0.19,
        isDuplicate: false,
        detections: [
          { id: 'DET-301', label: 'PWD Ramp Slope 1:12 Gradient', model: 'RT-DETR-L', confidence: 0.925, bbox: [12, 35, 68, 50], category: 'accessibility' },
          { id: 'DET-302', label: 'Tactile Guideway Warning Blocks', model: 'YOLOv8x', confidence: 0.95, bbox: [22, 72, 55, 20], category: 'accessibility' },
        ],
      },
      {
        id: 'PHOTO-04',
        title: '4. Fire Hydrant & Safety Assembly Point',
        facilityType: 'Life Safety & Statutory Compliance',
        exif: { lat: 13.0831, lon: 80.2711, altitude: '13.8 m', dateTime: '2026-03-19 14:10:00', device: 'Sony FX3', focalLength: '24mm' },
        pHash: '6d2a8b1f4c9e0371',
        dinoCosine: 0.215,
        isDuplicate: false,
        detections: [
          { id: 'DET-401', label: 'Pressurized Fire Hydrant Standpipe', model: 'RT-DETR-L', confidence: 0.976, bbox: [22, 30, 24, 48], category: 'safety' },
          { id: 'DET-402', label: 'Assembly Point Signage', model: 'YOLOv8x', confidence: 0.941, bbox: [56, 18, 28, 26], category: 'safety' },
        ],
      },
    ],
  };
}

export default function InfrastructureStudioPage() {
  const { t, language } = useLanguage();
  const { applications, selectedAppId, setSelectedAppId } = useFilters();

  // Active institution selection (synced with global store or local switch)
  const currentAppId = selectedAppId || applications[0]?.id || 'AICTE-2026-NW-0842';
  const selectedApp = applications.find((a) => a.id === currentAppId) || applications[0];

  // Retrieve institution spatial profile
  const spatialProfile = useMemo(() => {
    return (
      INSTITUTION_SPATIAL_PROFILES[selectedApp.id] ||
      getDefaultProfile(selectedApp.id, selectedApp.city, selectedApp.state)
    );
  }, [selectedApp]);

  // Scale calibration state for Blueprint viewer: default 240px = 10.0m -> s = 10.0 / 240 = 0.04167 m/px
  const [scaleFactor, setScaleFactor] = useState<number>(10.0 / 240);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('RM-103');

  // What-If APH 2024–27 Simulator sliders
  const [ugIntake, setUgIntake] = useState<number>(selectedApp.landAndBuiltUp.totalSanctionedStudentsUG ? Math.round(selectedApp.landAndBuiltUp.totalSanctionedStudentsUG / 4) : 360);
  const [ugDuration] = useState<number>(4);
  const [pgIntake, setPgIntake] = useState<number>(selectedApp.landAndBuiltUp.totalSanctionedStudentsPG ? Math.round(selectedApp.landAndBuiltUp.totalSanctionedStudentsPG / 2) : 60);
  const [pgDuration] = useState<number>(2);
  const [fsiNorm, setFsiNorm] = useState<number>(selectedApp.landAndBuiltUp.applicableFsi || 2.0);
  const [labSharingPct, setLabSharingPct] = useState<number>(15);
  const [ghostFacultyDeduction, setGhostFacultyDeduction] = useState<number>(selectedApp.facultyMetrics.ghostFlaggedCount || 2);

  // Exact APH Built-up Area & Land Calculation
  const builtUpResults = calculateBuiltUpNorms(
    ugIntake,
    ugDuration,
    pgIntake,
    pgDuration,
    selectedApp.zoneType,
    fsiNorm,
    labSharingPct / 100
  );

  // Exact APH 1:2:6 Faculty Cadre Calculation
  const facultyResults = calculateFacultyNorms(
    ugIntake,
    ugDuration,
    pgIntake,
    pgDuration,
    selectedApp.facultyMetrics.cadreAvailable,
    ghostFacultyDeduction
  );

  // Multi-Plot Contiguity Validation
  const plotValidation = useMemo(() => {
    return validateMultiPlotContiguity(spatialProfile.plots);
  }, [spatialProfile.plots]);

  // Section 2: Photo CV Overlay controls
  const [activePhotoId, setActivePhotoId] = useState<string>('PHOTO-01');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null);

  // Check if institution has photo duplicates
  const hasDuplicatePhoto = spatialProfile.photos.some((p) => p.isDuplicate);

  // Check if institution has multi-plot distance violation (> 2.0 km)
  const isDistanceViolated = plotValidation.maxDistanceKm > 2.0;

  const handleSelectInstitution = (id: string) => {
    setSelectedAppId(id);
    const target = applications.find((a) => a.id === id);
    if (target) {
      setUgIntake(Math.round(target.landAndBuiltUp.totalSanctionedStudentsUG / 4) || 360);
      setPgIntake(Math.round(target.landAndBuiltUp.totalSanctionedStudentsPG / 2) || 60);
      setFsiNorm(target.landAndBuiltUp.applicableFsi || 2.0);
      setGhostFacultyDeduction(target.facultyMetrics.ghostFlaggedCount || 0);
      toast.info(`Switched Active Infrastructure Studio to ${target.nameEn}`);
    }
  };

  return (
    <div className="space-y-6 animate-glass-in">
      {/* =========================================================================
          TOP INSTITUTION SELECTOR & SPATIAL SUMMARY STRIP
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
              AICTE Spatial Compliance &amp; Computer Vision Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Architectural Blueprint &amp;{' '}
            <span className="title-serif-italic text-sky-700 dark:text-sky-400">
              Campus Telemetry Studio
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            CubiCasa5K Mask2Former CAD vectorizer, RT-DETR-L laboratory asset audit, DINOv2 duplicate detector, and Cadastral GIS Haversine checks
          </p>
        </div>

        {/* Institution Dropdown Selector */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs font-semibold text-[var(--text-muted)] whitespace-nowrap">
            Selected Dossier:
          </label>
          <div className="relative min-w-[280px]">
            <select
              value={currentAppId}
              onChange={(e) => handleSelectInstitution(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-9 py-2 rounded-xl glass-well text-xs font-semibold text-[var(--text-primary)] shadow-2xs cursor-pointer focus:outline-none"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id} • {app.nameEn.substring(0, 28)}... ({app.region})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)]" />
          </div>
        </div>
      </div>

      {/* 4-Cell Liquid Glass Metric Strip with 2px Top Severity Rules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cell 1: Total Built-up Area */}
        <div
          className={`p-4 rounded-[18px] liquid-glass-card flex flex-col justify-between shadow-md ${
            selectedApp.landAndBuiltUp.totalBuiltUpAvailableSqm < selectedApp.landAndBuiltUp.totalBuiltUpRequiredSqm
              ? 'top-rule-deficiency'
              : 'top-rule-verified'
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Total Built-Up Area
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="metric-value">
                {selectedApp.landAndBuiltUp.totalBuiltUpAvailableSqm.toLocaleString()}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                / {selectedApp.landAndBuiltUp.totalBuiltUpRequiredSqm.toLocaleString()} m²
              </span>
            </div>
            <div className="text-xs mt-1 flex items-center justify-between">
              <span className="text-[var(--text-muted)]">INA + ADA + AMA + ACA</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                  selectedApp.landAndBuiltUp.totalBuiltUpAvailableSqm < selectedApp.landAndBuiltUp.totalBuiltUpRequiredSqm
                    ? 'pill-deficiency'
                    : 'pill-verified'
                }`}
              >
                {selectedApp.landAndBuiltUp.totalBuiltUpAvailableSqm >= selectedApp.landAndBuiltUp.totalBuiltUpRequiredSqm
                  ? 'COMPLIANT'
                  : `DEFICIT -${(selectedApp.landAndBuiltUp.totalBuiltUpRequiredSqm - selectedApp.landAndBuiltUp.totalBuiltUpAvailableSqm).toLocaleString()} m²`}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            Carpet: {selectedApp.landAndBuiltUp.inaAvailableSqm + selectedApp.landAndBuiltUp.adaAvailableSqm + selectedApp.landAndBuiltUp.amaAvailableSqm} m² • Circulation: {selectedApp.landAndBuiltUp.acaAvailableSqm} m²
          </div>
        </div>

        {/* Cell 2: FSI & Land Norm */}
        <div
          className={`p-4 rounded-[18px] liquid-glass-card flex flex-col justify-between shadow-md ${
            selectedApp.landAndBuiltUp.landAvailableAcres < selectedApp.landAndBuiltUp.landRequiredAcres
              ? 'top-rule-fatal'
              : 'top-rule-verified'
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Municipal FSI / FAR &amp; Land
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="metric-value">
                {selectedApp.landAndBuiltUp.landAvailableAcres.toFixed(2)}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                / {selectedApp.landAndBuiltUp.landRequiredAcres.toFixed(2)} Acres
              </span>
            </div>
            <div className="text-xs mt-1 flex items-center justify-between">
              <span className="text-[var(--text-muted)]">FSI = {selectedApp.landAndBuiltUp.applicableFsi.toFixed(1)}</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                  selectedApp.landAndBuiltUp.landAvailableAcres < selectedApp.landAndBuiltUp.landRequiredAcres
                    ? 'pill-fatal'
                    : 'pill-verified'
                }`}
              >
                {selectedApp.landAndBuiltUp.landAvailableAcres >= selectedApp.landAndBuiltUp.landRequiredAcres
                  ? 'VERIFIED'
                  : `DEFICIT -${(selectedApp.landAndBuiltUp.landRequiredAcres - selectedApp.landAndBuiltUp.landAvailableAcres).toFixed(2)} Ac`}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            Zone: {selectedApp.zoneType} Floor Mandate
          </div>
        </div>

        {/* Cell 3: CubiCasa5K Wall Continuity */}
        <div className="p-4 rounded-[18px] liquid-glass-card flex flex-col justify-between top-rule-registry shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            CubiCasa5K Wall Continuity
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="metric-value">98.4%</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold">
                AP@50: 0.620
              </span>
            </div>
            <div className="text-xs mt-1 flex items-center justify-between">
              <span className="text-[var(--text-muted)]">RDP Poly Simplify</span>
              <span className="font-semibold text-[var(--text-primary)]">ε = 2.0 px</span>
            </div>
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            Mask2Former Swin-Base + RMBG-1.4
          </div>
        </div>

        {/* Cell 4: Multi-Plot Contiguity & Haversine */}
        <div
          className={`p-4 rounded-[18px] liquid-glass-card flex flex-col justify-between shadow-md ${
            isDistanceViolated ? 'top-rule-fatal' : 'top-rule-verified'
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Multi-Plot Contiguity (Haversine)
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="metric-value">
                {plotValidation.maxDistanceKm.toFixed(2)} km
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                (Plots: {spatialProfile.plots.length} / ≤ 3)
              </span>
            </div>
            <div className="text-xs mt-1 flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Limit: ≤ 2.0 km</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                  isDistanceViolated ? 'pill-fatal' : 'pill-verified'
                }`}
              >
                {isDistanceViolated ? 'VIOLATION' : 'COMPLIANT'}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            APH 2024–27 Chapter I Clause 1.4 Norm
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: INTERACTIVE ARCHITECTURAL BLUEPRINT VECTORIZER & WHAT-IF SIMULATOR
          ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--glass-well-border)] pb-2.5">
          <div>
            <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
              Architectural Vectorization &amp; Deterministic Math
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-0.5">
              Interactive Blueprint Vectorizer &amp; APH Chapter VII What-If Simulator
            </h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full glass-well text-[var(--text-muted)]">
            Shoelace Formula: Area = s² × 0.5 × |∑(x_i y_i+1 - x_i+1 y_i)|
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: BlueprintVectorViewer (7 cols) */}
          <div className="lg:col-span-7 h-[650px] liquid-glass-card rounded-[18px] overflow-hidden shadow-sm">
            <BlueprintVectorViewer
              rooms={selectedApp.blueprintRooms}
              selectedRoomId={selectedRoomId}
              onSelectRoom={(id) => setSelectedRoomId(id)}
              scaleFactor={scaleFactor}
              onScaleChange={(s) => setScaleFactor(s)}
            />
          </div>

          {/* Right: What-If Simulator & CubiCasa5K Telemetry (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Interactive APH Chapter VII Simulator */}
            <div className="liquid-glass-card rounded-[18px] p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2">
                <h3 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5 uppercase font-mono tracking-wider">
                  <Sliders className="w-3.5 h-3.5 text-sky-600" />
                  <span>APH Chapter VII "What-If" FSI / Intake Engine</span>
                </h3>
                <button
                  onClick={() => {
                    setUgIntake(360);
                    setPgIntake(60);
                    setFsiNorm(2.0);
                    setLabSharingPct(15);
                    toast.success('Reset simulator to baseline parameters');
                  }}
                  className="text-[10.5px] font-mono text-sky-600 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 4 Interactive Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {/* UG Sanctioned Intake Slider */}
                <div className="p-2.5 rounded-xl bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)] text-[10.5px]">UG Annual Intake:</span>
                    <span className="font-bold text-sky-700 dark:text-sky-400">{ugIntake} st/yr</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="960"
                    step="60"
                    value={ugIntake}
                    onChange={(e) => setUgIntake(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-[var(--text-faint)]">
                    <span>120</span>
                    <span>Total UG: {ugIntake * ugDuration}</span>
                    <span>960</span>
                  </div>
                </div>

                {/* PG Sanctioned Intake Slider */}
                <div className="p-2.5 rounded-xl bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)] text-[10.5px]">PG Annual Intake:</span>
                    <span className="font-bold text-sky-700 dark:text-sky-400">{pgIntake} st/yr</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="240"
                    step="30"
                    value={pgIntake}
                    onChange={(e) => setPgIntake(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-[var(--text-faint)]">
                    <span>0</span>
                    <span>Total PG: {pgIntake * pgDuration}</span>
                    <span>240</span>
                  </div>
                </div>

                {/* Allied Branch Lab Sharing Slider */}
                <div className="p-2.5 rounded-xl bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)] text-[10.5px]">Lab Sharing Discount:</span>
                    <span className="font-bold text-indigo-700 dark:text-indigo-400">{labSharingPct}% (max 30%)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="5"
                    value={labSharingPct}
                    onChange={(e) => setLabSharingPct(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-[var(--text-faint)]">
                    <span>0% (No share)</span>
                    <span>Saved: {builtUpResults.labDiscountAppliedSqm} m²</span>
                    <span>30%</span>
                  </div>
                </div>

                {/* Municipal FSI / FAR Slider */}
                <div className="p-2.5 rounded-xl bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)] text-[10.5px]">Municipal FSI / FAR:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{fsiNorm.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="4.0"
                    step="0.5"
                    value={fsiNorm}
                    onChange={(e) => setFsiNorm(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-[var(--text-faint)]">
                    <span>1.0 (Strict)</span>
                    <span>Dynamic Land</span>
                    <span>4.0 (Metro)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Mathematical Breakdown Results */}
              <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                <div className="p-1.5">
                  <div className="text-[9.5px] text-[var(--text-muted)]">Total Built-up (TB_req)</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                    {builtUpResults.totalBuiltUpRequiredSqm.toLocaleString()} m²
                  </div>
                </div>
                <div className="p-1.5">
                  <div className="text-[9.5px] text-[var(--text-muted)]">Instructional (INA)</div>
                  <div className="text-sm font-bold text-sky-700 dark:text-sky-400 mt-0.5 tabular-nums">
                    {builtUpResults.inaRequiredSqm.toLocaleString()} m²
                  </div>
                </div>
                <div className="p-1.5">
                  <div className="text-[9.5px] text-[var(--text-muted)]">Circulation (ACA 25%)</div>
                  <div className="text-sm font-bold text-indigo-700 dark:text-indigo-400 mt-0.5 tabular-nums">
                    {builtUpResults.acaRequiredSqm.toLocaleString()} m²
                  </div>
                </div>
                <div className="p-1.5">
                  <div className="text-[9.5px] text-[var(--text-muted)]">Min Land (L_req)</div>
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 tabular-nums">
                    {builtUpResults.landRequiredAcres.toFixed(2)} Ac
                  </div>
                </div>
              </div>

              {/* Faculty Cadre 1:2:6 Formula Breakdown */}
              <div className="p-2.5 rounded-xl bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Faculty 1:2:6 Cadre Requirement (Total: {facultyResults.requiredFacultyTotal})
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Ghost Deduction: -{ghostFacultyDeduction}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-[var(--glass-border)]">
                    <span className="text-slate-400 block">Professors (F/9)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {facultyResults.requiredProfessors}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-[var(--glass-border)]">
                    <span className="text-slate-400 block">Assoc. (2F/9)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {facultyResults.requiredAssociateProfessors}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-[var(--glass-border)]">
                    <span className="text-slate-400 block">Asst. (Remaining)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {facultyResults.requiredAssistantProfessors}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CubiCasa5K Benchmark & Architecture Telemetry Card */}
            <div className="liquid-glass-card rounded-[18px] p-4 sm:p-5 space-y-2.5 text-xs font-mono flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-1.5 mb-2">
                  <h3 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>CubiCasa5K Benchmark &amp; Neural Telemetry</span>
                  </h3>
                  <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold border border-indigo-500/20">
                    PCP-Net SGP Conv
                  </span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)]">
                    <span className="text-[var(--text-muted)]">Polygon Annotations:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      270,465 total (4,228 train / 748 valid)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)]">
                    <span className="text-[var(--text-muted)]">Training Class Imbalance:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      3,667× (106,340 walls vs 29 rare fixtures)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)]">
                    <span className="text-[var(--text-muted)]">Micro-Instances (&lt;1,024 px²):</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      11,948 instances (4,651× validation)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Topological Closure Guarantee:</strong> Mask2Former Swin-Base + RMBG-1.4 Binary Wall Branch with SGP grouped convolution recalibration suppresses class imbalance degradation, guaranteeing gap-free closed manifolds for exact Shoelace integration.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: GEOTAGGED LABORATORY & BARRIER-FREE PWD COMPUTER VISION AUDIT
          (RT-DETR-L + YOLOv8x + pHash / DINOv2 Deduplication)
          ========================================================================= */}
      <section className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--glass-well-border)] pb-2.5">
          <div>
            <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
              Geotagged Physical Facility Audit
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-0.5">
              Geotagged Laboratory &amp; Barrier-Free PWD Computer Vision Audit
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className="btn-liquid-secondary px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {showBoundingBoxes ? <Eye className="w-3.5 h-3.5 text-sky-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              <span>{showBoundingBoxes ? 'Hide CV BBoxes' : 'Show CV BBoxes'}</span>
            </button>
            <span className="text-xs px-2.5 py-1 rounded-full glass-well text-[var(--text-muted)] font-semibold">
              RT-DETR-L + YOLOv8x Ensemble
            </span>
          </div>
        </div>

        {/* Cross-Campus Perceptual Hash & DINOv2 Alert Banner (Specific to Vindhya Valley) */}
        {hasDuplicatePhoto && (
          <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-500/10 dark:bg-red-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
                <span className="font-mono text-xs font-bold text-red-700 dark:text-red-300 uppercase">
                  CROSS-CAMPUS IMAGE REUSE FRAUD DETECTED (256-BIT pHASH &amp; DINOv2 ViT-B/14)
                </span>
              </div>
              <span className="px-2 py-0.2 rounded bg-red-600 text-white font-mono text-[10px] font-bold">
                APH CH-II VIOLATION
              </span>
            </div>
            <p className="text-xs text-red-800 dark:text-red-200 font-mono">
              <strong>Flagged Institution:</strong> {selectedApp.id} ({selectedApp.nameEn}) •{' '}
              <span className="font-bold underline">
                pHash Hamming Distance: 0 bits • DINOv2 Cosine Sim: 0.997 — DUPLICATE LAB PHOTO REUSED FROM MECHANICAL CAD LAB
              </span>
            </p>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">
              Inspection confirmed Photo 01 (submitted as AI &amp; Data Science Lab in 2026) is byte-for-byte perceptual match with Photo 02 (submitted in 2024 for Mechanical Workshop). Zero physical workstations installed.
            </div>
          </div>
        )}

        {/* 4-Card Campus Photo Inspection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {spatialProfile.photos.map((photo) => {
            const isActive = activePhotoId === photo.id;

            return (
              <div
                key={photo.id}
                onClick={() => setActivePhotoId(photo.id)}
                className={`liquid-glass-card rounded-[18px] overflow-hidden flex flex-col justify-between border transition-all cursor-pointer ${
                  photo.isDuplicate
                    ? 'border-red-500/60 ring-1 ring-red-500/30'
                    : isActive
                    ? 'border-sky-500/60 ring-1 ring-sky-500/30'
                    : 'border-[var(--glass-border)]'
                }`}
              >
                {/* Photo Simulation Canvas / SVG Scene */}
                <div className="relative h-44 bg-slate-900 border-b border-[var(--glass-border)] overflow-hidden flex items-center justify-center">
                  {/* Procedural Visual SVG representing the laboratory or facility scene */}
                  <svg className="w-full h-full object-cover opacity-85" viewBox="0 0 320 200">
                    <defs>
                      <linearGradient id={`grad-${photo.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <pattern id={`grid-${photo.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                      </pattern>
                    </defs>

                    {/* Background floor / wall */}
                    <rect width="320" height="200" fill={`url(#grad-${photo.id})`} />
                    <rect width="320" height="200" fill={`url(#grid-${photo.id})`} />

                    {/* Facility Specific Procedural Elements */}
                    {photo.id === 'PHOTO-01' && (
                      <g>
                        {/* Lab Bench */}
                        <rect x="20" y="90" width="280" height="90" rx="4" fill="#334155" stroke="#475569" strokeWidth="1" />
                        {/* Oscilloscope Graphic */}
                        <rect x="35" y="70" width="70" height="50" rx="3" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />
                        <rect x="42" y="75" width="40" height="30" rx="1" fill="#0369a1" opacity="0.4" />
                        <path d="M 45 90 Q 55 78 65 92 T 80 88" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                        {/* FPGA Board */}
                        <rect x="130" y="105" width="90" height="45" rx="2" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                        <circle cx="145" cy="120" r="3" fill="#34d399" />
                        <circle cx="160" cy="120" r="3" fill="#f59e0b" />
                        <circle cx="175" cy="120" r="3" fill="#ef4444" />
                      </g>
                    )}

                    {photo.id === 'PHOTO-02' && (
                      <g>
                        {/* CNC Machine Chassis */}
                        <rect x="30" y="40" width="110" height="130" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                        <rect x="45" y="55" width="80" height="60" rx="2" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1" />
                        <circle cx="85" cy="85" r="14" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                        {/* Workstation Cluster */}
                        <rect x="170" y="70" width="120" height="95" rx="3" fill="#334155" stroke="#475569" strokeWidth="1" />
                        <rect x="185" y="80" width="40" height="28" rx="2" fill="#0284c7" opacity="0.3" stroke="#38bdf8" strokeWidth="1" />
                        <rect x="235" y="80" width="40" height="28" rx="2" fill="#0284c7" opacity="0.3" stroke="#38bdf8" strokeWidth="1" />
                      </g>
                    )}

                    {photo.id === 'PHOTO-03' && (
                      <g>
                        {/* Ramp incline */}
                        <polygon points="40,160 280,70 280,180 40,180" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
                        {/* Yellow tactile tiles */}
                        <polygon points="40,165 280,75 280,95 40,180" fill="#ca8a04" opacity="0.6" stroke="#eab308" strokeWidth="1" />
                        {/* Handrail */}
                        <line x1="40" y1="130" x2="280" y2="40" stroke="#94a3b8" strokeWidth="3" />
                        <line x1="40" y1="145" x2="280" y2="55" stroke="#94a3b8" strokeWidth="2" />
                        <line x1="70" y1="135" x2="70" y2="165" stroke="#64748b" strokeWidth="2" />
                        <line x1="160" y1="100" x2="160" y2="130" stroke="#64748b" strokeWidth="2" />
                        <line x1="250" y1="65" x2="250" y2="95" stroke="#64748b" strokeWidth="2" />
                      </g>
                    )}

                    {photo.id === 'PHOTO-04' && (
                      <g>
                        {/* Standpipe Hydrant */}
                        <rect x="60" y="60" width="24" height="90" rx="3" fill="#b91c1c" stroke="#ef4444" strokeWidth="1.5" />
                        <circle cx="72" cy="55" r="16" fill="#dc2626" stroke="#f87171" strokeWidth="1.5" />
                        <rect x="45" y="85" width="54" height="14" rx="2" fill="#991b1b" />
                        {/* Photoluminescent Sign */}
                        <rect x="170" y="45" width="90" height="60" rx="4" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
                        <circle cx="215" cy="70" r="14" fill="none" stroke="#a7f3d0" strokeWidth="2" />
                        <path d="M 215 62 L 215 78 M 207 70 L 223 70" stroke="#a7f3d0" strokeWidth="2" />
                      </g>
                    )}

                    {/* Neural Detection Overlays (RT-DETR-L / YOLOv8x) */}
                    {showBoundingBoxes &&
                      photo.detections.map((det) => {
                        const [xPct, yPct, wPct, hPct] = det.bbox;
                        const x = (xPct / 100) * 320;
                        const y = (yPct / 100) * 200;
                        const w = (wPct / 100) * 320;
                        const h = (hPct / 100) * 200;
                        const isSelected = selectedDetectionId === det.id;

                        const strokeColor =
                          det.category === 'safety'
                            ? '#ef4444'
                            : det.category === 'accessibility'
                            ? '#10b981'
                            : '#0ea5e9';

                        return (
                          <g
                            key={det.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDetectionId(det.id);
                            }}
                            className="cursor-pointer"
                          >
                            <rect
                              x={x}
                              y={y}
                              width={w}
                              height={h}
                              fill={strokeColor}
                              fillOpacity={isSelected ? 0.25 : 0.12}
                              stroke={strokeColor}
                              strokeWidth={isSelected ? 2.5 : 1.5}
                              strokeDasharray={det.model === 'YOLOv8x' ? '4 2' : undefined}
                            />
                            {/* Label Tag */}
                            <rect
                              x={x}
                              y={Math.max(0, y - 14)}
                              width={Math.min(180, w + 30)}
                              height="14"
                              fill="#0f172a"
                              opacity="0.9"
                            />
                            <text
                              x={x + 3}
                              y={Math.max(10, y - 3)}
                              fill={strokeColor}
                              fontSize="8"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              {det.label.substring(0, 18)}: {det.confidence.toFixed(2)}
                            </text>
                          </g>
                        );
                      })}
                  </svg>

                  {/* Top Overlay Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/85 text-white border border-white/20">
                      {photo.exif.device}
                    </span>
                  </div>

                  {photo.isDuplicate && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-red-600 text-white font-mono text-[9px] font-bold animate-pulse">
                      pHash DUPLICATE
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-3 space-y-2 text-xs">
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)] text-xs line-clamp-1">
                      {photo.title}
                    </h4>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                      {photo.facilityType}
                    </p>
                  </div>

                  {/* EXIF Micro Strip */}
                  <div className="p-2 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] text-[10px] font-mono space-y-0.5">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-faint)]">GPS EXIF:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {photo.exif.lat.toFixed(4)}°N, {photo.exif.lon.toFixed(4)}°E
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-faint)]">Alt &amp; Time:</span>
                      <span className="text-[var(--text-muted)]">
                        {photo.exif.altitude} • {photo.exif.dateTime.split(' ')[1]}
                      </span>
                    </div>
                    <div className="flex justify-between pt-0.5 border-t border-[var(--glass-border)]">
                      <span className="text-[var(--text-faint)]">pHash Hash:</span>
                      <span className="text-sky-700 dark:text-sky-400 font-bold truncate max-w-[120px]">
                        {photo.pHash}
                      </span>
                    </div>
                  </div>

                  {/* Detections List */}
                  <div className="space-y-1">
                    <div className="text-[9.5px] font-mono text-[var(--text-faint)] uppercase flex justify-between">
                      <span>Detected Objects</span>
                      <span>Conf (IoU@0.5)</span>
                    </div>
                    {photo.detections.map((det) => (
                      <div
                        key={det.id}
                        className="flex items-center justify-between text-[10.5px] font-mono py-0.5"
                      >
                        <span className="text-[var(--text-secondary)] truncate max-w-[140px]">
                          • {det.label}
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {det.confidence.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: EXIF GPS METADATA & MULTI-PLOT CADASTRAL HAVERSINE MAP
          ========================================================================= */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--glass-border)] pb-3">
          <div>
            <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              Section 03 / Geographic Triangulation &amp; GIS Audit
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
              EXIF GPS Metadata &amp; Multi-Plot Cadastral Haversine Triangulation
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isDistanceViolated ? 'pill-fatal' : 'pill-verified'
              }`}
            >
              {isDistanceViolated ? 'Inter-Plot Distance Violation' : 'Cadastral Contiguous Verified'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Interactive SVG Cadastral GIS Survey Map (7 cols) */}
          <div className="lg:col-span-7 liquid-glass-card rounded-[18px] p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Cadastral GIS Jamabandi Overlay &amp; Photo GPS Pins</span>
              </h3>
              <span className="text-xs text-[var(--text-muted)]">
                Shapely Point-in-Polygon Check
              </span>
            </div>

            {/* Cadastral SVG Map Scene */}
            <div className="relative h-84 rounded-xl bg-slate-950 overflow-hidden border border-white/10 shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 600 320">
                <defs>
                  <pattern id="gis-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect width="600" height="320" fill="#090d16" />
                <rect width="600" height="320" fill="url(#gis-grid)" />

                {/* Cadastral Khasra Boundary Polygons */}
                {/* Plot 1 Polygon */}
                <polygon
                  points="80,60 260,50 280,200 90,210"
                  fill="rgba(14, 165, 233, 0.18)"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray={isDistanceViolated ? 'none' : '4 2'}
                />
                <text x="95" y="85" fill="#38bdf8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                  PLOT 1: Primary Academic Block
                </text>
                <text x="95" y="102" fill="#94a3b8" fontSize="9.5" fontFamily="sans-serif">
                  Khasra #{spatialProfile.plots[0]?.khasraNo} • {spatialProfile.plots[0]?.areaAcres} Acres
                </text>

                {/* Plot 2 Polygon */}
                {spatialProfile.plots[1] && (
                  <g>
                    {/* Plot 2 is placed much farther to the right if violated */}
                    <polygon
                      points={
                        isDistanceViolated
                          ? '420,110 570,100 580,250 430,260'
                          : '340,90 480,80 490,210 350,220'
                      }
                      fill={isDistanceViolated ? 'rgba(239, 68, 68, 0.18)' : 'rgba(16, 185, 129, 0.18)'}
                      stroke={isDistanceViolated ? '#dc2626' : '#059669'}
                      strokeWidth="2"
                    />
                    <text
                      x={isDistanceViolated ? 435 : 355}
                      y={isDistanceViolated ? 135 : 115}
                      fill={isDistanceViolated ? '#f87171' : '#34d399'}
                      fontSize="11"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                    >
                      PLOT 2: Hostel &amp; Sports
                    </text>
                    <text
                      x={isDistanceViolated ? 435 : 355}
                      y={isDistanceViolated ? 152 : 132}
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontFamily="sans-serif"
                    >
                      Khasra #{spatialProfile.plots[1]?.khasraNo} • {spatialProfile.plots[1]?.areaAcres} Acres
                    </text>

                    {/* Geodesic Haversine Vector connecting Plot 1 and Plot 2 */}
                    <line
                      x1="180"
                      y1="130"
                      x2={isDistanceViolated ? 500 : 410}
                      y2={isDistanceViolated ? 180 : 150}
                      stroke={isDistanceViolated ? '#ef4444' : '#10b981'}
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                    {/* Distance Tag */}
                    <rect
                      x={isDistanceViolated ? 305 : 265}
                      y={isDistanceViolated ? 138 : 123}
                      width="116"
                      height="26"
                      rx="6"
                      fill="#0f172a"
                      stroke={isDistanceViolated ? '#ef4444' : '#10b981'}
                      strokeWidth="1.5"
                    />
                    <text
                      x={isDistanceViolated ? 313 : 273}
                      y={isDistanceViolated ? 155 : 140}
                      fill={isDistanceViolated ? '#f87171' : '#34d399'}
                      fontSize="10.5"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                    >
                      d = {plotValidation.maxDistanceKm.toFixed(2)} km
                    </text>
                  </g>
                )}

                {/* GPS Photo Pins */}
                {/* Photo 1 pin */}
                <g className="cursor-pointer">
                  <circle cx="150" cy="140" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                  <text x="162" y="144" fill="#e2e8f0" fontSize="9.5" fontFamily="sans-serif">
                    Photo 1 (Lab)
                  </text>
                </g>
                {/* Photo 2 pin */}
                <g className="cursor-pointer">
                  <circle cx="200" cy="160" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                  <text x="212" y="164" fill="#e2e8f0" fontSize="9.5" fontFamily="sans-serif">
                    Photo 2 (Workshop)
                  </text>
                </g>
                {/* Photo 3 pin */}
                <g className="cursor-pointer">
                  <circle cx="120" cy="170" r="7" fill="#34d399" stroke="#ffffff" strokeWidth="2" />
                  <text x="132" y="174" fill="#e2e8f0" fontSize="9.5" fontFamily="sans-serif">
                    Photo 3 (PWD Ramp)
                  </text>
                </g>
                {/* Photo 4 pin */}
                <g className="cursor-pointer">
                  <circle cx="230" cy="90" r="7" fill="#f87171" stroke="#ffffff" strokeWidth="2" />
                  <text x="242" y="94" fill="#e2e8f0" fontSize="9.5" fontFamily="sans-serif">
                    Photo 4 (Fire Safety)
                  </text>
                </g>
              </svg>

              {/* In-Map Telemetry Hud */}
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 flex items-center gap-2 shadow-lg">
                <span className="text-slate-400">Centroid:</span>
                <span className="font-mono font-semibold text-sky-400">
                  {spatialProfile.plots[0]?.lat.toFixed(4)}°N, {spatialProfile.plots[0]?.lon.toFixed(4)}°E
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-[11px]">WGS84 Datum</span>
              </div>
            </div>
          </div>

          {/* Right: Multi-Plot Distance Diagnostics & Shapely Verification (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Plot Breakdown Cards */}
            <div className="liquid-glass-card rounded-[18px] p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2.5">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                  Cadastral Plot Schedule (Jamabandi Records)
                </h4>
                <span className="text-xs font-medium text-sky-600 dark:text-sky-400">
                  {spatialProfile.plots.length} Registered Plots
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {spatialProfile.plots.map((plot) => (
                  <div
                    key={plot.id}
                    className="p-3 rounded-xl glass-well flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-[var(--text-primary)] text-xs">
                        {plot.name}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        Khasra #{plot.khasraNo} • {plot.areaAcres} Acres • ({plot.lat.toFixed(4)}°N, {plot.lon.toFixed(4)}°E)
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                        plot.containsAcademicBuiltUp ? 'pill-verified' : 'pill-deficiency'
                      }`}
                    >
                      {plot.containsAcademicBuiltUp ? 'Academic Core' : 'Sports / Annex'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Haversine Math Telemetry */}
              <div
                className={`p-3.5 rounded-xl border space-y-1.5 text-xs ${
                  isDistanceViolated
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Haversine Geodesic Inter-Plot Distance:</span>
                  <span className="metric-value text-sm font-bold">
                    d = {plotValidation.maxDistanceKm.toFixed(2)} km
                  </span>
                </div>
                <div className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
                  {isDistanceViolated ? (
                    <span>
                      <strong className="text-rose-600 dark:text-rose-400">CRITICAL NON-COMPLIANCE:</strong> Plot 2 is {plotValidation.maxDistanceKm.toFixed(2)} km from Plot 1. AICTE APH Chapter VII Clause 1.4 strictly mandates inter-plot separation d ≤ 2.0 km. Discontinuous campus cannot be sanctioned.
                    </span>
                  ) : (
                    <span>
                      <strong className="text-emerald-600 dark:text-emerald-400">COMPLIANT:</strong> Inter-plot separation d = {plotValidation.maxDistanceKm.toFixed(2)} km falls strictly within statutory limit (d ≤ 2.0 km). All core instructional areas verified on Plot 1.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Shapely Point-in-Polygon Results */}
            <div className="liquid-glass-card rounded-[18px] p-4 sm:p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2.5">
                <span className="font-semibold text-[var(--text-primary)] uppercase text-[11px] tracking-wider">
                  Shapely Point-in-Polygon Boundary Verification
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">4 / 4 Validated</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-[var(--glass-border)]">
                  <span className="text-[var(--text-secondary)]">Photo 1 (VLSI Lab EXIF):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    INSIDE Plot 1 Polygon (Δ=0.00m)
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[var(--glass-border)]">
                  <span className="text-[var(--text-secondary)]">Photo 2 (CAD Workshop):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    INSIDE Plot 1 Polygon (Δ=0.00m)
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[var(--glass-border)]">
                  <span className="text-[var(--text-secondary)]">Photo 3 (PWD Ramp EXIF):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    INSIDE Plot 1 Polygon (Δ=0.00m)
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-[var(--text-secondary)]">Photo 4 (Fire Safety EXIF):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    INSIDE Plot 1 Polygon (Δ=0.00m)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
