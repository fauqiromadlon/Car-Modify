import React from 'react';
import { ModCategory, ModificationOption } from './types';
import { 
  Disc, Lightbulb, Car, Shield, Activity, Zap, Wind, 
  Grid, Eye, Sun, Layers, Circle, ArrowRightLeft, 
  Minus, Square, Wifi, ChevronUp, AlignEndHorizontal,
  ArrowUpFromLine, Cuboid, BoxSelect, Type, Palette,
  Droplet
} from 'lucide-react';

export const MODIFICATION_OPTIONS: ModificationOption[] = [
  // --- CAT & WARNA (PAINT) ---
  {
    id: 'paint-metallic-blue',
    name: 'Metallic Blue',
    category: ModCategory.PAINT,
    promptDescription: 'Repaint the entire car body in a shiny Metallic Blue finish. Keep the reflections realistic.',
    icon: <Droplet className="w-5 h-5 text-blue-500" />
  },
  {
    id: 'paint-pearl-white',
    name: 'Pearl White',
    category: ModCategory.PAINT,
    promptDescription: 'Repaint the car in a luxurious Pearl White finish.',
    icon: <Droplet className="w-5 h-5 text-slate-100" />
  },
  {
    id: 'paint-deep-red',
    name: 'Deep Red',
    category: ModCategory.PAINT,
    promptDescription: 'Repaint the car in a Deep Red Metallic finish.',
    icon: <Droplet className="w-5 h-5 text-red-700" />
  },
  {
    id: 'paint-silver',
    name: 'Metallic Silver',
    category: ModCategory.PAINT,
    promptDescription: 'Repaint the car in a classic Metallic Silver finish.',
    icon: <Droplet className="w-5 h-5 text-slate-400" />
  },
  {
    id: 'paint-khaki',
    name: 'Khaki Green',
    category: ModCategory.PAINT,
    promptDescription: 'Repaint the car in a trendy Khaki Green (flat/pastel) finish.',
    icon: <Droplet className="w-5 h-5 text-green-700" />
  },
  {
    id: 'paint-lime',
    name: 'Lime Green',
    category: ModCategory.PAINT,
    promptDescription: 'Repaint the car in a vibrant Lime Green finish.',
    icon: <Droplet className="w-5 h-5 text-lime-400" />
  },
  {
    id: 'paint-orange',
    name: 'Sunset Orange',
    category: ModCategory.PAINT,
    promptDescription: 'Repaint the car in a bright Sunset Orange finish.',
    icon: <Droplet className="w-5 h-5 text-orange-500" />
  },
  {
    id: 'paint-red',
    name: 'Solid Red',
    category: ModCategory.PAINT,
    promptDescription: 'Repaint the car in a bright sporty Solid Red finish.',
    icon: <Droplet className="w-5 h-5 text-red-500" />
  },
  {
    id: 'paint-matte-black',
    name: 'Matte Black',
    category: ModCategory.PAINT,
    promptDescription: 'Repaint the car in a stealthy Matte Black finish.',
    icon: <Droplet className="w-5 h-5 text-slate-800" />
  },

  // --- BODY KIT & FULL MODS ---
  {
    id: 'body-kit-sport',
    name: 'Full Sport Body Kit',
    category: ModCategory.BODY_KIT,
    promptDescription: 'Install a full sport body kit including aggressive front bumper, side skirts, and rear bumper extension. Sporty and aerodynamic look.',
    icon: <Car className="w-5 h-5" />
  },
  {
    id: 'over-fender',
    name: 'Over Fender / Wide Body',
    category: ModCategory.BODY_KIT,
    promptDescription: 'Add black matte over fenders (fender flares) to the wheel arches for a crossover/SUV look.',
    icon: <BoxSelect className="w-5 h-5" />
  },
  {
    id: 'body-fit-full',
    name: 'Body Fitment (Lowered)',
    category: ModCategory.BODY_KIT,
    promptDescription: 'Lower the car suspension for a "Body Fit" stance, reducing the gap between the tire and the fender. Stance style.',
    icon: <ArrowUpFromLine className="w-5 h-5" />
  },

  // --- ATAP & RAK (ROOF) ---
  {
    id: 'sunroof',
    name: 'Sunroof / Moonroof',
    category: ModCategory.ROOF,
    promptDescription: 'Add a panoramic sunroof to the roof of the car.',
    icon: <Sun className="w-5 h-5" />
  },
  {
    id: 'roof-rail',
    name: 'Roof Rail',
    category: ModCategory.ROOF,
    promptDescription: 'Install silver or black roof rails running longitudinally along the roof.',
    icon: <AlignEndHorizontal className="w-5 h-5" />
  },
  {
    id: 'roof-rack',
    name: 'Roof Rack / Crossbar',
    category: ModCategory.ROOF,
    promptDescription: 'Add a sturdy roof rack crossbar system on top of the car.',
    icon: <Cuboid className="w-5 h-5" />
  },

  // --- BAGIAN DEPAN (FRONT) ---
  {
    id: 'plat-nomor-custom',
    name: 'Custom Nomor Polisi',
    category: ModCategory.FRONT,
    promptDescription: 'Change the license plate text to exactly "[INPUT]". Keep the standard white characters on black background format.',
    icon: <Type className="w-5 h-5" />,
    requiresInput: true
  },
  {
    id: 'grill-black-glossy',
    name: 'Grill Black Glossy',
    category: ModCategory.FRONT,
    promptDescription: 'Change the front radiator grill to a high-gloss piano black finish.',
    icon: <Grid className="w-5 h-5" />
  },
  {
    id: 'grill-custom',
    name: 'Custom Honeycomb Grill',
    category: ModCategory.FRONT,
    promptDescription: 'Change the front grill to a sporty honeycomb mesh design, deleting the chrome for a blacked-out look.',
    icon: <Grid className="w-5 h-5" />
  },
  {
    id: 'front-bumper-lips',
    name: 'Front Lips / Add-on',
    category: ModCategory.FRONT,
    promptDescription: 'Add a sporty front bumper lip spoiler (add-on) in body color or black at the bottom of the front bumper.',
    icon: <Layers className="w-5 h-5" />
  },
  {
    id: 'engine-hood-carbon',
    name: 'Carbon Engine Hood',
    category: ModCategory.FRONT,
    promptDescription: 'Change the engine hood (kap mesin) to a carbon fiber hood with air vents.',
    icon: <Car className="w-5 h-5" />
  },

  // --- BAGIAN SAMPING (SIDE) ---
  {
    id: 'footstep-samping',
    name: 'Footstep Samping',
    category: ModCategory.SIDE,
    promptDescription: 'Install a sturdy side step (footstep) running below the doors.',
    icon: <AlignEndHorizontal className="w-5 h-5" />
  },
  {
    id: 'cover-spion',
    name: 'Cover Spion (Carbon/Chrome)',
    category: ModCategory.SIDE,
    promptDescription: 'Change the side mirror covers to a carbon fiber or chrome finish.',
    icon: <Square className="w-5 h-5" />
  },
  {
    id: 'talang-air',
    name: 'Talang Air (Door Visor)',
    category: ModCategory.SIDE,
    promptDescription: 'Add slim, black aerodynamic door visors (talang air) to the top of the side windows.',
    icon: <Minus className="w-5 h-5" />
  },
  {
    id: 'handle-pintu',
    name: 'Handle Pintu Custom',
    category: ModCategory.SIDE,
    promptDescription: 'Change the door handles to matte black or chrome finish.',
    icon: <Car className="w-5 h-5" />
  },
  {
    id: 'side-skirt',
    name: 'Side Skirt',
    category: ModCategory.SIDE,
    promptDescription: 'Add sporty side skirts extending the lower body line along the wheelbase.',
    icon: <Layers className="w-5 h-5" />
  },
  {
    id: 'list-kaca',
    name: 'Chrome/Black Window Trim',
    category: ModCategory.SIDE,
    promptDescription: 'Change the window trim (list kaca) to chrome or blackout delete style.',
    icon: <Minus className="w-5 h-5" />
  },
  {
    id: 'mud-flap',
    name: 'Mud Flap (Kepet Lumpur)',
    category: ModCategory.SIDE,
    promptDescription: 'Add rally-style mud flaps behind the wheels.',
    icon: <Shield className="w-5 h-5" />
  },

  // --- WHEELS (VELG & BAN) ---
  {
    id: 'velg-enkei-sc46',
    name: 'Enkei Tuning SC46 (R17)',
    category: ModCategory.WHEELS,
    promptDescription: 'Change the wheels to Enkei Tuning SC46 style, multi-spoke design with a dark gunmetal finish, 17-inch size.',
    icon: <Disc className="w-5 h-5" />
  },
  {
    id: 'velg-te37',
    name: 'Volk Rays TE37 (R16/17)',
    category: ModCategory.WHEELS,
    promptDescription: 'Change the wheels to iconic bronze Volk Racing TE37 6-spoke racing wheels, sporty fitment.',
    icon: <Disc className="w-5 h-5" />
  },
  {
    id: 'velg-xl7-alpha',
    name: 'OEM Suzuki XL7 Alpha (R16)',
    category: ModCategory.WHEELS,
    promptDescription: 'Change the wheels to the two-tone black and polished alloy wheels from the Suzuki XL7 Alpha.',
    icon: <Disc className="w-5 h-5" />
  },
  {
    id: 'velg-innova-reborn',
    name: 'OEM Innova Reborn (R16)',
    category: ModCategory.WHEELS,
    promptDescription: 'Change the wheels to the silver multi-spoke alloy wheels stock from a Toyota Innova Reborn.',
    icon: <Disc className="w-5 h-5" />
  },
  {
    id: 'velg-hsr-myth01',
    name: 'HSR Myth01 (R17)',
    category: ModCategory.WHEELS,
    promptDescription: 'Change the wheels to HSR Myth01 racing style wheels, aggressive look.',
    icon: <Disc className="w-5 h-5" />
  },
  {
    id: 'velg-bbs-lm',
    name: 'BBS LM (R17)',
    category: ModCategory.WHEELS,
    promptDescription: 'Change the wheels to classic BBS LM mesh style silver wheels with a polished stepped lip.',
    icon: <Disc className="w-5 h-5" />
  },
  {
    id: 'velg-enkei-rpf1',
    name: 'Enkei RPF1 (R16/17)',
    category: ModCategory.WHEELS,
    promptDescription: 'Change the wheels to lightweight silver Enkei RPF1 twin-spoke racing wheels.',
    icon: <Disc className="w-5 h-5" />
  },
  {
    id: 'velg-civic-turbo',
    name: 'OEM Civic Turbo (R17)',
    category: ModCategory.WHEELS,
    promptDescription: 'Change the wheels to the sporty two-tone blade style alloy wheels from a Honda Civic Turbo.',
    icon: <Disc className="w-5 h-5" />
  },
  {
    id: 'velg-work-meister',
    name: 'Work Meister S1 (R16/17)',
    category: ModCategory.WHEELS,
    promptDescription: 'Change the wheels to Work Meister S1 with a deep dish polished lip and white or black 5-spoke center.',
    icon: <Disc className="w-5 h-5" />
  },
  {
    id: 'velg-rotiform-lasr',
    name: 'Rotiform LAS-R (R17)',
    category: ModCategory.WHEELS,
    promptDescription: 'Change the wheels to Rotiform LAS-R white rally-inspired multi-spoke aerodisc style wheels.',
    icon: <Disc className="w-5 h-5" />
  },
  {
    id: 'ban-semi-slick',
    name: 'Ban Sport / Semi Slick',
    category: ModCategory.WHEELS,
    promptDescription: 'Change the tires to high-performance semi-slick tires with tire lettering.',
    icon: <Circle className="w-5 h-5" />
  },

  // --- LAMPU & SIGN (LIGHTS) ---
  {
    id: 'headlamp-custom',
    name: 'Custom Headlamp',
    category: ModCategory.LIGHTS,
    promptDescription: 'Modify the headlamps to have black housing, projector lenses, and LED DRL strips.',
    icon: <Eye className="w-5 h-5" />
  },
  {
    id: 'foglamp-led',
    name: 'LED Foglamp',
    category: ModCategory.LIGHTS,
    promptDescription: 'Change the fog lamps to bright yellow or white LED projector fog lights.',
    icon: <Sun className="w-5 h-5" />
  },
  {
    id: 'lampu-sein-spion',
    name: 'Sequential Mirror Signal',
    category: ModCategory.LIGHTS,
    promptDescription: 'Upgrade the side mirror turn signals to dynamic sequential LED running lights.',
    icon: <ArrowRightLeft className="w-5 h-5" />
  },
  {
    id: 'stoplamp-led',
    name: 'Custom LED Stoplamp',
    category: ModCategory.LIGHTS,
    promptDescription: 'Change the rear tail lights (stop lamp) to a full LED light bar custom design, smoked lens.',
    icon: <Activity className="w-5 h-5" />
  },

  // --- BAGIAN BELAKANG (REAR) ---
  {
    id: 'antena-shark-fin',
    name: 'Antena Shark Fin',
    category: ModCategory.REAR,
    promptDescription: 'Replace the standard antenna with a body-colored shark fin antenna on the rear roof.',
    icon: <Wifi className="w-5 h-5" />
  },
  {
    id: 'spoiler-roof',
    name: 'Roof Spoiler',
    category: ModCategory.REAR,
    promptDescription: 'Add a sporty rear roof spoiler at the top of the tailgate.',
    icon: <ChevronUp className="w-5 h-5" />
  },
  {
    id: 'garnish-bagasi',
    name: 'Rear Trunk Garnish',
    category: ModCategory.REAR,
    promptDescription: 'Add a chrome or red LED garnish strip connecting the tail lights across the trunk.',
    icon: <Minus className="w-5 h-5" />
  },
  {
    id: 'rear-diffuser',
    name: 'Rear Diffuser / Add-on',
    category: ModCategory.REAR,
    promptDescription: 'Install a sporty rear bumper diffuser with vertical fins.',
    icon: <Wind className="w-5 h-5" />
  },
  {
    id: 'muffler-tip',
    name: 'Double Muffler Tip',
    category: ModCategory.REAR,
    promptDescription: 'Add visible chrome double exhaust muffler tips to the rear bumper.',
    icon: <AlignEndHorizontal className="w-5 h-5" />
  },
];