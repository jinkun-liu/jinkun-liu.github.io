/*
 * Site content. The tree below mirrors the folders in My_Website_Content one-to-one:
 * every node's `folder` is the original folder path, and its `children` are its subfolders.
 * Asset keys (e.g. "Art_Design_Potfolio/Photography/Print-1") point into assets/ and are
 * resolved against window.MANIFEST (generated) for dimensions and page counts.
 */
(function () {
  const PHOTO = 'Art_Design_Potfolio/Photography/';
  const GD = 'Art_Design_Potfolio/Design/Graphic_Design/';
  const UX = 'Art_Design_Potfolio/Design/UI_UX/';
  const GAME = 'Game_Portfolio/';

  const range = (prefix, from, to) => {
    const out = [];
    for (let i = from; i <= to; i++) out.push(prefix + i);
    return out;
  };

  const person = {
    name: 'JinKun Liu',
    role: 'Game developer, designer, and artist.',
    email: 'jinliu36@student.scad.edu',
    location: 'Savannah, GA',
    statement:
      'I work where visual design meets play. Trained in Art Studio and Design at UC Davis, ' +
      'I make books, posters, films, photographs, interfaces and games — and I am now pursuing ' +
      'an MFA in Game Development at the Savannah College of Art and Design.',
    interests: ['Video games', 'Motorsports', 'Basketball', 'Travel'],
  };

  const tree = {
    slug: '',
    title: 'Home',
    children: [
      /* ───────────────────────── Art_Design_Potfolio ───────────────────────── */
      {
        slug: 'art-design',
        folder: 'Art_Design_Potfolio',
        title: 'Art & Design Portfolio',
        short: 'Art & Design',
        tagline: 'Design, painting & drawing, and photography.',
        intro:
          'Four years of studio work from a dual major in Art Studio and Design — organized exactly as it lives on disk: Design, Painting & Drawing, and Photography.',
        cover: GD + 'Book_Design/IMG_4961',
        children: [
          {
            slug: 'design',
            folder: 'Art_Design_Potfolio/Design',
            title: 'Design',
            tagline: 'Graphic design, installation, UI/UX, and film.',
            intro:
              'Identity systems, editorial books, posters, a data installation, app and web interfaces, and a short film.',
            cover: GD + 'Music_Festival_Design/Des116_Project3/p01',
            children: [
              {
                slug: 'graphic-design',
                folder: 'Art_Design_Potfolio/Design/Graphic_Design',
                title: 'Graphic Design',
                tagline: 'Books, a festival identity, posters, and type.',
                intro: 'Editorial design, brand identity, posters, zines and typographic studies.',
                cover: GD + 'Music_Festival_Design/3-posters/p02',
                children: [
                  {
                    slug: 'book-design',
                    folder: 'Art_Design_Potfolio/Design/Graphic_Design/Book_Design',
                    title: 'Book Design',
                    project: 'Infinity',
                    tagline: 'Infinity — an editorial book.',
                    intro:
                      'An editorial book on the idea of infinity: its history, its symbol, the mathematics behind it, and the endless loops we live with — from Formula 1 to immortality. Designed in a two-color red and yellow system, then printed and bound.',
                    cover: GD + 'Book_Design/IMG_4959',
                    facts: [
                      ['Format', 'Printed & bound book, 12 pages'],
                      ['Palette', 'Two-color: red and yellow'],
                      ['Chapters', 'Definition · History · Infinity in F1 · Immortality, Loop, Cycle · In Math'],
                    ],
                    blocks: [
                      { kind: 'flipbook', doc: GD + 'Book_Design/Project-3-Final-Book', title: 'Turn the pages', desc: 'The final book file. Click the page edges, drag the slider, or use the arrow keys.' },
                      { kind: 'gallery', title: 'The printed book', desc: 'Photographed after binding.', items: ['IMG_4959', 'IMG_4960', 'IMG_4961', 'IMG_4962', 'IMG_4963', 'IMG_4965', 'IMG_4967'].map((n) => GD + 'Book_Design/' + n) },
                    ],
                  },
                  {
                    slug: 'music-festival-design',
                    folder: 'Art_Design_Potfolio/Design/Graphic_Design/Music_Festival_Design',
                    title: 'Music Festival Design',
                    project: 'MoonWave',
                    tagline: 'MoonWave — identity for a music festival.',
                    intro:
                      'A complete identity for MoonWave, a music festival “where soul meets rhythm.” The work moves from saxophone-inspired logo sketches to a final mark of light streaks, a brand guideline, a poster system, and merchandise.',
                    cover: GD + 'Music_Festival_Design/Final-Logo/p01',
                    theme: 'dark',
                    facts: [
                      ['Course', 'DES 116'],
                      ['Deliverables', 'Logo · Brand guide · Posters · Merchandise'],
                      ['Event', 'Feb 25 · Long Beach, LA'],
                    ],
                    blocks: [
                      { kind: 'docs', items: [
                        { doc: GD + 'Music_Festival_Design/P1', title: 'Logo exploration', desc: 'Saxophone marks and early MoonWave wordmarks.', file: 'P1.pdf' },
                        { doc: GD + 'Music_Festival_Design/Final-Logo', title: 'Final logo', desc: 'Light streaks crossing the MoonWave wordmark.', file: 'Final Logo.pdf' },
                        { doc: GD + 'Music_Festival_Design/Des116_Project3', title: 'Brand guidelines', desc: 'Logo usage, color palette, typography, imagery and pattern system.', file: 'Des116_Project3.pdf' },
                        { doc: GD + 'Music_Festival_Design/Des116_Project4', title: 'Poster system', desc: 'The microphone poster, adapted across formats.', file: 'Des116_Project4.pdf' },
                        { doc: GD + 'Music_Festival_Design/3-posters', title: 'Final posters', desc: '“Where Soul Meets Rhythm” — the three festival posters.', file: '3 posters.pdf' },
                        { doc: GD + 'Music_Festival_Design/Project5', title: 'Merchandise & packaging', desc: 'Co-branded packaging, apparel and product mockups.', file: 'Project5.pdf' },
                      ] },
                    ],
                  },
                  {
                    slug: 'other',
                    folder: 'Art_Design_Potfolio/Design/Graphic_Design/Other',
                    title: 'Other',
                    tagline: 'Posters, type specimens, a zine, and a handmade book.',
                    intro: 'Individual projects: posters, typographic studies, a zine, an illustrated storyboard and a handmade book.',
                    cover: GD + 'Other/Poster_1/p01',
                    blocks: [
                      { kind: 'posters', title: 'Posters & boards', items: [
                        { doc: GD + 'Other/Poster_1', title: 'The Game Awards 2024', desc: 'Event poster.', file: 'Poster_1.pdf' },
                        { doc: GD + 'Other/PROJ_2_JinKun_to-print', title: 'Times New Roman', desc: 'Type specimen poster.', file: 'PROJ_2_JinKun_to-print.pdf' },
                        { doc: GD + 'Other/Project-1_Final-board', title: 'Letterform board', desc: 'Composition built from cropped letterforms.', file: 'Project 1_Final board.pdf' },
                        { doc: GD + 'Other/ZINE_FINAL', title: 'Zine', desc: 'Surreal photo-collage spread.', file: 'ZINE_FINAL.pdf' },
                      ] },
                      { kind: 'docs', items: [
                        { doc: GD + 'Other/Final-Project-2', title: 'Typographic Explorations', desc: 'Collateral for a Fall 2025 lecture series on type.', file: 'Final Project 2.pdf' },
                        { doc: GD + 'Other/DES-14_FINAL-PROJECT_JinKun-Liu', title: 'DES 14 — Final project', desc: 'A hand-drawn storyboard about ocean plastic and a recycling machine.', file: 'DES 14_FINAL PROJECT_JinKun Liu.pdf' },
                      ] },
                      { kind: 'videos', title: 'DES 15 — Final book', items: [
                        { video: GD + 'Other/DES-15_FINAL-BOOK', title: 'DES 15 — Final book', desc: 'A flip-through of a handmade book.', file: 'DES 15_FINAL BOOK.mp4' },
                      ] },
                    ],
                  },
                ],
              },
              {
                slug: 'large-installation-design',
                folder: 'Art_Design_Potfolio/Design/Large_Installation_Design',
                title: 'Large Installation Design',
                project: 'Visualize Air Pollution',
                tagline: 'Visualize Air Pollution — a 3D data map of California.',
                intro:
                  'Most maps are flat. Ours rises off the wall. Built with ShengJie Sun, this installation turns California air-quality data into a layered relief: the higher a region protrudes, the more polluted its air — with Los Angeles standing tallest. LED lights mark the main cause in each area: red for wildfire, blue for carbon dioxide, green for PM2.5.',
                cover: 'Art_Design_Potfolio/Design/Large_Installation_Design/IMG_4745',
                facts: [
                  ['Team', 'JinKun Liu & ShengJie Sun'],
                  ['Data', 'California air quality, May 14, 2025'],
                  ['Encoding', 'Height = severity · Red = wildfire · Blue = CO₂ · Green = PM2.5'],
                  ['Site', 'Cruess Hall, first floor — UC Davis'],
                ],
                blocks: [
                  { kind: 'gallery', title: 'The model', desc: 'Layered boards cut to the shape of the data.', items: ['IMG_4744', 'IMG_4745', 'IMG_4746'].map((n) => 'Art_Design_Potfolio/Design/Large_Installation_Design/' + n), height: 360 },
                  { kind: 'docs', items: [
                    { doc: 'Art_Design_Potfolio/Design/Large_Installation_Design/Concept-Proposal-and-Drawing_ShengJie-Sun-JinKun-Liu', title: 'Concept proposal & drawing', desc: 'Problem, design rationale, site plan, data table and sketches.', file: 'Concept Proposal and Drawing_ShengJie Sun & JinKun Liu.pdf' },
                  ] },
                ],
              },
              {
                slug: 'ui-ux',
                folder: 'Art_Design_Potfolio/Design/UI_UX',
                title: 'UI/UX',
                tagline: 'A housing-assistance app and a car-parts storefront.',
                intro: 'Interface design for mobile and web: an app that helps renters find homes they can afford, and an e-commerce concept for car parts.',
                cover: UX + 'App_UIUX/P2-Deliverable-6/p02',
                children: [
                  {
                    slug: 'app-uiux',
                    folder: 'Art_Design_Potfolio/Design/UI_UX/App_UIUX',
                    title: 'App UI/UX',
                    project: 'Settle',
                    tagline: 'Settle — find a home within your means.',
                    intro:
                      'Settle is designed for middle- and low-income renters struggling to find affordable housing in expensive areas. It matches apartments to a person’s income, commute and credit — and when rent becomes a burden, it connects them with resources and financial assistance, in a more humane way.',
                    cover: UX + 'App_UIUX/P2-Deliverable-6/p02',
                    facts: [
                      ['Platform', 'iOS app prototype'],
                      ['Process', 'Research · Sketches · Prototype · Usability testing'],
                      ['Key flows', 'Find apartments · Home essentials shop · Financial assistance · Account'],
                    ],
                    blocks: [
                      { kind: 'phones', title: 'The prototype, in motion', desc: 'Screen recordings of the working prototype.', items: [
                        { video: UX + 'App_UIUX/2026-03-12-18.33.11', title: 'Find a home', file: '2026-03-12 18.33.11.mov' },
                        { video: UX + 'App_UIUX/2026-03-12-18.33.38', title: 'Home essentials', file: '2026-03-12 18.33.38.mov' },
                        { video: UX + 'App_UIUX/2026-03-12-18.34.06', title: 'Need help?', file: '2026-03-12 18.34.06.mov' },
                        { video: UX + 'App_UIUX/2026-03-12-18.34.32', title: 'My account', file: '2026-03-12 18.34.32.mov' },
                      ] },
                      { kind: 'docs', items: [
                        { doc: UX + 'App_UIUX/P2-Deliverable-6', title: 'Final prototype & case study', desc: 'Research insights, outcomes, sketches, screens, usability testing and next steps.', file: 'P2 Deliverable #6.pdf' },
                      ] },
                      { kind: 'wide', title: 'Final deliverables', desc: 'Screen flows from the final prototype.', items: ['P2-Final-Deliverable', 'P2-Final-Deliverable-2', 'P2-Final-Deliverable-3', 'P2-Final-Deliverable-4', 'P2-Final-Deliverable-5'].map((n) => UX + 'App_UIUX/' + n) },
                      { kind: 'pdf', src: 'assets/' + UX + 'App_UIUX/P2-Deliverable-5.pdf', title: 'P2 Deliverable #5', desc: 'Full-resolution prototype board, shown in your browser’s PDF viewer.', file: 'P2 Deliverable #5.pdf' },
                    ],
                  },
                ],
                blocks: [
                  { kind: 'scrollshots', title: 'Web UI/UX — Partly', desc: '“Dress your car parts like your clothes.” A storefront concept for car parts with tutorials, recommendations, shop-by-brand and promotions. Hover a page to scroll it.', items: [
                    { img: UX + 'Web_UIUX', title: 'Home page', file: 'Web_UIUX.png' },
                    { img: UX + 'Web_UIUX_2', title: 'Menu & interaction states', file: 'Web_UIUX_2.png' },
                  ] },
                ],
              },
              {
                slug: 'velvet-dream',
                folder: 'Art_Design_Potfolio/Design',
                fileNode: 'Film_Velvet Dream.mp4',
                title: 'Velvet Dream',
                tagline: 'A short film.',
                intro: 'A five-minute short film. Press play, then use the player controls or the keyboard (space, ← →, F for full screen).',
                poster: 'Art_Design_Potfolio/Design/Film_Velvet-Dream',
                theme: 'dark',
                blocks: [{ kind: 'film', video: 'Art_Design_Potfolio/Design/Film_Velvet-Dream', file: 'Film_Velvet Dream.mp4' }],
              },
            ],
            links: [
              { file: "JinKun's Portal Page.url", url: 'https://des117.space/fa2025-mead/ljkliu/', title: 'JinKun’s Portal Page', desc: 'Course portal from DES 117: a blog, an interactive narrative, and CSS exercises — flexbox, grid, variable fonts and animation.' },
            ],
          },
          {
            slug: 'painting-drawing',
            folder: 'Art_Design_Potfolio/Painting_Drawing',
            title: 'Painting & Drawing',
            tagline: 'Still life, landscape, portrait, and collage.',
            intro: 'Studio paintings and drawings — observational still lifes and landscapes, close-up portrait studies, and collage.',
            cover: 'Art_Design_Potfolio/Painting_Drawing/Screenshot-2026-11-02-095537',
            blocks: [
              { kind: 'gallery', height: 420, items: [
                { img: 'Art_Design_Potfolio/Painting_Drawing/Screenshot-2026-11-02-095300', title: 'Tulips in a Glass' },
                { img: 'Art_Design_Potfolio/Painting_Drawing/Screenshot-2026-11-02-095316', title: 'Collage' },
                { img: 'Art_Design_Potfolio/Painting_Drawing/Screenshot-2026-11-02-095331', title: 'Composite Drawing' },
                { img: 'Art_Design_Potfolio/Painting_Drawing/Screenshot-2026-11-02-095448', title: 'Orchard' },
                { img: 'Art_Design_Potfolio/Painting_Drawing/Screenshot-2026-11-02-095520', title: 'Close Portrait' },
                { img: 'Art_Design_Potfolio/Painting_Drawing/Screenshot-2026-11-02-095525', title: 'Leather Jacket' },
                { img: 'Art_Design_Potfolio/Painting_Drawing/Screenshot-2026-11-02-095537', title: 'Bay and Hills' },
                { img: 'Art_Design_Potfolio/Painting_Drawing/Screenshot-2026-11-02-095543', title: 'Figure Abstraction' },
              ] },
            ],
          },
          {
            slug: 'photography',
            folder: 'Art_Design_Potfolio/Photography',
            title: 'Photography',
            tagline: 'Two photobooks, darkroom prints, and digital imaging.',
            intro:
              'From black-and-white darkroom prints, pinholes and cyanotypes to digital imaging and two printed photobooks.',
            cover: PHOTO + 'Photobook_2/IMG_4935',
            children: [
              {
                slug: 'photobook-1',
                folder: 'Art_Design_Potfolio/Photography/Photobook 1',
                title: 'Photobook 1',
                project: 'On the Way',
                tagline: 'On the Way — a photobook.',
                intro: 'A square-format photobook in kraft covers: reading rooms, the McCune Collection, roadside hills, stairwells and doorways, the David Ireland House — and the light inside them.',
                cover: PHOTO + 'Photobook_1/IMG_4899',
                blocks: [
                  { kind: 'flipbook', doc: PHOTO + 'Photobook_1/Photobook2_v2', title: 'Turn the pages', desc: '32 pages, from the print file Photobook2_v2.pdf.' },
                  { kind: 'gallery', title: 'The printed book', items: range(PHOTO + 'Photobook_1/IMG_', 4898, 4919), height: 220 },
                ],
              },
              {
                slug: 'photobook-2',
                folder: 'Art_Design_Potfolio/Photography/Photobook 2',
                title: 'Photobook 2',
                tagline: 'Night photography — a photobook in two parts.',
                intro: 'Long exposures after sunset: light trails, neon marquees, a red telephone box, a tower against the stars, and the quiet storefronts of a small city at night. Bound in black.',
                cover: PHOTO + 'Photobook_2/IMG_4938',
                theme: 'dark',
                blocks: [
                  { kind: 'flipbook', doc: PHOTO + 'Photobook_2/Part-1', title: 'Part 1', desc: '20 pages.' },
                  { kind: 'flipbook', doc: PHOTO + 'Photobook_2/Part-2', title: 'Part 2', desc: '20 pages.' },
                  { kind: 'gallery', title: 'The printed book', items: range(PHOTO + 'Photobook_2/IMG_', 4925, 4949).filter((k) => !k.endsWith('4945')), height: 220 },
                ],
              },
            ],
            blocks: [
              {
                kind: 'gallery',
                title: 'Prints & series',
                desc: 'Every loose photograph in the folder, grouped by process. Filter by series, then open any image.',
                filters: [
                  { id: 'analog', label: 'Black & White Analog', desc: 'Gelatin silver darkroom prints, shown as made and as hung for critique.' },
                  { id: 'alt', label: 'Pinhole, Photogram & Cyanotype', desc: 'Lensless and camera-less processes.' },
                  { id: 'digital', label: 'Digital Imaging', desc: 'Unit assignments and final prints from Digital Imaging.' },
                  { id: 'a5', label: 'Assignment 5', desc: 'Portrait and still-life studies captured in raw.' },
                  { id: '1010', label: 'Series 1010', desc: 'Color studies of fallen trees and driftwood.' },
                ],
                groups: {
                  analog: [...range('Print-', 1, 6), ...range('IMG_', 4663, 4669), ...range('IMG_', 4692, 4702), 'ContactSheet_Unit-5.2', 'PROJECT-1_JinKun'],
                  alt: [...range('Pinhole-', 1, 7), ...range('Photogram-', 1, 5), 'cyanotype-1', 'cyanotype-2'],
                  digital: ['Unit_0.1_0384_JinKun-Liu_JinKun-Liu', 'Unit_0.1_0399_JinKun-Liu_JinKun-Liu', 'Unit_0.1_0406_JinKun-Liu', 'Unit-2.4_0113_edit', 'Unit-2.4_0140_edit', 'Print_Unit-3.1_JinKun-Liu', 'Liu_Unit-4_19-13', 'Unit_4.4_0480_JinKun-Liu_JinKun-Liu', 'Liu_Print_A2', 'print_the-present', 'JinKun-Liu', 'JinKun-Liu_print_2', 'Liu_contact-sheet1', 'IMG_4753', 'IMG_4754', 'IMG_4755'],
                  a5: ['Assignment_5_016', 'Assignment_5_058', 'Assignment_5_097', 'Assignment_5_106', 'Assignment_5_164'],
                  1010: ['1010_0040', '1010_0041', '1010_0043', '1010_0044', '1010_0048', '1010_0055', '1010_0057'],
                },
                prefix: PHOTO,
              },
            ],
          },
        ],
      },

      /* ───────────────────────── Game_Portfolio ───────────────────────── */
      {
        slug: 'games',
        folder: 'Game_Portfolio',
        title: 'Game Portfolio',
        short: 'Games',
        tagline: 'Games built in Unity, Unreal Engine, and for the web.',
        intro: 'Playable prototypes and finished games across Unity and Unreal Engine, plus 3D assets modeled for SCAD’s Game Art Methods.',
        cover: GAME + 'My_Game_Production/ChanllengeGame_UE',
        coverIsVideo: true,
        theme: 'dark',
        children: [
          {
            slug: 'production',
            folder: 'Game_Portfolio/My_Game_Production',
            title: 'My Game Production',
            short: 'Production',
            tagline: 'Six games — Unity, Unreal Engine, and HTML5.',
            intro: 'Gameplay captures from each build. Hover a card to preview it; click to watch with sound. Filter by engine.',
            cover: GAME + 'My_Game_Production/ChanllengeGame_UE',
            coverIsVideo: true,
            theme: 'dark',
            blocks: [
              { kind: 'games', items: [
                { video: GAME + 'My_Game_Production/ChanllengeGame_UE', title: 'Challenge Game', engine: 'Unreal Engine', desc: 'A third-person obstacle run across a bright tropical course.', file: 'ChanllengeGame_UE.mp4' },
                { video: GAME + 'My_Game_Production/3D_Ghost_Game_Unity', title: '3D Ghost Game', engine: 'Unity', desc: 'A 3D exploration game set in a dark, haunted interior.', file: '3D_Ghost_Game_Unity.mp4' },
                { video: GAME + 'My_Game_Production/Zombie_Game_Unity', title: 'Zombies Crash', engine: 'Unity', desc: 'A zombie shooter with weapon switching and achievements.', file: 'Zombie_Game_Unity.mp4' },
                { video: GAME + 'My_Game_Production/FPS_UE', title: 'FPS', engine: 'Unreal Engine', desc: 'A first-person shooter prototype.', file: 'FPS_UE.mp4' },
                { video: GAME + 'My_Game_Production/2D_RPG_Game_Unity', title: '2D RPG Game', engine: 'Unity', desc: 'A top-down 2D role-playing game with a tile-based world.', file: '2D_RPG_Game_Unity.mp4' },
                { itch: 'https://jinkun-liu.itch.io/where-you-live', itchId: '5240214', title: 'Where You Live', engine: 'Web', desc: 'A 3D adventure, published on itch.io and playable in the browser.', file: 'Where You Live by JinKun Liu.url' },
              ] },
            ],
          },
          {
            slug: 'assets',
            folder: 'Game_Portfolio/My_Game_Asset',
            title: 'My Game Asset',
            short: 'Assets',
            tagline: '3D assets for GAME 505 — Game Art Methods.',
            intro: 'Assignment 1 for GAME 505 at SCAD: three environment props, modeled, textured and published to Sketchfab. Load a viewer to orbit each model.',
            theme: 'dark',
            blocks: [
              { kind: 'models', items: [
                { uid: '0602ecfe59664c938ccf1dce3602395f', title: 'MyBillboard2', desc: 'GAME 505 · Assignment 1', file: 'GAME 505_Assignment 1_MyBillboard2 - 3D model by JinKun (@kdfhfjasfhl) [0602ecf].url' },
                { uid: '4482c1c9a10a42d4bd8ce89a08dd4626', title: 'MyBillboard3', desc: 'GAME 505 · Assignment 1', file: 'GAME 505_Assignment1_MyBillboard3 - 3D model by JinKun (@kdfhfjasfhl) [4482c1c].url' },
                { uid: 'ca75974d798d47638e57c04a471b64d8', title: 'Nothing Sign', desc: 'GAME 505 · Assignment 1', file: 'GAME_505_Assignment 1_Nothing Sign - 3D model by JinKun (@kdfhfjasfhl) [ca75974].url' },
              ] },
            ],
          },
        ],
      },

      /* ───────────────────────── Video_Game_Experience ───────────────────────── */
      {
        slug: 'play',
        folder: 'Video_Game_Experience',
        title: 'Video Game Experience',
        short: 'Play History',
        tagline: 'Thousands of hours of research, one game at a time.',
        intro: 'My Steam library, transcribed from the eleven screenshots in this folder. Search it, filter by genre, and sort by hours, completion or recency.',
        cover: 'Video_Game_Experience/Screenshot-2026-11-02-162822',
        theme: 'dark',
        blocks: [{ kind: 'experience' }],
      },

      /* ───────────────────────── UC_Davis_Diploma_Transcript ───────────────────────── */
      {
        slug: 'uc-davis',
        folder: 'UC_Davis_Diploma_Transcript',
        title: 'UC Davis — Diploma & Transcript',
        short: 'UC Davis',
        tagline: 'B.A., dual major in Art Studio and Design. GPA 3.856.',
        intro: 'University of California, Davis — Bachelor of Arts with a dual major in Art Studio and Design, September 2022 to June 2026.',
        cover: 'UC_Davis_Diploma_Transcript/UC_Davis_Diploma',
        blocks: [{ kind: 'ucdavis' }],
      },

      /* ───────────────────────── SCAD_Letter ───────────────────────── */
      {
        slug: 'scad',
        folder: 'SCAD_Letter',
        title: 'SCAD Letter',
        short: 'SCAD',
        tagline: 'MFA, Game Development. $42,000 in scholarships.',
        intro: 'Admission to the Master of Fine Arts in Interactive Design and Game Development (gaming track) at the Savannah College of Art and Design, Fall 2026.',
        cover: 'SCAD_Letter/Letter-2',
        blocks: [{ kind: 'scad' }],
      },

      /* ───────────────────────── Published_Physics_Paper (kept as the last channel) ───────────────────────── */
      {
        slug: 'physics-paper',
        folder: 'Published_Physics_Paper',
        title: 'Published Physics Paper',
        short: 'Physics Paper',
        project: 'Exploration of Exoplanets transiting Red Dwarfs within 50 ly of the Sun',
        tagline: 'Exoplanets around nearby red dwarfs — J. Phys.: Conf. Ser., 2022.',
        intro:
          'Co-authored astrophysics research, published open access by IOP Publishing. The team searched NASA TESS light curves of red dwarfs within 50 light-years of the Sun for the small, repeating dips of transiting planets — and flagged two systems, GJ 257 and GJ 324, as candidates.',
        theme: 'dark',
        blocks: [
          {
            kind: 'paper',
            url: 'https://iopscience.iop.org/article/10.1088/1742-6596/2248/1/012018',
            pdf: 'https://iopscience.iop.org/article/10.1088/1742-6596/2248/1/012018/pdf',
            doi: '10.1088/1742-6596/2248/1/012018',
            file: 'Exploration of Exoplanets transiting Red Dwarfs within 50 ly of the Sun - IOPscience.url',
            authors: ['Xicheng Zhu', 'JinKun Liu', 'Tianlei Jiang', 'Chaohang Wang'],
            me: 1,
            facts: [
              ['Journal', 'Journal of Physics: Conference Series · Volume 2248 · Article 012018 · 2022'],
              ['Publisher', 'IOP Publishing — open access, Creative Commons Attribution 3.0'],
              ['Conference', 'SECMP 2022 — International Conference on Semiconductors, Electromagnetics and Condensed Matter Physics · online, 7–9 January 2022'],
              ['Authors', 'Xicheng Zhu, JinKun Liu (second author), Tianlei Jiang, Chaohang Wang'],
              ['Data', 'NASA TESS light curves (SPOC), analyzed in Python with lightkurve'],
            ],
            stats: [
              ['≈500', 'red dwarfs within 50 light-years screened'],
              ['10', 'stars flagged for a closer look'],
              ['4', 'systems analyzed in depth'],
              ['2', 'candidate planets — GJ 257 and GJ 324'],
            ],
            steps: [
              ['Download', 'Pull each star’s TESS light curve — its brightness over time — from the official SPOC pipeline with the Python package lightkurve.'],
              ['Normalize & bin', 'Divide every point by the median flux, then average neighboring points to raise the signal-to-noise ratio.'],
              ['Find the dips', 'Look for repeated, evenly spaced drops in brightness, and rule out eclipsing binary stars that can mimic them.'],
              ['Derive', 'From each dip’s depth, spacing and length, estimate the planet-to-star radius ratio, period and duration — then the orbital radius and speed with Kepler’s third law.'],
            ],
            formulas: [
              ['δ = (r ⁄ R)²', 'Transit depth gives the planet-to-star radius ratio.'],
              ['P² = 4π² a³ ⁄ GM', 'Kepler’s third law links the period to the orbit and the star’s mass.'],
              ['T ≈ √3 · R P ⁄ 2πa', 'Transit duration, combined with Kepler’s law to estimate the period.'],
            ],
            findings: [
              {
                name: 'GJ 257', alias: 'CD-44 3045',
                text: 'A binary of two similar M3 red dwarfs about 8 parsecs away. A dip appears in the 2021 TESS light curves of both stars, pointing to a planet on a roughly two-year orbit — which of the two stars it crosses is still an open question.',
                data: [['Distance', '8.03 pc'], ['Orbital period', '≈ 724–729 days'], ['Transit duration', '0.3 days'], ['Orbital radius', '≈ 1.10–1.13 AU']],
              },
              {
                name: 'GJ 324', alias: 'ρ¹ Cancri',
                text: 'A K-type star with a faint M4.5 red-dwarf companion, about 12.6 parsecs away. Short, regular dips suggest a fast-orbiting planet — though why each dip looks triangular rather than flat-bottomed remained unexplained.',
                data: [['Distance', '12.59 pc'], ['Orbital period', '≈ 0.74–0.76 days'], ['Transit duration', '0.2 days'], ['Light curve', 'No eclipsing-binary signature']],
              },
            ],
            setAside: [
              ['Planets already published by other teams', ['GJ 51', 'LHS 3844', 'LHS 1140', 'GJ 1132']],
              ['Light curves too complex to interpret', ['LTT 10491', 'GJ 356']],
              ['Transit-like at first, but most likely not', ['LP 731-76', 'LHS 1950']],
            ],
            next: 'Next steps proposed in the paper: follow GJ 257 to learn which star hosts the planet, explain the triangular dips of GJ 324, and take a second look at GJ 356.',
            cite: {
              IOP: 'Zhu X, Liu J, Jiang T and Wang C 2022 Exploration of Exoplanets transiting Red Dwarfs within 50 ly of the Sun J. Phys.: Conf. Ser. 2248 012018',
              APA: 'Zhu, X., Liu, J., Jiang, T., & Wang, C. (2022). Exploration of exoplanets transiting red dwarfs within 50 ly of the Sun. Journal of Physics: Conference Series, 2248(1), 012018. https://doi.org/10.1088/1742-6596/2248/1/012018',
              BibTeX: '@article{Zhu_2022,\n  title     = {Exploration of Exoplanets transiting Red Dwarfs within 50 ly of the Sun},\n  author    = {Zhu, Xicheng and Liu, Jinkun and Jiang, Tianlei and Wang, Chaohang},\n  journal   = {Journal of Physics: Conference Series},\n  volume    = {2248},\n  number    = {1},\n  pages     = {012018},\n  year      = {2022},\n  publisher = {IOP Publishing},\n  doi       = {10.1088/1742-6596/2248/1/012018}\n}',
            },
          },
        ],
      },
    ],
  };

  const education = {
    ucdavis: {
      school: 'University of California, Davis',
      degree: 'Bachelor of Arts',
      major: 'Dual Major in Art Studio and Design',
      dates: 'Sep 2022 – Jun 2026',
      gpa: '3.856',
      courses: ['Calculus I & II', 'Studio Art Practice', 'Intermediate Photography: Digital Imaging', 'Intermediate Painting', 'Introduction to Design', 'Design Drawing', 'Form & Color', 'Graphic Design & Computer Technology', 'Intermediate Photography: Black & White Analog', 'Filmmaking Foundations', 'Data & Large-Scale Installation'],
      deansList: [
        { term: 'Winter 2023', date: 'April 4, 2023', doc: 'UC_Davis_Diploma_Transcript/HonorsLetter_Liu_202301', file: 'HonorsLetter_Liu_202301.pdf' },
        { term: 'Fall 2023', date: 'January 3, 2024', doc: 'UC_Davis_Diploma_Transcript/HonorsLetter_Liu_202310', file: 'HonorsLetter_Liu_202310.pdf' },
        { term: 'Fall 2024', date: 'January 3, 2025', doc: 'UC_Davis_Diploma_Transcript/HonorsLetter_Liu_202410', file: 'HonorsLetter_Liu_202410.pdf' },
        { term: 'Winter 2025', date: 'April 3, 2025', doc: 'UC_Davis_Diploma_Transcript/HonorsLetter_Liu_202501', file: 'HonorsLetter_Liu_202501.pdf' },
      ],
      diploma: 'UC_Davis_Diploma_Transcript/UC_Davis_Diploma',
      transcript: { doc: 'UC_Davis_Diploma_Transcript/TRSQQUPS', file: 'TRSQQUPS.pdf' },
    },
    scad: {
      school: 'Savannah College of Art and Design',
      degree: 'Master of Fine Arts',
      major: 'Interactive Design and Game Development — gaming track',
      dates: 'Sep 2026 – Dec 2028 (expected)',
      courses: ['Game Design', 'Game Art Methods', 'Blueprint in Unreal Engine', 'Environment Art in Unreal Engine'],
      awards: [
        { amount: 15000, name: 'SCAD Honors Award', note: 'Academic Award $10,000 + Achievement Award $5,000', letter: 4 },
        { amount: 3000, name: 'International Student Scholarship', note: 'In addition to prior awards', letter: 3 },
        { amount: 3000, name: 'Student Recognition Scholarship', note: 'Per academic year', letter: 5 },
      ],
      letters: [
        { img: 'SCAD_Letter/Letter-1', title: 'Enrollment summary', date: 'Fall 2026', desc: 'Program, required intensive coursework (GAME 505 Game Art Methods) and scholarship summary.', file: 'Letter 1.png' },
        { img: 'SCAD_Letter/Letter-2', title: 'Letter of acceptance', date: 'May 8, 2026', desc: 'Accepted into the MFA in interactive design and game development.', file: 'Letter 2.jpg' },
        { img: 'SCAD_Letter/Letter-3', title: 'International Student Scholarship', date: 'March 12, 2026', desc: 'US$3,000 per academic year.', file: 'Letter 3.jpg' },
        { img: 'SCAD_Letter/Letter-4', title: 'SCAD Honors Award', date: 'March 12, 2026', desc: 'US$15,000 per academic year.', file: 'Letter 4.jpg' },
        { img: 'SCAD_Letter/Letter-5', title: 'Student Recognition Scholarship', date: 'May 11, 2026', desc: 'US$3,000 per academic year.', file: 'Letter 5.jpg' },
      ],
    },
  };

  const resume = {
    file: 'assets/JinKun_Liu_Resume.docx',
    education: [
      { org: 'Savannah College of Art and Design (SCAD)', place: 'Savannah, GA', dates: 'Sep 2026 – Dec 2028', title: 'Master of Fine Arts in Game Development', note: 'Expected December 2028', lines: ['Core courses: Game Design, Game Art Methods, Blueprint in Unreal Engine, Environment Art in Unreal Engine', 'Honor: $42,000 scholarship for 2 years ($7,000 per quarter)'] },
      { org: 'University of California, Davis', place: 'Davis, CA', dates: 'Sep 2022 – Jun 2026', title: 'Bachelor of Arts, Dual Major in Art Studio and Design', note: 'GPA 3.856 / 4.0', lines: ['Core courses: Calculus I & II, Studio Art Practice, Intermediate Photography: Digital Imaging, Intermediate Painting, Introduction to Design, Design Drawing, Form & Color, Graphic Design & Computer Technology, Intermediate Photography: Black & White Analog, Filmmaking Foundations, Data & Large-Scale Installation', 'Honor: Dean’s List — Winter 2023, Fall 2023, Fall 2024, Winter 2025'] },
    ],
    experience: [
      {
        org: 'SINCETIMES', place: 'Beijing, China', dates: 'Jun 2024 – Aug 2024', title: 'Game Planning Assistant',
        note: 'Project: “Battleship Empire” — Single-Player Arena System Planning',
        groups: [
          { head: 'System function design and detailing', lines: [
            'Independently completed the core rule planning for the “Single-Player Arena System,” including unlock conditions, ranking mechanisms, challenge rules, and the reward system.',
            'Designed dynamic player-ranking logic: enhanced competitive fairness through a “rank-swap upon victory” mechanism and configured NPC bots to populate the initial ranking pool, ensuring a smooth experience on new servers.',
            'Developed an expanded “Revenge Challenge” rule, increasing the number of challengeable opponents from the 8 system-assigned players to a maximum of 16, boosting user activity and engagement.',
          ] },
          { head: 'Cross-system integration and interface interaction design', lines: [
            'Collaborated with the UI and programming teams to design interaction flows for the arena main interface, player info pop-ups (viewing formations, sending messages), and the points-exchange interface.',
            'Integrated data with the Mail, Shop, and Gift Package systems to ensure closed-loop functionality for reward distribution and item exchange.',
          ] },
          { head: 'Configuration tables and numerical framework', lines: [
            'Established rules for arena challenge attempts, linking VIP-tier benefits and item-consumption logic.',
            'Defined the configuration table structure for the “Challenge Tier Coefficient (x),” controlling challenge-difficulty progression through rank segmentation to balance early- and late-game player growth.',
            'Configured incentive content such as ranking rewards and first-time ranking reward packages, clearly defining trigger conditions and redemption rules.',
          ] },
        ],
      },
    ],
    activities: [
      { org: 'Art Education in Rural China Program, Beijing Happy Learning LLC Charities', place: 'Beijing, China', dates: 'Dec 2024 – Jan 2025', title: 'Volunteer', lines: [
        'Assisted with the program logo design, participated in online fundraising and program promotion, and promoted the program among friends and schoolmates.',
        'Helped prepare art-education training materials (for art teachers in rural China) for experts and artists; translated course content quoted from foreign books into Chinese.',
        'Compiled students’ artworks sent by rural art teachers for exhibition at fundraising events.',
        'Participated in planning the Paint Hometown Competition to enhance rural children’s cultural confidence.',
      ] },
      { org: 'Chinese Students and Scholars Association (CSSA), UC Davis', place: 'Davis, CA', dates: 'Oct 2022 – May 2024', title: 'Member, Event Planning Department', lines: [
        'Assisted in promoting CSSA events on YouTube, Little Red Book, Instagram, and WeChat.',
        'Participated in planning campus activities, including Turn Up the Music, Spring Festival Gala, Food Festival, and Cute Pet Show Off.',
        'Supported preliminary preparations for large-scale events: produced PPT slides for online and offline promotion, communicated with sponsors about prizes, and managed and deployed audience groups effectively.',
        'Assisted with event photography and videography for post-event reporting.',
      ] },
    ],
    skills: [
      { head: 'Languages', items: ['Mandarin Chinese (native)', 'English (proficient)'] },
      { head: '3D & Game Engines', items: ['Maya', 'Unreal Engine', 'Unity', 'Substance 3D Painter', 'Substance 3D Sampler'] },
      { head: 'Design', items: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Adobe Bridge'] },
      { head: 'Coding & Productivity', items: ['Processing', 'Visual Studio Code', 'Vibe Coding', 'MS Office'] },
    ],
  };

  /* Steam library, transcribed from Video_Game_Experience/*.png (6 games per screenshot, in order).
     [title, hours, achievements unlocked, achievements total (0 = none tracked), last played (ISO), genre] */
  const steam = [
    ['Counter-Strike 2', 1003, 0, 0, '2022-10-16', 'Shooter'],
    ['Forza Motorsport', 565, 55, 57, '2026-05-30', 'Racing'],
    ['Call of Duty®', 504.3, 41, 74, '2026-05-29', 'Shooter'],
    ['Forza Horizon 5', 437, 137, 164, '2025-04-25', 'Racing'],
    ['Forza Horizon 6', 177.6, 57, 57, '2026-10-29', 'Racing'],
    ['War Thunder', 143.8, 21, 91, '2023-01-15', 'Simulation'],
    ['F1® 24', 129.1, 27, 50, '2025-11-29', 'Racing'],
    ['ELDEN RING', 121.1, 42, 42, '2026-04-16', 'RPG'],
    ['F1® 25', 77.6, 19, 46, '2026-10-18', 'Racing'],
    ['NBA 2K26', 76.7, 6, 48, '2026-10-09', 'Sports'],
    ['Sekiro™: Shadows Die Twice', 74.1, 29, 34, '2025-08-13', 'Action-Adventure'],
    ['Forza Horizon 4', 72.2, 49, 178, '2022-11-13', 'Racing'],
    ['NBA 2K23', 67.7, 12, 50, '2024-09-11', 'Sports'],
    ['ACE COMBAT™ 7: SKIES UNKNOWN', 61, 36, 49, '2024-08-05', 'Simulation'],
    ['Ghost of Tsushima DIRECTOR’S CUT', 58.8, 67, 77, '2026-05-11', 'Action-Adventure'],
    ['NBA 2K25', 51.2, 3, 46, '2025-09-20', 'Sports'],
    ['Resident Evil 4', 49.9, 32, 46, '2026-09-08', 'Horror'],
    ['UNCHARTED™: Legacy of Thieves Collection', 34.8, 69, 101, '2025-09-05', 'Action-Adventure'],
    ['Red Dead Redemption 2', 34.2, 15, 51, '2024-07-19', 'Action-Adventure'],
    ['God of War', 33.9, 32, 37, '2026-04-26', 'Action-Adventure'],
    ['Le Mans Ultimate', 31.2, 29, 44, '2026-11-01', 'Racing'],
    ['Days Gone', 29.1, 23, 67, '2025-08-21', 'Action-Adventure'],
    ['Grand Theft Auto V Legacy', 28.9, 17, 77, '2024-12-11', 'Action-Adventure'],
    ['Assassin’s Creed Odyssey', 28.5, 53, 93, '2024-08-23', 'RPG'],
    ['DEATH STRANDING DIRECTOR’S CUT', 27.5, 40, 63, '2026-04-10', 'Action-Adventure'],
    ['Assassin’s Creed Origins', 27.1, 45, 67, '2024-08-17', 'RPG'],
    ['Mafia III: Definitive Edition', 26.8, 54, 85, '2023-08-20', 'Action-Adventure'],
    ['The Witcher 3: Wild Hunt — Remastered', 22.5, 17, 78, '2024-08-28', 'RPG'],
    ['Cyberpunk 2077', 22.5, 10, 57, '2023-08-27', 'RPG'],
    ['Marvel’s Spider-Man Remastered', 22.1, 40, 78, '2025-09-11', 'Action-Adventure'],
    ['X-Plane 12', 18.2, 0, 0, '2026-07-27', 'Simulation'],
    ['Marvel’s Guardians of the Galaxy', 17.9, 50, 59, '2025-09-13', 'Action-Adventure'],
    ['A Plague Tale: Requiem', 16.5, 23, 35, '2025-08-27', 'Action-Adventure'],
    ['HITMAN™ 2', 14.1, 20, 146, '2023-08-07', 'Action-Adventure'],
    ['STAR WARS Jedi: Fallen Order™', 14, 19, 39, '2023-08-28', 'Action-Adventure'],
    ['Battlefield™ 2042', 12.8, 6, 34, '2025-02-16', 'Shooter'],
    ['Sniper Elite 5', 12.6, 18, 71, '2024-12-29', 'Shooter'],
    ['Detroit: Become Human', 12.6, 25, 48, '2023-07-29', 'Narrative'],
    ['Destiny 2', 12.6, 2, 23, '2020-12-25', 'Shooter'],
    ['A Plague Tale: Innocence', 12.6, 21, 35, '2025-08-23', 'Action-Adventure'],
    ['Beyond: Two Souls', 12.2, 17, 45, '2023-08-01', 'Narrative'],
    ['Metro Exodus Enhanced Edition', 11.5, 19, 68, '2023-08-22', 'Shooter'],
    ['Suicide Squad: Kill the Justice League', 11.5, 14, 50, '2025-08-29', 'Shooter'],
    ['Dead Space', 11.4, 26, 47, '2026-03-16', 'Horror'],
    ['Resident Evil Village', 10.9, 25, 56, '2024-07-30', 'Horror'],
    ['Marvel’s Avengers — The Definitive Edition', 10.3, 23, 50, '2024-07-23', 'Action-Adventure'],
    ['Sniper Ghost Warrior Contracts 2', 10.1, 20, 43, '2023-08-02', 'Shooter'],
    ['Dying Light', 9.5, 17, 78, '2024-08-03', 'Horror'],
    ['Mafia II: Definitive Edition', 9, 28, 67, '2023-08-15', 'Action-Adventure'],
    ['Resident Evil 7 Biohazard', 8.2, 19, 58, '2024-07-28', 'Horror'],
    ['Shadow of the Tomb Raider', 8, 29, 99, '2024-07-26', 'Action-Adventure'],
    ['Rise of the Tomb Raider', 7.6, 21, 143, '2024-07-24', 'Action-Adventure'],
    ['Resident Evil 2', 7.3, 22, 44, '2024-07-21', 'Horror'],
    ['Resident Evil 3', 7, 21, 32, '2024-07-27', 'Horror'],
    ['Mafia: Definitive Edition', 6.7, 26, 43, '2023-08-16', 'Action-Adventure'],
    ['Sniper Elite 4', 6.6, 18, 85, '2022-12-19', 'Shooter'],
    ['Battlefield™ 1', 6.5, 8, 50, '2021-07-27', 'Shooter'],
    ['Titanfall® 2', 6.1, 29, 50, '2023-07-26', 'Shooter'],
    ['Battlefield™ V', 5.9, 3, 21, '2022-08-08', 'Shooter'],
    ['Call of Duty: Infinite Warfare', 5.9, 16, 88, '2023-07-24', 'Shooter'],
    ['STAR WARS™ Battlefront™ II', 5.9, 18, 43, '2023-08-02', 'Shooter'],
    ['STAR WARS™: Squadrons', 5.3, 6, 47, '2023-08-10', 'Simulation'],
    ['X-Plane 11', 5.1, 0, 0, '2023-12-09', 'Simulation'],
    ['Far Cry 5', 2.7, 0, 0, '2024-07-20', 'Shooter'],
    ['Just Cause 3', 2.4, 3, 66, '2021-09-27', 'Action-Adventure'],
    ['Sea of Thieves', 2.2, 7, 293, '2023-09-09', 'Action-Adventure'],
  ].map(([title, hours, got, total, last, genre], i) => ({ title, hours, got, total, last, genre, shot: Math.floor(i / 6) }));

  window.SITE = { person, tree, education, resume, steam };
})();
