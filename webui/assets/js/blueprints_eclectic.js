(function (window) {
  if (typeof window.registerTuneBloomBlueprint !== "function") {
    window.registerTuneBloomBlueprint = function (node) {
      if (!Array.isArray(window.__TB_BLUEPRINT_QUEUE)) {
        window.__TB_BLUEPRINT_QUEUE = [];
      }
      window.__TB_BLUEPRINT_QUEUE.push(node);
    };
  }

  window.registerTuneBloomBlueprint({
    id: "dnb_liquid_roller",
    title: "Liquid Skyline",
    genre: "Drum and Bass",
    subgenre: "Liquid Drum & Bass / Atmospheric Jungle",
    bpm: 174,
    key: "F minor",
    mood: "Euphoric, driving, rolling, soulful, deep.",
    vocals: "Soulful female soprano with airy dynamic breath, high falsetto sustains, pitch-shifted vocal chops, and subtle ping-pong delay throws.",
    arrangement: "Deep warm 808 Reece sub-bass, fast rolling 174 BPM Amen-derived drum break, Rhodes jazz chord stabs, and shimmering atmospheric vocal pads.",
    blocks: [
      { id: "b_dnb_1", type: "intro", label: "Intro", text: "Rolling through the late night sky\nWatching every single shadow fly\n(Liquid motion...)\n(Take it higher...)\n(Yeah, yeah)" },
      { id: "b_dnb_2", type: "verse", label: "Verse 1", text: "City lights bleeding through the rainy glass\nWatching all the rapid transit shadows pass\nOne hundred seventy-four on the dashboard dial\nHaven't seen your face in a little while\nRolling bassline moving underneath my feet\nSynchronized perfectly to the breakbeat\nFloating on the current of the midnight sound\nLeaving all our worries on the solid ground\nFeel the sub-bass tearing through the open space\nFinding our salvation in this sacred place" },
      { id: "b_dnb_3", type: "pre-chorus", label: "Build-Up 1", text: "Climbing through the frequency, higher and higher\nSetting every single dark cloud on fire\nThree, two, one, let the bassline roll!\n(Let it roll!)\n(Higher!)" },
      { id: "b_dnb_4", type: "chorus", label: "Drop 1", text: "Rolling through the skyline!\n(Yeah! Feel the roll!)\n(Liquid motion in the soul!)\n(Take it higher!)\n(Yeah, yeah, yeah!)" },
      { id: "b_dnb_5", type: "verse", label: "Verse 2", text: "Lush chord progression walking up the scale\nOur connection is a ship that'll never fail\nEchoes in the headphones ringing crystal clear\nNothing in this universe that we can fear\nFast drums rolling like the ocean wave\nThis is the dynamic energy we crave\nGlide through the turn with your hand in mine\nCrossing every single boundary and line" },
      { id: "b_dnb_6", type: "pre-chorus", label: "Build-Up 2", text: "Climbing through the frequency, higher and higher\nSetting every single dark cloud on fire\nThree, two, one, let the bassline roll!\n(Roll it out!)" },
      { id: "b_dnb_7", type: "chorus", label: "Drop 2", text: "Rolling through the skyline!\n(Yeah! Feel the roll!)\n(Deep bass resonance!)\n(Take it higher!)\n(Let it roll!)" },
      { id: "b_dnb_8", type: "breakdown", label: "Breakdown", text: "When the drums cut out and the air is still\nFeel the space that our love can fill\nSuspended in the clouds at the break of dawn\nAll the pain from the past is gone\n(Floating in the atmosphere...)" },
      { id: "b_dnb_9", type: "solo", label: "Solo", text: "(Soar!)\n(Take it all the way!)\n(Yeah!)\n(Higher!)" },
      { id: "b_dnb_10", type: "chorus", label: "Drop 3", text: "Rolling through the skyline!\n(Yeah! Maximum energy!)\n(Liquid roller in the night!)\n(Take it to the dawn!)\n(Yeah!)" },
      { id: "b_dnb_11", type: "outro", label: "Outro", text: "Liquid skyline...\nFading out on the break...\nTuneBloom Drum & Bass Master\n(Rolling... gone)" }
    ],
    instrumental_blocks: [
      { id: "ib_dnb_1", type: "intro", label: "Intro", text: "(Lush Fender Rhodes jazz voicings float over washed vocal pads and delicate filtered vinyl rain textures)" },
      { id: "ib_dnb_2", type: "verse", label: "Verse 1", text: "(Subtle 174 BPM rolling hi-hat shuffle enters alongside a warm sub-bass pulse and muted guitar plucks)" },
      { id: "ib_dnb_3", type: "pre-chorus", label: "Build-Up 1", text: "(Snare build accelerates with rising white noise risers, high-pass filtered Rhodes sweeps, and vocal chops)" },
      { id: "ib_dnb_4", type: "chorus", label: "Drop 1", text: "(Full liquid roller drop with tearing Reese sub-bass, crisp Amen-derived breakbeat, and shimmering Rhodes chords)" },
      { id: "ib_dnb_5", type: "verse", label: "Verse 2", text: "(Percussion maintains rapid rolling break while an expressive upright acoustic bass countermelody glides underneath)" },
      { id: "ib_dnb_6", type: "pre-chorus", label: "Build-Up 2", text: "(Ascending brass stabs and intense snare roll crescendo build atmospheric velocity toward the second drop)" },
      { id: "ib_dnb_7", type: "chorus", label: "Drop 2", text: "(Massive liquid drop featuring modulated Reese bass growls, intricate ride cymbal patterns, and stereo string swells)" },
      { id: "ib_dnb_8", type: "breakdown", label: "Breakdown", text: "(Drums cut abruptly, leaving solitary reverbed electric piano chords and airy synthesizer pads floating in weightless space)" },
      { id: "ib_dnb_9", type: "solo", label: "Solo", text: "(Expressive soprano saxophone solos with fluid jazz runs, vibrato sustains, and cavernous hall delay)" },
      { id: "ib_dnb_10", type: "chorus", label: "Drop 3", text: "(Final high-velocity climax combining the saxophone solo with full tearing Reese bass and driving breakbeats)" },
      { id: "ib_dnb_11", type: "outro", label: "Outro", text: "(Breakbeat gradually filters into low-pass darkness, leaving lone Rhodes chords and decaying reverb tails to fade out)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "synth_neon_overdrive",
    title: "Neon Overdrive",
    genre: "Synthwave",
    subgenre: "Darksynth / Cyberpunk Electro",
    bpm: 128,
    key: "D minor",
    mood: "Relentless, cinematic, electric, dark, adrenaline-fueled.",
    vocals: "Distorted vocoder robotic intro, soaring anthemic baritone lead with wide stereo chorus, tape delay slapback, and raw chest belts.",
    arrangement: "Pumping sidechain bassline, Oberheim 8-voice brass stabs, gated LinnDrum snare, arpeggiated analog lead, driving 16th hi-hats, and neon guitar leads.",
    blocks: [
      { id: "b_syn_1", type: "intro", label: "Intro", text: "Grid status: Overclocked\nIgnition sequence engaged\nFull voltage across all circuits\n(Engage! Overdrive!)" },
      { id: "b_syn_2", type: "verse", label: "Verse 1", text: "Chromium skyline bleeding in the rain\nZero-latency adrenaline through every vein\nSpeedometer redlining past the perimeter line\nRunning through the shadows at the edge of time\nSynthetic reflections in the wet asphalt\nSystem overload, this is nobody's fault\nChasing the ghost through the fiber-optic grid\nUnlocking the secrets that the mainframe hid\nTurbines screaming at maximum thrust\nLeaving the wreckage and turning to dust" },
      { id: "b_syn_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Sensors ignite, engines awake\nToo much momentum for the system to break\nTarget acquired, locking the sight\nWe burn across the cybernetic night\nVoltage climbing past the critical peak\nFinding the power that we came here to seek\n(Overdrive!)" },
      { id: "b_syn_4", type: "chorus", label: "Chorus 1", text: "Push it into neon overdrive\nOnly the electric are gonna survive\nShatter the barrier, tear up the street\nLocked to the pulse of the digital beat\nFaster than light through the chrome corridor\nLeaving the past on the burning floor\n(Yeah! Neon overdrive!)" },
      { id: "b_syn_5", type: "verse", label: "Verse 2", text: "Signal reflections in the visor glow\nHigh-voltage rhythm moving down below\nNo looking back when the sirens rise\nChasing the horizon under synthetic skies\nLaser beams cutting through the heavy mist\nNames written down on the target list\nDigital pulse in the palm of my hand\nRuling the core of this silicon land" },
      { id: "b_syn_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Sensors ignite, engines awake\nToo much momentum for the system to break\nTarget acquired, locking the sight\nWe burn across the cybernetic night\nVoltage climbing past the critical peak\nFinding the power that we came here to seek" },
      { id: "b_syn_7", type: "chorus", label: "Chorus 2", text: "Push it into neon overdrive\nOnly the electric are gonna survive\nShatter the barrier, tear up the street\nLocked to the pulse of the digital beat" },
      { id: "b_syn_8", type: "breakdown", label: "Bridge", text: "Overload the circuit, let the voltage peak\nFinding the transcendence that we came to seek\nFrequency rising, tearing through the noise\nListen to the thunder of the engine voice\nNo speed limit in the matrix core\nShatter the ceiling, break down the door\n(Redline!)" },
      { id: "b_syn_9", type: "solo", label: "Solo", text: "(Overdrive!)\n(Redline!)\n(Hold on!)\n(Speed!)" },
      { id: "b_syn_10", type: "chorus", label: "Chorus 3", text: "Push it into neon overdrive\nOnly the electric are gonna survive\nShatter the barrier, tear up the street\nLocked to the pulse of the digital beat\nFaster than light through the chrome corridor\nLeaving the past on the burning floor" },
      { id: "b_syn_11", type: "outro", label: "Outro", text: "System cooling down...\nDecelerating from orbit...\nPulse... fading... static\nMission complete\n(Power down)" }
    ],
    instrumental_blocks: [
      { id: "ib_syn_1", type: "intro", label: "Intro", text: "(Hypnotic 16th-note analog bass arpeggiator emerges with slow resonant low-pass filter opening and distant laser fx)" },
      { id: "ib_syn_2", type: "verse", label: "Verse 1", text: "(Driving four-on-the-floor kick drops in with pumping sidechain compression, gated 80s snare, and bright Oberheim brass stabs)" },
      { id: "ib_syn_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Soaring synthesizer lead begins an ascending chromatic run as pitched risers and tom-drum rolls build dynamic force)" },
      { id: "ib_syn_4", type: "chorus", label: "Chorus 1", text: "(Massive cyberpunk drop featuring heavy sawtooth bassline, soaring dual-lead synths in octaves, and explosive gated reverb snares)" },
      { id: "ib_syn_5", type: "verse", label: "Verse 2", text: "(Rhythm pulses with relentless energy while a clean chorus electric guitar plays syncopated arpeggiated riffs)" },
      { id: "ib_syn_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Aggressive detuned supersaw chords swell with heavy distortion and white noise sweeps into the drop)" },
      { id: "ib_syn_7", type: "chorus", label: "Chorus 2", text: "(High-octane synthwave drop with wide stereo leads, pounding bassline, and punchy acoustic-electronic hybrid percussion)" },
      { id: "ib_syn_8", type: "breakdown", label: "Bridge", text: "(Atmospheric breakdown stripping drums away to reveal lush cinematic synth pads, ticking clock arpeggio, and deep bass drones)" },
      { id: "ib_syn_9", type: "solo", label: "Solo", text: "(Virtuosic screaming 80s electric guitar solo with heavy whammy vibrato, sweeping arpeggios, and tape echo)" },
      { id: "ib_syn_10", type: "chorus", label: "Chorus 3", text: "(Climactic final drop combining soaring lead guitar and dual supersaws over maximum driving bassline momentum)" },
      { id: "ib_syn_11", type: "outro", label: "Outro", text: "(Synthesizers slowly filter down to a solitary pulsing analog bassline that powers off into silence)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "neosoul_golden_hour",
    title: "Golden Hour Bloom",
    genre: "Neo-Soul",
    subgenre: "Organic Lo-Fi R&B / Jazzy Pocket",
    bpm: 84,
    key: "Eb major",
    mood: "Warm, reflective, nostalgic, intimate, cozy.",
    vocals: "Breathy female alto with rich chest resonance, unhurried conversational phrasing, layered gospel choir harmonies, and natural dynamic expression.",
    arrangement: "Damped upright piano, unquantized live rimshot groove, upright bass with finger-noise detail, lush Rhodes tremolo, and brushed cymbals.",
    blocks: [
      { id: "b_neo_1", type: "intro", label: "Intro", text: "Mmm-mmm, yeah\nRight where we need to be\nTake a deep breath, let the world slow down\n(Right here with you)\n(Mmm...)" },
      { id: "b_neo_2", type: "verse", label: "Verse 1", text: "Sunlight spilling on the hardwood floor\nCoffee steaming by the open door\nTime moves slower when you're in the room\nEvery little silence begins to bloom\nRecord spinning on the vintage deck\nGentle morning kiss upon my neck\nNo hurry for the hours to unfold\nWatching how the morning turns to gold\nYour fingers tracing lines across my palm\nSurrounded by this sweet and steady calm" },
      { id: "b_neo_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "No rush against the ticking hand\nDrifting like golden desert sand\nYou smile and tilt your head away\nNothing else matters in the day\nHarmonies breathing through the air\nWithout a single worry or a care\n(Yeah, no worries at all)" },
      { id: "b_neo_4", type: "chorus", label: "Chorus 1", text: "Caught in the golden hour light\nEverything feels easy and right\nLet the world keep rushing on by\nWe've got the sun and the morning sky\nWrapped inside this gentle melodic stream\nLiving inside a waking dream\n(Mmm, golden hour light)\n(Right here with you)" },
      { id: "b_neo_5", type: "verse", label: "Verse 2", text: "Unfinished melodies written on a page\nStepping off the rush of the modern stage\nJust your fingers tapping out a simple chord\nRichest peace that we could afford\nHumming sweet counterpoint along with me\nPure natural acoustic harmony\nOutside the traffic crawls along the street\nInside we're floating to our own heart beat" },
      { id: "b_neo_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "No rush against the ticking hand\nDrifting like golden desert sand\nYou smile and tilt your head away\nNothing else matters in the day\nHarmonies breathing through the air\nWithout a single worry or a care" },
      { id: "b_neo_7", type: "chorus", label: "Chorus 2", text: "Caught in the golden hour light\nEverything feels easy and right\nLet the world keep rushing on by\nWe've got the sun and the morning sky" },
      { id: "b_neo_8", type: "breakdown", label: "Bridge", text: "No hurry, no race to win\nJust breathing the morning in\nHarmonies settling in the air\nWithout a single heavy care\nLet the sweet melody carry us away\nTo the promise of a brand new day\n(Stay right here)" },
      { id: "b_neo_9", type: "solo", label: "Solo", text: "(Mmm... yeah)\n(Golden hour sweetness)\n(Breathe in)\n(Pure love)" },
      { id: "b_neo_10", type: "chorus", label: "Chorus 3", text: "Caught in the golden hour light\nEverything feels easy and right\nLet the world keep rushing on by\nWe've got the sun and the morning sky\nWrapped inside this gentle melodic stream\nLiving inside a waking dream" },
      { id: "b_neo_11", type: "outro", label: "Outro", text: "Stay right here...\nGolden hour...\nJust you and me\n(Mmm... yeah)\n(Fade slow)" }
    ],
    instrumental_blocks: [
      { id: "ib_neo_1", type: "intro", label: "Intro", text: "(Soft, felt-damped upright piano chords play gentle extended jazz chords alongside warm vinyl needle noise)" },
      { id: "ib_neo_2", type: "verse", label: "Verse 1", text: "(Unquantized Dilla-swung rimshot groove drops in with warm upright double bass and delicate brushed ride cymbal)" },
      { id: "ib_neo_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Lush Fender Rhodes stereo tremolo enters, weaving harmonic counter-melodies around gentle bass walking notes)" },
      { id: "ib_neo_4", type: "chorus", label: "Chorus 1", text: "(Full warm neo-soul pocket with deep round bass tone, expressive piano voicings, and soft flugelhorn accents)" },
      { id: "ib_neo_5", type: "verse", label: "Verse 2", text: "(Arrangement relaxes into deep groove with muted hollowbody jazz guitar comping gently on the 2 and 4)" },
      { id: "ib_neo_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Subtle string quartet swells and acoustic upright bass grace notes build warm, comforting emotional tension)" },
      { id: "ib_neo_7", type: "chorus", label: "Chorus 2", text: "(Rich acoustic bloom featuring layered piano and Rhodes chords, singing flugelhorn melody, and lazy swung percussion)" },
      { id: "ib_neo_8", type: "breakdown", label: "Bridge", text: "(Intimate breakdown stripping to solo upright piano and double bass with audible finger noise on the strings)" },
      { id: "ib_neo_9", type: "solo", label: "Solo", text: "(Warm hollowbody jazz guitar delivers an expressive melodic solo with legato slides, double stops, and subtle vibrato)" },
      { id: "ib_neo_10", type: "chorus", label: "Chorus 3", text: "(Final golden-hour swell with guitar, piano, and flugelhorn interlocking in lush three-part counterpoint over the beat)" },
      { id: "ib_neo_11", type: "outro", label: "Outro", text: "(Drums ease away, leaving solitary damp piano chords and gentle vinyl static fading out to warmth)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "dreampop_coastal_drift",
    title: "Coastal Drift",
    genre: "Indie Dream Pop",
    subgenre: "Shoegaze / Jangle Pop",
    bpm: 112,
    key: "A major",
    mood: "Ethereal, breezy, bittersweet, expansive, melancholic.",
    vocals: "Airy, reverb-drenched dual male and female vocal harmonies, breathy delivery floating behind shimmering chorus guitars with long sustains.",
    arrangement: "Rickenbacker jangle guitars with stereo chorus, driving melodic bassline, punchy 80s snare with hall reverb, Prophet-5 synth pads, and ocean breeze textures.",
    blocks: [
      { id: "b_pop_1", type: "intro", label: "Intro", text: "(Drifting out on the open tide...)\n(Far away from where we started...)\n(Shimmering waves in the afternoon light...)\n(Yeah...)" },
      { id: "b_pop_2", type: "verse", label: "Verse 1", text: "Salt air drifting through the open car\nWondering if we traveled far\nWater gleaming in the afternoon haze\nLost in the rhythm of the summer days\nHighway ribbon winding down the coast\nThinking of the things that we loved the most\nSea spray misting on the windshield glass\nWatching every single shadow pass\nFender reverb ringing in our ears\nWashing away all of our old fears" },
      { id: "b_pop_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Past the dunes where the grasses sway\nWatching the daylight slip away\nColors bleeding into the tide\nWith the whole wide world on our side\nFeel the current pulling us along\nSinging our forgotten coastal song\n(Out to sea...)" },
      { id: "b_pop_4", type: "chorus", label: "Chorus 1", text: "Wash away into the coastal tide\nNowhere left we need to hide\nFloating on the current out to sea\nJust you and the open horizon with me\nShimmering light on the ocean floor\nNever going back to the crowded shore\n(Drifting... floating...)" },
      { id: "b_pop_5", type: "verse", label: "Verse 2", text: "Footprints washed from the shoreline track\nNo clear reason for looking back\nSun sinking low into shades of rose\nWhere the cool evening current flows\nSeagulls crying in the purple sky\nWatching all the clouds go rolling by\nYour hand resting warm inside of mine\nFrozen in this perfect space and time" },
      { id: "b_pop_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Past the dunes where the grasses sway\nWatching the daylight slip away\nColors bleeding into the tide\nWith the whole wide world on our side\nFeel the current pulling us along\nSinging our forgotten coastal song" },
      { id: "b_pop_7", type: "chorus", label: "Chorus 2", text: "Wash away into the coastal tide\nNowhere left we need to hide\nFloating on the current out to sea\nJust you and the open horizon with me" },
      { id: "b_pop_8", type: "breakdown", label: "Bridge", text: "Let the waves crash high above\nEverything we were dreaming of\nCatch the swell before it breaks\nFor all our memories' sakes\nInto the mist where the stars awake\nFor every single promise that we make\n(Into the blue...)" },
      { id: "b_pop_9", type: "solo", label: "Solo", text: "(Ooh...)\n(Lost in the mist...)\n(Floating...)\n(Floating away...)" },
      { id: "b_pop_10", type: "chorus", label: "Chorus 3", text: "Wash away into the coastal tide\nNowhere left we need to hide\nFloating on the current out to sea\nJust you and the open horizon with me\nShimmering light on the ocean floor\nNever going back to the crowded shore" },
      { id: "b_pop_11", type: "outro", label: "Outro", text: "Out to sea...\nJust you and me...\nWaves receding in the dusk...\n(Fade into the mist...)\n(Forever...)" }
    ],
    instrumental_blocks: [
      { id: "ib_pop_1", type: "intro", label: "Intro", text: "(Shimmering 12-string Rickenbacker jangle guitars with deep stereo chorus and tape delay echo over ocean wave ambiance)" },
      { id: "ib_pop_2", type: "verse", label: "Verse 1", text: "(Driving melodic Fender Precision bassline enters alongside punchy 80s kick-snare beat and glistening guitar arpeggios)" },
      { id: "ib_pop_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Prophet-5 analog synthesizer pads swell with warm chorus while guitar layers build dynamic shimmer)" },
      { id: "ib_pop_4", type: "chorus", label: "Chorus 1", text: "(Massive dream pop explosion featuring a wall of washed shoegaze guitars, driving rhythmic bass, and punchy reverb drums)" },
      { id: "ib_pop_5", type: "verse", label: "Verse 2", text: "(Guitars pare back to delicate clean picking while melodic bass and steady tambourine drive the forward motion)" },
      { id: "ib_pop_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Fuzz guitar textures slowly fade in from the background, creating warm harmonic saturation leading into the drop)" },
      { id: "ib_pop_7", type: "chorus", label: "Chorus 2", text: "(Expansive shoegaze swell with cascading chorus guitars, soaring analog synth chords, and heavy crash cymbals)" },
      { id: "ib_pop_8", type: "breakdown", label: "Bridge", text: "(Weightless breakdown stripping down to solitary reverberated 12-string plucks, synth drone, and ambient ocean mist)" },
      { id: "ib_pop_9", type: "solo", label: "Solo", text: "(Soaring, reverb-drenched electric guitar solos with emotive melodic bends, feedback harmonics, and delay sweeps)" },
      { id: "ib_pop_10", type: "chorus", label: "Chorus 3", text: "(Climactic wall of sound with the soaring guitar solo riding over driving drums, jangle rhythm, and synth pads)" },
      { id: "ib_pop_11", type: "outro", label: "Outro", text: "(Guitars dissolve into infinite modulated reverb trails, slowly decaying into coastal wind and tape hiss to silence)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "poppunk_all_my_fault",
    title: "All My Fault",
    genre: "Pop Punk",
    subgenre: "Modern Pop-Punk / Emo Trap Revival",
    bpm: 160,
    key: "E major",
    mood: "Aggressive, angsty, high-energy, infectious, cathartic.",
    vocals: "Gritty, soaring male pop-punk tenor with passionate chest belting, layered double-tracked choruses, and shouted background gang vocals.",
    arrangement: "Driven Marshall guitar power chords, fast driving 160 BPM skate-punk drum kit, melodic bassline, and subtle 808 sub drops.",
    blocks: [
      { id: "b_ppk_1", type: "intro", label: "Intro", text: "Yeah! One, two, three, four!\n(Go!)\n(Here we go again!)" },
      { id: "b_ppk_2", type: "verse", label: "Verse 1", text: "Woke up at noon with my clothes on the floor\nHeadache screaming, heading straight for the door\nLeft my keys and my phone in your car\nGuess we took that argument way too far\nStaring at the ceiling while the room starts to spin\nWondering how the hell I let you under my skin\nEvery little promise that we threw in the trash\nWatching every single bridge we built turn to ash\nSkate down the avenue to clear out my head\nRemembering every bitter word that you said" },
      { id: "b_ppk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Tired of the drama, tired of the blame\nBoth of us addicted to this stupid ass game\nTurn the amp up to ten, let it blast through the wall\nGetting ready for the catastrophic downfall!\n(Yeah! Downfall!)" },
      { id: "b_ppk_4", type: "chorus", label: "Chorus 1", text: "Say it's all my fault, yeah I know that it's true!\nI'm so sick and tired of screaming at you!\nPack up all my shit and throw it out in the street!\nWatch me land right back on my own two feet!\nNever coming back, you can cross out my name!\nI'm done being a pawn in your toxic ass game!\n(All my fault!)\n(Go!)" },
      { id: "b_ppk_5", type: "verse", label: "Verse 2", text: "Saw your best friend, told her tell you goodbye\nI don't have a single tear that's left here to cry\nPlaying fast chords in the garage with the boys\nMaking up for every second lost in the noise\nRipped up jeans and my old pair of Vans\nDoing whatever the fuck that I can\nNo more curfew and no more control\nTaking back the dignity and heart of my soul" },
      { id: "b_ppk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Tired of the drama, tired of the blame\nBoth of us addicted to this stupid ass game\nTurn the amp up to ten, let it blast through the wall\nGetting ready for the catastrophic downfall!" },
      { id: "b_ppk_7", type: "chorus", label: "Chorus 2", text: "Say it's all my fault, yeah I know that it's true!\nI'm so sick and tired of screaming at you!\nPack up all my shit and throw it out in the street!\nWatch me land right back on my own two feet!\nNever coming back, you can cross out my name!\nI'm done being a pawn in your toxic ass game!" },
      { id: "b_ppk_8", type: "breakdown", label: "Bridge", text: "Remember the night that we sat on your roof?\nWe were looking for love, but we needed the proof\nNow the memory is burning away in the dark\nAll it took was a single and dangerous spark\n(Burn it down!)\n(Go!)" },
      { id: "b_ppk_9", type: "solo", label: "Solo", text: "(Yeah!)\n(Rip that guitar!)\n(One more time!)\n(Go! Go! Go!)" },
      { id: "b_ppk_10", type: "chorus", label: "Chorus 3", text: "Say it's all my fault, yeah I know that it's true!\nI'm so sick and tired of screaming at you!\nPack up all my shit and throw it out in the street!\nWatch me land right back on my own two feet!\nNever coming back, you can cross out my name!\nI'm done being a pawn in your toxic ass game!" },
      { id: "b_ppk_11", type: "outro", label: "Outro", text: "Yeah, it's all my fault\nAnd I don't give a fuck\nTuneBloom Pop Punk Master\n(Done!)" }
    ],
    instrumental_blocks: [
      { id: "ib_ppk_1", type: "intro", label: "Intro", text: "(Aggressive distorted guitar riff kicks off with tight staccato accents before full skate-punk drums crash in)" },
      { id: "ib_ppk_2", type: "verse", label: "Verse 1", text: "(Fast palm-muted electric guitars drive the tempo alongside punchy kick-snare beats and galloping bassline)" },
      { id: "ib_ppk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Power chords open up with rising cymbal swells and rapid 16th-note drum fills accelerating toward the chorus)" },
      { id: "ib_ppk_4", type: "chorus", label: "Chorus 1", text: "(Explosive pop-punk drop with roaring Marshall stacks, wide-open crash cymbals, driving melodic bass, and punchy snare)" },
      { id: "ib_ppk_5", type: "verse", label: "Verse 2", text: "(Rhythm locks into half-time bounce with octave guitar leads dancing over tight kick-drum patterns)" },
      { id: "ib_ppk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Fast palm-muted chugging guitars and ascending bass runs build relentless kinetic tension)" },
      { id: "ib_ppk_7", type: "chorus", label: "Chorus 2", text: "(High-energy anthemic drop with wall-of-sound guitar power chords and furious skate-punk drumming)" },
      { id: "ib_ppk_8", type: "breakdown", label: "Bridge", text: "(Subtractive breakdown featuring clean acoustic guitar strumming, isolated bass guitar, and distant floor tom pulse)" },
      { id: "ib_ppk_9", type: "solo", label: "Solo", text: "(Fast, melodic pop-punk lead guitar solo with expressive double stops, rapid alternate picking, and harmonic squeals)" },
      { id: "ib_ppk_10", type: "chorus", label: "Chorus 3", text: "(Climactic final drop with maximum drum energy, crashing cymbals, full guitar wall, and sub-bass impact)" },
      { id: "ib_ppk_11", type: "outro", label: "Outro", text: "(Furious drum fills crash into an abrupt final power chord ringing out with amp feedback to silence)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "metalcore_quantum_break",
    title: "Quantum Break",
    genre: "Metalcore",
    subgenre: "Progressive Djent / Modern Post-Hardcore",
    bpm: 140,
    key: "Drop D",
    mood: "Aggressive, technical, relentless, explosive, triumphant.",
    vocals: "Visceral mid-range screams and guttural lows on verses, soaring anthemic clean chorus with stereo octave doubling and emotional delivery.",
    arrangement: "Down-tuned 8-string polyrhythmic chugs, rapid double-bass drum triggers, atmospheric ambient glitch synths, and sub drops.",
    blocks: [
      { id: "b_met_1", type: "intro", label: "Intro", text: "GO!\nBreak the cycle of the simulation!\nReclaim the frequency!\n(BLEGH!)\n(Break it down!)" },
      { id: "b_met_2", type: "verse", label: "Verse 1", text: "Shattered glass on the concrete floor\nCan't find the truth behind this broken door\nFractured timelines tearing in two\nSearching for the anchor to pull me through\nPressure building inside the core\nWe can't ignore the warning anymore!\nBinary structures collapsing to dust\nIn our own conviction we put our trust\nSever the cables that bind the soul\nTaking back absolute self-control\nScream at the void till the echoes ignite\nBurning clean through the simulated night" },
      { id: "b_met_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Tearing through the veil of reality\nSevering the chains of our gravity\nLook into the fire and take the stand\nEverything we built is in our hands!\nNo more surrender, no more decay\nWash all the compromised visions away!\n(BLEGH!)" },
      { id: "b_met_4", type: "chorus", label: "Chorus 1", text: "Stand in the eye of the quantum storm!\nReinvent the ashes and take new form!\nThrough the darkest void we ignite the spark\nLeave an everlasting light in the dark!\nRising above where the titans fall\nAnswering the final battle call!\n(Ignite the spark!)" },
      { id: "b_met_5", type: "verse", label: "Verse 2", text: "Zero tolerance for the silent decay\nWash all the compromised illusions away\nBinary structures collapse to dust\nIn our own conviction we put our trust\nFeel the recoil, embrace the sound\nNothing can tear our foundation down!\nPolyrhythmic fury inside the chest\nPutting our mortal fear to rest\nLook at the horizon beginning to bleed\nThis is the decisive hour we need!" },
      { id: "b_met_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Tearing through the veil of reality\nSevering the chains of our gravity\nLook into the fire and take the stand\nEverything we built is in our hands!\nNo more surrender, no more decay\nWash all the compromised visions away!" },
      { id: "b_met_7", type: "chorus", label: "Chorus 2", text: "Stand in the eye of the quantum storm!\nReinvent the ashes and take new form!\nThrough the darkest void we ignite the spark\nLeave an everlasting light in the dark!" },
      { id: "b_met_8", type: "breakdown", label: "Breakdown", text: "BREAK THE MATRIX!\n(BLEGH!)\n(Break!)\n(Shatter!)\n(DIE!)" },
      { id: "b_met_9", type: "solo", label: "Solo", text: "(Soar!)\n(Yeah!)\n(Ignite the spark!)\n(Never surrender!)" },
      { id: "b_met_10", type: "chorus", label: "Chorus 3", text: "Stand in the eye of the quantum storm!\nReinvent the ashes and take new form!\nThrough the darkest void we ignite the spark\nLeave an everlasting light in the dark!\nRising above where the titans fall\nAnswering the final battle call!" },
      { id: "b_met_11", type: "outro", label: "Outro", text: "Quantum break\nNothing remains of the cage\nWe are unbroken\nSilence" }
    ],
    instrumental_blocks: [
      { id: "ib_met_1", type: "intro", label: "Intro", text: "(Down-tuned 8-string polyrhythmic chugs slam in unison with double-bass kicks, sub drops, and ambient glitch fx)" },
      { id: "ib_met_2", type: "verse", label: "Verse 1", text: "(Complex syncopated djent riffing with rapid palm mutes, machine-gun bass drum triggers, and cutting China cymbal hits)" },
      { id: "ib_met_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Atmospheric synth pads rise behind aggressive staccato guitar chugs and ascending pitch sweeps)" },
      { id: "ib_met_4", type: "chorus", label: "Chorus 1", text: "(Massive melodic metalcore chorus with wide open guitar octaves, soaring lead lines, driving double kicks, and thick bass)" },
      { id: "ib_met_5", type: "verse", label: "Verse 2", text: "(Technical polyrhythmic groove with intricate kick patterns, discordant pinch harmonics, and heavy sub pulses)" },
      { id: "ib_met_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Snare roll build accelerates with relentless intensity into a massive sub-bass impact drop)" },
      { id: "ib_met_7", type: "chorus", label: "Chorus 2", text: "(Expansive melodic drop with dual harmonized guitar leads soaring over thunderous rhythm sections)" },
      { id: "ib_met_8", type: "breakdown", label: "Breakdown", text: "(Crushing half-time breakdown featuring earth-shattering 8-string chugs, sub drops, and mechanical cymbal stops)" },
      { id: "ib_met_9", type: "solo", label: "Solo", text: "(Virtuosic progressive metal guitar solo featuring rapid sweep picking, tapped arpeggios, and expressive whammy screams)" },
      { id: "ib_met_10", type: "chorus", label: "Chorus 3", text: "(Full-force climactic chorus drop with layered guitar melodies and maximum rhythmic double-bass power)" },
      { id: "ib_met_11", type: "outro", label: "Outro", text: "(Final crushing breakdown riff ends on an abrupt, suffocating silence with decaying sub resonance)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "country_dust_and_diesel",
    title: "Dust & Diesel",
    genre: "Country",
    subgenre: "Modern Americana / Heartland Rock",
    bpm: 104,
    key: "G major",
    mood: "Grounded, nostalgic, honest, open-road, uplifting.",
    vocals: "Warm raspy male baritone lead with rich southern drawl, acoustic harmony on choruses, conversational unhurried delivery.",
    arrangement: "Acoustic Martin D-28 rhythm strumming, weeping pedal steel guitar, punchy kick-snare train beat, and Telecaster twang.",
    blocks: [
      { id: "b_cnt_1", type: "intro", label: "Intro", text: "Yeah, rolling down County Line\nJust like old times\nWindows down, tank full of gas\n(Let's ride, buddy)\n(Yeah)" },
      { id: "b_cnt_2", type: "verse", label: "Verse 1", text: "Old pine trees leaning by the gravel road\nCarrying sixty miles worth of heavy load\nGot the windows down catching that summer rain\nWashing all the rust off this two-lane lane\nBoot heels worn from the honest grind\nLeaving every troubled thought way behind\nDaddy's old toolbox sitting in the back\nKeeping this rusty Chevy right on track\nSmell of sweet hay burning in the field\nKnowing that the simple things are real" },
      { id: "b_cnt_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Sun sinking down past the harvest grain\nNothing quite cures like an open plain\nTurn the dial up till the speakers roar\nTo the songs that we've been waiting for\nGot the cool breeze blowing through the truck\nThanking the Lord for a little bit of luck\n(Yeah, good luck)" },
      { id: "b_cnt_4", type: "chorus", label: "Chorus 1", text: "Running on dust, diesel, and prayers tonight\nChasing the red glow of the taillight\nNothing in this world can slow me down\nThirty miles past the edge of town\nGot a full tank and a clear blue sky\nWatching all the hard miles roll on by\n(Just rolling on home)\n(Dust and diesel)" },
      { id: "b_cnt_5", type: "verse", label: "Verse 2", text: "Silver moonlight shining on the tractor line\nNeighbor's porch light burning like a friendly sign\nWorking with your hands gives you peace of mind\nBest kind of freedom you can ever find\nHard-earned dollar and a faithful heart\nKnowing right where the real things start\nCold sweet tea in a mason jar\nStaring up at every single southern star" },
      { id: "b_cnt_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Sun sinking down past the harvest grain\nNothing quite cures like an open plain\nTurn the dial up till the speakers roar\nTo the songs that we've been waiting for\nGot the cool breeze blowing through the truck\nThanking the Lord for a little bit of luck" },
      { id: "b_cnt_7", type: "chorus", label: "Chorus 2", text: "Running on dust, diesel, and prayers tonight\nChasing the red glow of the taillight\nNothing in this world can slow me down\nThirty miles past the edge of town\nGot a full tank and a clear blue sky\nWatching all the hard miles roll on by" },
      { id: "b_cnt_8", type: "breakdown", label: "Bridge", text: "There's a comfort in the rhythm of the highway line\nKnowing that the future's gonna turn out fine\nKeep your eyes on the horizon ahead\nRemembering every word that mama said\nHonest living and a steady hand\nRooted deep inside this open land\n(Roots run deep)" },
      { id: "b_cnt_9", type: "solo", label: "Solo", text: "(Pick it clean!)\n(Yeah!)\n(Southern soul!)\n(Roll on!)" },
      { id: "b_cnt_10", type: "chorus", label: "Chorus 3", text: "Running on dust, diesel, and prayers tonight\nChasing the red glow of the taillight\nNothing in this world can slow me down\nThirty miles past the edge of town\nGot a full tank and a clear blue sky\nWatching all the hard miles roll on by" },
      { id: "b_cnt_11", type: "outro", label: "Outro", text: "Just rolling on home...\nDust and diesel\nCricket songs in the evening breeze\nTuneBloom Country Master\n(All the way home)" }
    ],
    instrumental_blocks: [
      { id: "ib_cnt_1", type: "intro", label: "Intro", text: "(Warm acoustic Martin D-28 rhythm strumming introduces the chord progression with weeping pedal steel guitar swells)" },
      { id: "ib_cnt_2", type: "verse", label: "Verse 1", text: "(Punchy kick-snare train beat kicks in alongside warm electric bass and twangy Telecaster chicken-picking fills)" },
      { id: "ib_cnt_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Pedal steel climbs into high melodic sustains while acoustic strums build dynamic excitement toward the chorus)" },
      { id: "ib_cnt_4", type: "chorus", label: "Chorus 1", text: "(Full anthemic heartland drop with driving live drums, soaring fiddle harmonies, weeping steel, and big Telecaster chords)" },
      { id: "ib_cnt_5", type: "verse", label: "Verse 2", text: "(Rhythm stays steady while an acoustic dobro weaves tasteful bluesy slide riffs around the acoustic rhythm guitar)" },
      { id: "ib_cnt_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Tambourine accents and walking basslines push the momentum forward into another big open-road chorus)" },
      { id: "ib_cnt_7", type: "chorus", label: "Chorus 2", text: "(Rousing country-rock drop featuring rich acoustic layers, singing pedal steel guitar, and punchy drum pocket)" },
      { id: "ib_cnt_8", type: "breakdown", label: "Bridge", text: "(Subtractive breakdown highlighting gentle fingerpicked acoustic guitar, soft pedal steel, and light kick thuds)" },
      { id: "ib_cnt_9", type: "solo", label: "Solo", text: "(Virtuosic Telecaster guitar solo featuring fast country hybrid picking, dynamic bends, and rich tube amp chime)" },
      { id: "ib_cnt_10", type: "chorus", label: "Chorus 3", text: "(Full ensemble climax with dual fiddle and pedal steel leads soaring over driving country-rock rhythm section)" },
      { id: "ib_cnt_11", type: "outro", label: "Outro", text: "(Train beat slows to a gentle halt, leaving a solitary acoustic guitar chord and fading pedal steel note to silence)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "latin_fuego_en_la_noche",
    title: "Fuego en la Noche",
    genre: "Latin Pop",
    subgenre: "Modern Reggaeton / Sensual Dembow",
    bpm: 98,
    key: "B minor",
    mood: "Sensual, rhythmic, hypnotic, tropical, seductive.",
    vocals: "Smooth bilingual Spanish and English tenor vocal with rhythmic cadence, autotune ad-libs, and stacked chorus vocal harmonies.",
    arrangement: "Punchy dembow drum groove, deep sub-bass glide, muted flamenco nylon guitar riff, and atmospheric synth plucks.",
    blocks: [
      { id: "b_lat_1", type: "intro", label: "Intro", text: "Dímelo... TuneBloom\nLa noche está llamando\nBailando suave, tú y yo\nSiente el bajo retumbar en el pecho\n(Fuego!)\n(Dale, no pares)" },
      { id: "b_lat_2", type: "verse", label: "Verse 1", text: "Luces bajas en la ciudad\nTu mirada dice la verdad\nTe acercas lento sin preguntar\nEl ritmo empieza a acelerar\nMoviéndote con esa elegancia\nEliminando toda la distancia\nPerfume caro flotando en el aire\nEsta noche no hay quien nos pare\nTu cintura tiene ese poder\nQue me hace todo enloquecer" },
      { id: "b_lat_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "La música sube y no podemos parar\nEl bajo retumba hasta hacernos vibrar\nBailando pegados bajo el resplandor\nSintiendo en el pecho este gran calor\nNo hay marcha atrás cuando empieza a sonar\nEste dembow que te va a conquistar\n(Fuego!)" },
      { id: "b_lat_4", type: "chorus", label: "Chorus 1", text: "Hay fuego en la noche, déjate llevar\nNadie como tú me puede controlar\nCon ese movimiento me vas a matar\nHasta que la luna se vaya a ocultar\n(Fuego, fuego... bien pegao)\n(Bailando suave hasta el amanecer)\n(Dale mami, no te quites)" },
      { id: "b_lat_5", type: "verse", label: "Verse 2", text: "Whiskey en la mesa, humo en el salón\nSincronizados en la misma emoción\nTu cuerpo sabe cómo navegar\nCada compás me vuelve a atrapar\nNo hay prisa cuando se siente así\nTodo lo que quiero lo encuentro en ti\nManos en la cintura, ritmo sensual\nUna conexión que no tiene igual" },
      { id: "b_lat_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "La música sube y no podemos parar\nEl bajo retumba hasta hacernos vibrar\nBailando pegados bajo el resplandor\nSintiendo en el pecho este gran calor\nNo hay marcha atrás cuando empieza a sonar\nEste dembow que te va a conquistar" },
      { id: "b_lat_7", type: "chorus", label: "Chorus 2", text: "Hay fuego en la noche, déjate llevar\nNadie como tú me puede controlar\nCon ese movimiento me vas a matar\nHasta que la luna se vaya a ocultar" },
      { id: "b_lat_8", type: "breakdown", label: "Bridge", text: "Suavemente al oído susúrrame\nQue esta noche nunca se termine\nElevando el tempo sin condición\nSomos la chispa de la creación\nBajo las estrellas bailando los dos\nSin despedidas, sin ningún adiós\n(Dale suave)" },
      { id: "b_lat_9", type: "solo", label: "Solo", text: "(Dale!)\n(Fuego en la noche!)\n(Siente el calor!)\n(Pegadito, mami!)" },
      { id: "b_lat_10", type: "chorus", label: "Chorus 3", text: "Hay fuego en la noche, déjate llevar\nNadie como tú me puede controlar\nCon ese movimiento me vas a matar\nHasta que la luna se vaya a ocultar\n(Fuego en la noche... tú y yo)\n(Hasta que salga el sol)" },
      { id: "b_lat_11", type: "outro", label: "Outro", text: "Así mismito...\nHasta que salga el sol\nTuneBloom Master Latino\nFuego" }
    ],
    instrumental_blocks: [
      { id: "ib_lat_1", type: "intro", label: "Intro", text: "(Muted flamenco nylon guitar riff introduces a passionate minor progression with subtle vinyl crackle)" },
      { id: "ib_lat_2", type: "verse", label: "Verse 1", text: "(Classic punchy dembow drum groove drops in with deep 808 sub-bass glides and syncopated shaker accents)" },
      { id: "ib_lat_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Atmospheric synth plucks and ascending sub-bass glides build sensual anticipation toward the drop)" },
      { id: "ib_lat_4", type: "chorus", label: "Chorus 1", text: "(Full reggaeton drop with heavy percussive dembow punch, resonant sub-bass, and bright melodic guitar lead)" },
      { id: "ib_lat_5", type: "verse", label: "Verse 2", text: "(Dembow rhythm strips back to crisp rimshots while a smooth trumpet countermelody weaves through the mix)" },
      { id: "ib_lat_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Snare build accelerates alongside rising synth sweeps and filtered brass stabs driving toward the climax)" },
      { id: "ib_lat_7", type: "chorus", label: "Chorus 2", text: "(High-energy Latin club drop featuring heavy bass impact, crisp dembow cadence, and layered melodic hooks)" },
      { id: "ib_lat_8", type: "breakdown", label: "Bridge", text: "(Half-time romantic breakdown featuring solo acoustic Spanish guitar plucks, isolated sub thuds, and room reverb)" },
      { id: "ib_lat_9", type: "solo", label: "Solo", text: "(Virtuosic Spanish nylon guitar delivers a fast, emotional flamenco solo with rapid rasgueados and legato runs)" },
      { id: "ib_lat_10", type: "chorus", label: "Chorus 3", text: "(Final celebratory dembow explosion with flamenco guitar licks dancing over full pounding percussion section)" },
      { id: "ib_lat_11", type: "outro", label: "Outro", text: "(Dembow rhythm fades into tape delay, leaving solitary Spanish guitar arpeggios dying into quiet silence)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "house_echoes_of_elysium",
    title: "Echoes of Elysium",
    genre: "Electronic",
    subgenre: "Melodic Progressive House / Deep Trance",
    bpm: 124,
    key: "F# minor",
    mood: "Euphoric, driving, transcendent, atmospheric, hypnotic.",
    vocals: "Airy, ethereal female soprano vocal with sustained notes, stereo ping-pong delays, vocoder harmonies, and wordless melodic runs.",
    arrangement: "Pumping four-on-the-floor kick, rolling 16th bassline, lush supersaw chords, plucky arpeggios, and white noise sweeps.",
    blocks: [
      { id: "b_hou_1", type: "intro", label: "Intro", text: "(Echoes in the dark...)\n(Feel the frequency rising...)\n(Floating through celestial space...)\n(Universal harmony awakens...)\n(Let it build...)" },
      { id: "b_hou_2", type: "verse", label: "Verse 1", text: "Drifting through the endless blue\nEvery shadow turning into light with you\nBoundless ocean beneath the sky\nWatching ancient constellations passing by\nSonic waves upon the shore of time\nPure harmonic resonance sublime\nWeightless energy inside the chest\nPutting all our mortal thoughts to rest\nInfinite horizons shining clear\nBanishing the memory of fear" },
      { id: "b_hou_3", type: "pre-chorus", label: "Build-Up 1", text: "Frequency climbing higher and higher\nIgniting the universal fire\nFeel the pressure start to rise\nOpen up your eyes!\nRising up into the blinding light\nWe transcend the borders of the night!\n(Three, two, one, ascend!)" },
      { id: "b_hou_4", type: "chorus", label: "Drop 1", text: "(Let it rise!)\n(Higher, higher!)\n(Echoes of Elysium!)\n(Pure progressive power!)\n(Ascend!)" },
      { id: "b_hou_5", type: "verse", label: "Verse 2", text: "Weightless in the sonic stream\nLiving inside a lucid waking dream\nHarmonic overtones fill the room\nEvery single frequency begins to bloom\nElectric pulses beating through the soul\nTaking back harmonious control\nWalking through the gates of pure design\nWhere the human and the star align" },
      { id: "b_hou_6", type: "pre-chorus", label: "Build-Up 2", text: "Frequency climbing higher and higher\nIgniting the universal fire\nRelease the tension, break the wall\nAnswer to the call!\nRising up into the blinding light\nWe transcend the borders of the night!" },
      { id: "b_hou_7", type: "chorus", label: "Drop 2", text: "(Break the wall!)\n(Elysium!)\n(Harmonic explosion!)\n(Feel the frequency!)\n(Ascend!)" },
      { id: "b_hou_8", type: "breakdown", label: "Breakdown", text: "When the world is quiet and still\nWe find the space that love can fill\nSuspended in the atmosphere\nWhere everything is crystal clear\n(Quiet and still... floating...)" },
      { id: "b_hou_9", type: "pre-chorus", label: "Build-Up 3", text: "Three... two... one... let it soar!\nShatter the ceiling forevermore!\n(Ascend to the stars!)" },
      { id: "b_hou_10", type: "chorus", label: "Drop 3", text: "(Soar!)\n(Echoes of Elysium!)\n(Full energy release!)\n(Infinite light!)" },
      { id: "b_hou_11", type: "outro", label: "Outro", text: "Echoes drifting out...\nInto the eternal light...\nTuneBloom Progressive Master\nFade away into the stars" }
    ],
    instrumental_blocks: [
      { id: "ib_hou_1", type: "intro", label: "Intro", text: "(Gentle analog pluck melody echoes through wide stereo delay over a warm ethereal synthesizer pad)" },
      { id: "ib_hou_2", type: "verse", label: "Verse 1", text: "(Deep four-on-the-floor kick enters softly with a rolling 16th-note sub-bassline and crisp closed hi-hats)" },
      { id: "ib_hou_3", type: "pre-chorus", label: "Build-Up 1", text: "(Snare roll accelerates while cutoff filter opens on a massive supersaw lead, driving white noise sweeps upward)" },
      { id: "ib_hou_4", type: "chorus", label: "Drop 1", text: "(Euphoric progressive house drop with pounding kick, pumping sidechain bassline, and soaring wide supersaw lead)" },
      { id: "ib_hou_5", type: "verse", label: "Verse 2", text: "(Kick and bass continue driving the groove while a secondary syncopated synth arp weaves around the lead)" },
      { id: "ib_hou_6", type: "pre-chorus", label: "Build-Up 2", text: "(Dramatic build with rising trance synths, accelerating percussion rolls, and deep sub pitch automation)" },
      { id: "ib_hou_7", type: "chorus", label: "Drop 2", text: "(Full-power peak drop featuring roaring supersaw chords, heavy low-end impact, and energetic open hi-hat sizzle)" },
      { id: "ib_hou_8", type: "breakdown", label: "Breakdown", text: "(Kick drum vanishes, leaving solitary majestic piano chords and soaring ambient pads drifting in vast reverb)" },
      { id: "ib_hou_9", type: "solo", label: "Solo", text: "(High-register synth lead performs an emotional arpeggiated solo with dynamic filter sweeps and delay feedback)" },
      { id: "ib_hou_10", type: "chorus", label: "Drop 3", text: "(Ultimate transcendent climax combining full supersaw power, driving 124 BPM rhythm section, and melodic arpeggios)" },
      { id: "ib_hou_11", type: "outro", label: "Outro", text: "(Drums strip away gradually, leaving fading synth chords and gentle tape delay repeats dissipating into space)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "funk_starlight_groove",
    title: "Starlight Groove",
    genre: "Funk",
    subgenre: "Nu-Disco / Modern Boogie Funk",
    bpm: 116,
    key: "E minor",
    mood: "Funky, energetic, celebratory, joyous, infectious.",
    vocals: "Punchy, rhythmic tenor vocal with falsetto chorus ad-libs, group backing vocals on hooks, brass-stab vocal syncopation, and pure soul.",
    arrangement: "Slap bass with envelope filter, chicken-scratch Stratocaster guitar, tight punchy horn section, vintage Minimoog bass synthesizer, and disco claps.",
    blocks: [
      { id: "b_fnk_1", type: "intro", label: "Intro", text: "Get down!\nYeah, bring it on in\nTuneBloom funk in the pocket\nHorns blowing, slap bass popping\n(Let's groove! Ow!)" },
      { id: "b_fnk_2", type: "verse", label: "Verse 1", text: "Spotted shoes on the parquet floor\nCan't keep your feet from heading for the door\nBassline popping right into your soul\nTaking full momentum and complete control\nGot that rhythm locked into the groove\nGiving everybody something to prove\nGlitter ball spinning up on high\nLighting up the disco in the sky\nStratocaster scratching on the two and four\nMaking every single body beg for more" },
      { id: "b_fnk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Hands in the air, feeling the beat\nTurning up the power on the city street\nHorn section blowing till the roof comes down\nBest vibrations in the entire town!\nShake off the heavy and let it all drop\nThis funky train is never gonna stop!\n(Hit me!)" },
      { id: "b_fnk_4", type: "chorus", label: "Chorus 1", text: "Ride on the starlight groove tonight!\nEverything's shining underneath the light!\nShake off the heavy and let it unwind\nLeave all the ordinary far behind!\n(Yeah! Starlight groove!)\n(Get on up! Ow!)" },
      { id: "b_fnk_5", type: "verse", label: "Verse 2", text: "Stratocaster scratching out the tempo clean\nFunkier than anything you've ever seen\nSyncopated magic on the two and four\nMaking every dancer come back for more\nGot no worries, got no blues\nJust dynamic rhythm you can never lose\nElectric piano chords walking on up\nPouring sweet funk right into your cup" },
      { id: "b_fnk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Hands in the air, feeling the beat\nTurning up the power on the city street\nHorn section blowing till the roof comes down\nBest vibrations in the entire town!" },
      { id: "b_fnk_7", type: "chorus", label: "Chorus 2", text: "Ride on the starlight groove tonight!\nEverything's shining underneath the light!\nShake off the heavy and let it unwind\nLeave all the ordinary far behind!" },
      { id: "b_fnk_8", type: "breakdown", label: "Bridge", text: "Break it down to the bass and drum!\nWatch where the heavy groove is coming from!\nSlap that bass, make the speaker pop\nWe take the party right over the top\n(Hit me! Funky!)" },
      { id: "b_fnk_9", type: "solo", label: "Solo", text: "(Blow that horn!)\n(Yeah! Take it home!)\n(Slap that bass!)\n(Ow! Get funky!)" },
      { id: "b_fnk_10", type: "chorus", label: "Chorus 3", text: "Ride on the starlight groove tonight!\nEverything's shining underneath the light!\nShake off the heavy and let it unwind\nLeave all the ordinary far behind!\n(One more time, groove it out!)\n(Starlight!)" },
      { id: "b_fnk_11", type: "outro", label: "Outro", text: "Keep it funky... just like that!\nHit me on the one!\nTuneBloom Nu-Disco Master\n(Ow!)" }
    ],
    instrumental_blocks: [
      { id: "ib_fnk_1", type: "intro", label: "Intro", text: "(Punchy slap bass riff with envelope filter opens alongside chicken-scratch Stratocaster guitar on the upbeats)" },
      { id: "ib_fnk_2", type: "verse", label: "Verse 1", text: "(Tight four-on-the-floor disco kick drops in with syncopated handclaps on 2 and 4 and warm Fender Rhodes comping)" },
      { id: "ib_fnk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Brass section enters with sharp syncopated horn stabs as bassline walks up toward the buoyant chorus drop)" },
      { id: "ib_fnk_4", type: "chorus", label: "Chorus 1", text: "(Explosive nu-disco drop with fat funk bassline, triumphant brass fanfare, rhythm guitar scratches, and bright open hi-hats)" },
      { id: "ib_fnk_5", type: "verse", label: "Verse 2", text: "(Bass switches to aggressive thumb-slap groove while clavinet with auto-wah weaves energetic funk counter-rhythms)" },
      { id: "ib_fnk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Horn section answers guitar licks in call-and-response while cowbell and percussion build ecstatic momentum)" },
      { id: "ib_fnk_7", type: "chorus", label: "Chorus 2", text: "(Full boogie funk climax featuring driving disco beat, rich brass chord hits, and relentless slap bass bounce)" },
      { id: "ib_fnk_8", type: "breakdown", label: "Bridge", text: "(Rhythmic breakdown stripped down to solo envelope-filter slap bass, isolated acoustic kick, and handclaps)" },
      { id: "ib_fnk_9", type: "solo", label: "Solo", text: "(Blistering saxophone solo with gritty overblown notes, rapid blues runs, and tight syncopated stabs)" },
      { id: "ib_fnk_10", type: "chorus", label: "Chorus 3", text: "(Peak party release combining the soaring saxophone with full horn ensemble, slap bass, and driving disco rhythm)" },
      { id: "ib_fnk_11", type: "outro", label: "Outro", text: "(Groove rides out on a funky slap-bass vamp and horn stabs, ending on an emphatic hit on the one)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "rock_static_and_rust",
    title: "Static & Rust",
    genre: "Alternative Rock",
    subgenre: "90s Grunge Revival / Post-Grunge",
    bpm: 108,
    key: "E minor",
    mood: "Raw, gritty, brooding, explosive, cathartic.",
    vocals: "Dynamic male vocal transitioning from whispered baritone verses to gravelly, screaming choruses with full chest resonance and emotional strain.",
    arrangement: "Distorted Gibson Les Paul power chords through vintage Marshall stacks, heavy thumping live drums, driving fuzz bass, and amp feedback.",
    blocks: [
      { id: "b_rck_1", type: "intro", label: "Intro", text: "Yeah...\nTurn the amps up all the way\nFeedback humming in the dark\n(Here it comes)" },
      { id: "b_rck_2", type: "verse", label: "Verse 1", text: "Cracked ceiling staring down at me\nTrapped inside this quiet frequency\nCounting seconds till the engine turns\nWatching how the slow ignition burns\nWords written down on a crumpled sheet\nEchoing across the empty street\nRust on the iron gate outside my door\nI don't wanna play these silent games no more\nTurn up the distortion on the pedal board\nTaking everything that we can afford" },
      { id: "b_rck_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Turn up the feedback, let it scream\nNothing is ever quite what it seems\nTension stretching till the wire snaps\nFalling right into the open traps\nBreak through the wall with a heavy sound\nShatter the quiet to the ground!\n(Yeah!)" },
      { id: "b_rck_4", type: "chorus", label: "Chorus 1", text: "Caught in the static and the rust!\nWatching our promises turn to dust!\nScream at the wall till the shadows break\nFor all the chances we didn't take!\nRising above where the wreckage lies\nUnder the grey and stormy skies!\n(Static and rust!)" },
      { id: "b_rck_5", type: "verse", label: "Verse 2", text: "Old photographs on the painted wall\nWaiting for the heavy rain to fall\nScars on the knuckle from the fight we chose\nKnowing how the bitter story goes\nNo more apologies, no more delay\nTime to wash the compromise away\nFuzz bass tearing through the studio room\nUnleashing pure cathodic bloom" },
      { id: "b_rck_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Turn up the feedback, let it scream\nNothing is ever quite what it seems\nTension stretching till the wire snaps\nFalling right into the open traps\nBreak through the wall with a heavy sound\nShatter the quiet to the ground!" },
      { id: "b_rck_7", type: "chorus", label: "Chorus 2", text: "Caught in the static and the rust!\nWatching our promises turn to dust!\nScream at the wall till the shadows break\nFor all the chances we didn't take!" },
      { id: "b_rck_8", type: "breakdown", label: "Bridge", text: "Strip it down to the raw bone frame\nNobody else left that we can blame\nIgnite the fuel and let it go\nDown in the fire down below\nReclaim the spark from the dying ash\nWatch the whole illusion crash\n(Let it burn!)" },
      { id: "b_rck_9", type: "solo", label: "Solo", text: "(Let it burn!)\n(Guitars screaming through the stack!)\n(Yeah! Rip it up!)\n(Feedback explosion!)" },
      { id: "b_rck_10", type: "chorus", label: "Chorus 3", text: "Caught in the static and the rust!\nWatching our promises turn to dust!\nScream at the wall till the shadows break\nFor all the chances we didn't take!\nRising above where the wreckage lies\nUnder the grey and stormy skies!" },
      { id: "b_rck_11", type: "outro", label: "Outro", text: "Static and rust...\nNothing left...\nOnly the pure truth remains\nTuneBloom Grunge Master\nDust\n(Ring out)" }
    ],
    instrumental_blocks: [
      { id: "ib_rck_1", type: "intro", label: "Intro", text: "(Clean electric guitar with subtle chorus picks a brooding arpeggio as vintage tube amp hums in the background)" },
      { id: "ib_rck_2", type: "verse", label: "Verse 1", text: "(Gritty fuzz bassline enters with heavy, unhurried acoustic drum beats and sparse rimshots)" },
      { id: "ib_rck_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Distortion pedal clicks on; guitars swell with harmonic feedback and crashing crash cymbals build tension)" },
      { id: "ib_rck_4", type: "chorus", label: "Chorus 1", text: "(Explosive grunge drop with massive wall of distorted power chords, thumping live drums, and thick overdriven bass)" },
      { id: "ib_rck_5", type: "verse", label: "Verse 2", text: "(Rhythm drops back to brooding clean guitars and rumbling fuzz bass while subtle guitar feedback floats above)" },
      { id: "ib_rck_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Floor tom rolls build relentless momentum as guitar distortion swells back to maximum gain)" },
      { id: "ib_rck_7", type: "chorus", label: "Chorus 2", text: "(Heavy cathartic grunge drop with crushing Les Paul riffs, wide open crash cymbals, and driving rhythm)" },
      { id: "ib_rck_8", type: "breakdown", label: "Bridge", text: "(Subtractive breakdown featuring solitary clean guitar plucks and isolated, pulsating bass notes in an open room)" },
      { id: "ib_rck_9", type: "solo", label: "Solo", text: "(Emotional alternative rock guitar solo with screaming bends, heavy wah-wah pedal action, and feedback sustain)" },
      { id: "ib_rck_10", type: "chorus", label: "Chorus 3", text: "(Final earth-shattering rock climax with layered guitar tracks, pounding drum fills, and maximum emotional intensity)" },
      { id: "ib_rck_11", type: "outro", label: "Outro", text: "(Final chord rings out indefinitely into warm harmonic amp feedback and tape delay decay to complete silence)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "orchestral_valkyrie_ascending",
    title: "Valkyrie Ascending",
    genre: "Cinematic",
    subgenre: "Epic Orchestral / Neo-Classical Hybrid",
    bpm: 90,
    key: "D minor",
    mood: "Heroic, dramatic, monumental, majestic, expansive.",
    vocals: "Dramatic soprano solo with operatic vibrato, layered SATB cinematic choir chanting in Latin cadence, and soaring choral crescendos.",
    arrangement: "Full symphonic string section, French horn brass fanfare, massive cinematic Taiko drums, orchestral harp, and subtle modular synth sub-pulses.",
    blocks: [
      { id: "b_orc_1", type: "intro", label: "Intro", text: "Aeterna lux...\nSurge ad astra, veritas in armis\n(Surge ad astra)\n(Gloria in excelsis)\n(Ascendit...)" },
      { id: "b_orc_2", type: "verse", label: "Verse 1", text: "Across the mountain ridge the storm unfolds\nA legacy of iron, blood, and gold\nThrough freezing winds the ancient banner flies\nUnder the gaze of dark immortal skies\nHold the perimeter, protect the flame\nHonor the glory of the fallen name\nSymphonic thunder echoing through the night\nGuiding our warriors into the holy light\nUnbroken line of heroes taking stand\nDefending this celestial native land" },
      { id: "b_orc_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Aeterna lux, veritas in armis\nSurge ad astra, victoria nos vocat\nWings of iron soaring through the tempest deep\nA sacred vigil that we swear to keep\n(Gloria! Victoria!)" },
      { id: "b_orc_4", type: "chorus", label: "Chorus 1", text: "Rise from the ashes of the battleground!\nWhere destiny and courage can be found!\nWith wings of iron we ascend the crest\nPutting our mortal fear to rest!\nAeterna gloria, triumphus animi\nWe conquer through the sacred symphony!\n(Valkyrie ascending!)" },
      { id: "b_orc_5", type: "verse", label: "Verse 2", text: "The thunder echoes through the frozen canyon deep\nA sacred vigil that we swear to keep\nNo sword shall falter in the decisive hour\nWe stand as guardians of transcendent power\nThrough every trial we shall remain\nUnbroken by the tempest and the pain\nChoirs of angels singing through the gale\nOur holy conviction never shall fail" },
      { id: "b_orc_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Aeterna lux, veritas in armis\nSurge ad astra, victoria nos vocat\nWings of iron soaring through the tempest deep\nA sacred vigil that we swear to keep" },
      { id: "b_orc_7", type: "chorus", label: "Chorus 2", text: "Rise from the ashes of the battleground!\nWhere destiny and courage can be found!\nWith wings of iron we ascend the crest\nPutting our mortal fear to rest!" },
      { id: "b_orc_8", type: "breakdown", label: "Bridge", text: "In silentio noctis\nGloria in excelsis deo\nSanctus, sanctus, requiem aeternam\nLight descending on the brave\n(Aeterna...)" },
      { id: "b_orc_9", type: "solo", label: "Solo", text: "(Victoria!)\n(Aeterna lux!)\n(Surge ad astra!)\n(Ascendit in astra!)" },
      { id: "b_orc_10", type: "chorus", label: "Chorus 3", text: "Rise from the ashes of the battleground!\nWhere destiny and courage can be found!\nWith wings of iron we ascend the crest\nPutting our mortal fear to rest!\nAeterna gloria, triumphus animi\nWe conquer through the sacred symphony!" },
      { id: "b_orc_11", type: "outro", label: "Outro", text: "Victoria nos vocat\nAscendit in astra\nTuneBloom Cinematic Master\nAmen" }
    ],
    instrumental_blocks: [
      { id: "ib_orc_1", type: "intro", label: "Intro", text: "(Low orchestral cellos and contrabasses play somber minor chords alongside delicate harp arpeggios and distant timpani rolls)" },
      { id: "ib_orc_2", type: "verse", label: "Verse 1", text: "(Spiccato string ostinato enters in 16th notes, accompanied by noble French horn fanfares and deep sub-brass pulses)" },
      { id: "ib_orc_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Dynamic tension escalates with thunderous Taiko drum hits, ascending violin counterpoint, and brass swells)" },
      { id: "ib_orc_4", type: "chorus", label: "Chorus 1", text: "(Monumental orchestral climax with full brass ensemble, soaring first violins, massive percussion impacts, and shimmering cymbal washes)" },
      { id: "ib_orc_5", type: "verse", label: "Verse 2", text: "(Rhythm section pulls back to spiccato strings while an expressive solo cello plays a sweeping, melancholic melody)" },
      { id: "ib_orc_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Snare ensemble and orchestral field drums march with militaristic precision into an immense brass crescendo)" },
      { id: "ib_orc_7", type: "chorus", label: "Chorus 2", text: "(Grand heroic drop featuring powerful trumpet fanfare, sweeping string countermelodies, and ground-shaking orchestral bass drums)" },
      { id: "ib_orc_8", type: "breakdown", label: "Bridge", text: "(Sacred breakdown stripping away percussion to reveal solitary concert harp arpeggios and warm French horn chords in cavernous reverb)" },
      { id: "ib_orc_9", type: "solo", label: "Solo", text: "(Virtuosic solo violin performs an impassioned neo-classical solo with sweeping arpeggios, expressive vibrato, and dynamic trills)" },
      { id: "ib_orc_10", type: "chorus", label: "Chorus 3", text: "(Full symphonic finale combining the solo violin with tutti orchestra, thunderous Taiko rolls, and blazing brass chords)" },
      { id: "ib_orc_11", type: "outro", label: "Outro", text: "(Massive final chord decays into cathedral reverb, leaving solitary low cello notes and a distant harp chime fading to silence)" }
    ]
  });
})(window);