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
    vocal_lead: "Soulful female soprano with airy dynamic breath, high falsetto sustains, pitch-shifted vocal chops, and subtle ping-pong delay throws.",
    instrumental_lead: "Deep warm 808 Reece sub-bass, fast rolling 174 BPM Amen-derived drum break, Rhodes jazz chord stabs.",
    arrangement: "Primary: Deep warm 808 Reece sub-bass and lush Fender Rhodes jazz voicings drive the rolling harmonic progression. Secondary: A fast 174 BPM Amen-derived drum break provides relentless forward momentum, accompanied by shimmering vocal pads, soprano saxophone counter-melodies, and filtered delay sweeps.",
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
      { id: "ib_dnb_1", type: "intro", label: "Intro", text: "(Fender Rhodes jazz voicings, washed vocal pads, filtered vinyl rain texture)" },
      { id: "ib_dnb_2", type: "verse", label: "Verse 1", text: "(174 BPM rolling hi-hat shuffle, warm sub-bass pulse, muted guitar plucks)" },
      { id: "ib_dnb_3", type: "pre-chorus", label: "Build-Up 1", text: "(Accelerating snare build, white noise risers, high-pass Rhodes sweeps, vocal chops)" },
      { id: "ib_dnb_4", type: "chorus", label: "Drop 1", text: "(Liquid roller drop, tearing Reese sub-bass, Amen breakbeat, shimmering Rhodes chords)" },
      { id: "ib_dnb_5", type: "verse", label: "Verse 2", text: "(Rapid rolling breakbeat, upright acoustic bass countermelody)" },
      { id: "ib_dnb_6", type: "pre-chorus", label: "Build-Up 2", text: "(Ascending brass stabs, intense snare roll crescendo, atmospheric velocity)" },
      { id: "ib_dnb_7", type: "chorus", label: "Drop 2", text: "(Modulated Reese bass growls, intricate ride cymbal patterns, stereo string swells)" },
      { id: "ib_dnb_8", type: "breakdown", label: "Breakdown", text: "(Reverbed electric piano chords, airy synth pads, weightless breakdown)" },
      { id: "ib_dnb_9", type: "solo", label: "Solo", text: "(Soprano saxophone solo, fluid jazz runs, vibrato sustains, hall delay)" },
      { id: "ib_dnb_10", type: "chorus", label: "Drop 3", text: "(Saxophone solo climax, tearing Reese bass, driving breakbeats)" },
      { id: "ib_dnb_11", type: "outro", label: "Outro", text: "(Low-pass filtered breakbeat, solitary Rhodes chords, decaying reverb tails)" }
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
    vocal_lead: "Distorted vocoder robotic intro, soaring anthemic baritone lead with wide stereo chorus, tape delay slapback, and raw chest belts.",
    instrumental_lead: "Pumping sidechain bassline, Oberheim 8-voice brass stabs, gated LinnDrum snare, arpeggiated analog lead.",
    arrangement: "Primary: A pumping sidechain analog bassline and arpeggiated leads provide continuous kinetic drive. Secondary: Gated LinnDrum snares, bright Oberheim 8-voice brass stabs, and screaming 80s electric guitar leads punctuate the groove under wide stereo supersaw chords.",
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
      { id: "ib_syn_1", type: "intro", label: "Intro", text: "(16th-note analog bass arpeggios, opening resonant low-pass filter, laser fx)" },
      { id: "ib_syn_2", type: "verse", label: "Verse 1", text: "(Four-on-the-floor kick, pumping sidechain compression, gated 80s snare, Oberheim brass stabs)" },
      { id: "ib_syn_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Ascending chromatic synth lead, pitched risers, tom-drum rolls)" },
      { id: "ib_syn_4", type: "chorus", label: "Chorus 1", text: "(Sawtooth bassline, dual-lead synths in octaves, gated reverb snares)" },
      { id: "ib_syn_5", type: "verse", label: "Verse 2", text: "(Pulsing rhythm, clean chorus electric guitar, syncopated arpeggiated riffs)" },
      { id: "ib_syn_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Detuned supersaw chords, harmonic distortion, white noise sweep)" },
      { id: "ib_syn_7", type: "chorus", label: "Chorus 2", text: "(Wide stereo leads, pounding bassline, hybrid acoustic-electronic percussion)" },
      { id: "ib_syn_8", type: "breakdown", label: "Bridge", text: "(Lush cinematic synth pads, ticking clock arpeggio, deep bass drones)" },
      { id: "ib_syn_9", type: "solo", label: "Solo", text: "(80s electric guitar solo, heavy whammy vibrato, sweeping arpeggios, tape echo)" },
      { id: "ib_syn_10", type: "chorus", label: "Chorus 3", text: "(Soaring lead guitar, dual supersaws, maximum driving bassline)" },
      { id: "ib_syn_11", type: "outro", label: "Outro", text: "(Pulsing analog bassline, decaying filter cutoff, analog power down to silence)" }
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
    vocal_lead: "Breathy female alto with rich chest resonance, unhurried conversational phrasing, layered gospel choir harmonies, and natural dynamic expression.",
    instrumental_lead: "Damped upright piano, unquantized live rimshot groove, upright bass with finger-noise detail, lush Rhodes tremolo.",
    arrangement: "Primary: Felt-damped upright piano chords and unquantized live rimshot grooves anchor the pocket. Secondary: Upright double bass with tactile finger-noise detail, warm Rhodes stereo tremolo, soft flugelhorn counter-motifs, and brushed ride cymbals weave a relaxed atmosphere.",
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
      { id: "ib_neo_1", type: "intro", label: "Intro", text: "(Felt-damped upright piano chords, extended jazz voicings, warm vinyl needle noise)" },
      { id: "ib_neo_2", type: "verse", label: "Verse 1", text: "(Unquantized Dilla-swung rimshot groove, upright double bass, brushed ride cymbal)" },
      { id: "ib_neo_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Lush Fender Rhodes stereo tremolo, harmonic counterpoint, walking bass notes)" },
      { id: "ib_neo_4", type: "chorus", label: "Chorus 1", text: "(Deep round bass tone, expressive piano voicings, soft flugelhorn accents)" },
      { id: "ib_neo_5", type: "verse", label: "Verse 2", text: "(Muted hollowbody jazz guitar comping on 2 and 4, deep acoustic pocket)" },
      { id: "ib_neo_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(String quartet swells, acoustic double bass grace notes, gentle tension)" },
      { id: "ib_neo_7", type: "chorus", label: "Chorus 2", text: "(Layered piano and Rhodes chords, singing flugelhorn melody, lazy swung percussion)" },
      { id: "ib_neo_8", type: "breakdown", label: "Bridge", text: "(Solo upright piano, double bass finger noise, intimate room acoustics)" },
      { id: "ib_neo_9", type: "solo", label: "Solo", text: "(Hollowbody jazz guitar solo, legato slides, double stops, subtle vibrato)" },
      { id: "ib_neo_10", type: "chorus", label: "Chorus 3", text: "(Three-part counterpoint, guitar, piano, flugelhorn, warm swung pocket)" },
      { id: "ib_neo_11", type: "outro", label: "Outro", text: "(Solitary damp piano chords, gentle vinyl static, warm room fade)" }
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
    vocal_lead: "Airy, reverb-drenched dual male and female vocal harmonies, breathy delivery floating behind shimmering chorus guitars with long sustains.",
    instrumental_lead: "Rickenbacker jangle guitars with stereo chorus, driving melodic bassline, punchy 80s snare with hall reverb.",
    arrangement: "Primary: 12-string Rickenbacker jangle guitars with stereo chorus and tape delay define the breezy chord structure. Secondary: Melodic Fender Precision basslines, punchy 80s snare drums with hall reverb, Prophet-5 analog pads, and ambient ocean mist textures widen the soundstage.",
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
      { id: "ib_pop_1", type: "intro", label: "Intro", text: "(12-string Rickenbacker jangle guitars, stereo chorus, tape delay echo, ocean wave ambiance)" },
      { id: "ib_pop_2", type: "verse", label: "Verse 1", text: "(Melodic Fender Precision bassline, punchy 80s kick-snare beat, shimmering guitar arpeggios)" },
      { id: "ib_pop_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Prophet-5 analog synth pads, warm chorus, building guitar shimmer)" },
      { id: "ib_pop_4", type: "chorus", label: "Chorus 1", text: "(Wall of shoegaze guitars, driving rhythmic bass, punchy reverb drums)" },
      { id: "ib_pop_5", type: "verse", label: "Verse 2", text: "(Delicate clean guitar picking, melodic bass, steady tambourine)" },
      { id: "ib_pop_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Fuzz guitar textures, warm harmonic saturation, subtle swell)" },
      { id: "ib_pop_7", type: "chorus", label: "Chorus 2", text: "(Cascading chorus guitars, soaring analog synth chords, heavy crash cymbals)" },
      { id: "ib_pop_8", type: "breakdown", label: "Bridge", text: "(Solitary reverberated 12-string plucks, synth drone, ambient ocean mist)" },
      { id: "ib_pop_9", type: "solo", label: "Solo", text: "(Reverb-drenched electric guitar solo, emotive melodic bends, feedback harmonics, delay sweeps)" },
      { id: "ib_pop_10", type: "chorus", label: "Chorus 3", text: "(Soaring guitar solo, driving drums, jangle rhythm, wide synth pads)" },
      { id: "ib_pop_11", type: "outro", label: "Outro", text: "(Modulated reverb trails, decaying coastal wind, tape hiss fade to silence)" }
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
    vocal_lead: "Gritty, soaring male pop-punk tenor with passionate chest belting, layered double-tracked choruses, and shouted background gang vocals.",
    instrumental_lead: "Driven Marshall guitar power chords, fast driving 160 BPM skate-punk drum kit, melodic bassline.",
    arrangement: "Primary: Roaring Marshall amplifier guitar power chords and driving melodic basslines anchor the tempo. Secondary: Fast 160 BPM skate-punk drum fills, dynamic octave guitar riffs, and heavy acoustic-electronic sub drops provide punchy, aggressive energy.",
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
      { id: "ib_ppk_1", type: "intro", label: "Intro", text: "(Aggressive distorted guitar riff, tight staccato accents, energetic skate-punk drum fill)" },
      { id: "ib_ppk_2", type: "verse", label: "Verse 1", text: "(Fast palm-muted electric guitars, punchy kick-snare beat, galloping bassline)" },
      { id: "ib_ppk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Open power chords, rising cymbal swells, rapid 16th-note drum fills)" },
      { id: "ib_ppk_4", type: "chorus", label: "Chorus 1", text: "(Roaring Marshall stacks, wide-open crash cymbals, driving melodic bass, punchy snare)" },
      { id: "ib_ppk_5", type: "verse", label: "Verse 2", text: "(Half-time bounce, octave guitar leads, tight kick-drum patterns)" },
      { id: "ib_ppk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Palm-muted chugging guitars, ascending bass runs, kinetic drum build)" },
      { id: "ib_ppk_7", type: "chorus", label: "Chorus 2", text: "(Wall-of-sound guitar power chords, furious skate-punk drumming, open crashes)" },
      { id: "ib_ppk_8", type: "breakdown", label: "Bridge", text: "(Clean acoustic guitar strumming, isolated bass guitar, distant floor tom pulse)" },
      { id: "ib_ppk_9", type: "solo", label: "Solo", text: "(Fast melodic pop-punk guitar solo, double stops, alternate picking, harmonic squeals)" },
      { id: "ib_ppk_10", type: "chorus", label: "Chorus 3", text: "(Maximum drum energy, crashing cymbals, full guitar wall, sub-bass impact)" },
      { id: "ib_ppk_11", type: "outro", label: "Outro", text: "(Furious drum fills, final abrupt power chord, ringing amp feedback to silence)" }
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
    vocal_lead: "Visceral mid-range screams and guttural lows on verses, soaring anthemic clean chorus with stereo octave doubling and emotional delivery.",
    instrumental_lead: "Down-tuned 8-string polyrhythmic chugs, rapid double-bass drum triggers, atmospheric ambient glitch synths.",
    arrangement: "Primary: Down-tuned 8-string polyrhythmic chugs and machine-gun double-bass drums establish devastating rhythmic weight. Secondary: Soaring open guitar octaves in the choruses, discordant pinch harmonics, ambient glitch synthesizers, and massive sub drops widen the dynamic ceiling.",
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
      { id: "ib_met_1", type: "intro", label: "Intro", text: "(Down-tuned 8-string polyrhythmic chugs, double-bass kicks, sub drops, ambient glitch fx)" },
      { id: "ib_met_2", type: "verse", label: "Verse 1", text: "(Syncopated djent riffing, rapid palm mutes, machine-gun bass drum triggers, cutting China hits)" },
      { id: "ib_met_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Atmospheric synth pads, aggressive staccato guitar chugs, ascending pitch sweeps)" },
      { id: "ib_met_4", type: "chorus", label: "Chorus 1", text: "(Open guitar octaves, soaring melodic lead line, driving double kicks, thick bass)" },
      { id: "ib_met_5", type: "verse", label: "Verse 2", text: "(Technical polyrhythmic groove, intricate kick patterns, discordant pinch harmonics, sub pulses)" },
      { id: "ib_met_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Accelerating snare roll build, relentless intensity, sub-bass impact drop)" },
      { id: "ib_met_7", type: "chorus", label: "Chorus 2", text: "(Dual harmonized guitar leads, thunderous rhythm section, driving double kicks)" },
      { id: "ib_met_8", type: "breakdown", label: "Breakdown", text: "(Half-time crushing breakdown, 8-string chugs, sub drops, mechanical cymbal chokes)" },
      { id: "ib_met_9", type: "solo", label: "Solo", text: "(Progressive metal guitar solo, rapid sweep picking, tapped arpeggios, whammy screams)" },
      { id: "ib_met_10", type: "chorus", label: "Chorus 3", text: "(Layered guitar melodies, maximum rhythmic double-bass power, wall of sound)" },
      { id: "ib_met_11", type: "outro", label: "Outro", text: "(Crushing final breakdown riff, abrupt suffocating silence, decaying sub resonance)" }
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
    vocal_lead: "Warm raspy male baritone lead with rich southern drawl, acoustic harmony on choruses, conversational unhurried delivery.",
    instrumental_lead: "Acoustic Martin D-28 rhythm strumming, weeping pedal steel guitar, punchy kick-snare train beat, Telecaster twang.",
    arrangement: "Primary: Acoustic Martin D-28 rhythm guitar strumming and weeping pedal steel guitar fills anchor the heartland progression. Secondary: A punchy kick-snare train beat, warm electric bass, twangy Telecaster chicken-picking, and soaring fiddle lines lift the choruses.",
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
      { id: "ib_cnt_1", type: "intro", label: "Intro", text: "(Martin D-28 acoustic rhythm strums, chord progression, weeping pedal steel swells)" },
      { id: "ib_cnt_2", type: "verse", label: "Verse 1", text: "(Punchy kick-snare train beat, electric bass, twangy Telecaster chicken-picking fills)" },
      { id: "ib_cnt_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(High pedal steel sustains, dynamic acoustic strums, building excitement)" },
      { id: "ib_cnt_4", type: "chorus", label: "Chorus 1", text: "(Driving live drums, soaring fiddle harmonies, weeping steel, Telecaster chords)" },
      { id: "ib_cnt_5", type: "verse", label: "Verse 2", text: "(Steady train beat, acoustic dobro slide riffs, acoustic rhythm guitar)" },
      { id: "ib_cnt_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Tambourine accents, walking bassline, forward acoustic momentum)" },
      { id: "ib_cnt_7", type: "chorus", label: "Chorus 2", text: "(Rich acoustic layers, singing pedal steel guitar, punchy drum pocket)" },
      { id: "ib_cnt_8", type: "breakdown", label: "Bridge", text: "(Gentle fingerpicked acoustic guitar, soft pedal steel swells, light kick thuds)" },
      { id: "ib_cnt_9", type: "solo", label: "Solo", text: "(Telecaster guitar solo, country hybrid picking, dynamic bends, tube amp chime)" },
      { id: "ib_cnt_10", type: "chorus", label: "Chorus 3", text: "(Dual fiddle and pedal steel leads, driving country-rock rhythm section)" },
      { id: "ib_cnt_11", type: "outro", label: "Outro", text: "(Slowing train beat, solitary acoustic guitar chord, fading pedal steel note to silence)" }
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
    vocal_lead: "Smooth bilingual Spanish and English tenor vocal with rhythmic cadence, autotune ad-libs, and stacked chorus vocal harmonies.",
    instrumental_lead: "Muted flamenco nylon guitar riff, punchy dembow drum groove, deep sub-bass glide.",
    arrangement: "Primary: Muted flamenco nylon guitar riffs and deep 808 sub-bass glides drive the sensual minor progression. Secondary: A classic punchy dembow drum groove, syncopated shaker accents, smooth trumpet counter-motifs, and ambient vocal plucks establish an intimate tropical club atmosphere.",
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
      { id: "ib_lat_1", type: "intro", label: "Intro", text: "(Muted flamenco nylon guitar riff, minor chord progression, subtle vinyl crackle)" },
      { id: "ib_lat_2", type: "verse", label: "Verse 1", text: "(Punchy dembow drum groove, deep 808 sub-bass glides, syncopated shaker accents)" },
      { id: "ib_lat_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Atmospheric synth plucks, ascending sub-bass glides, rising anticipation)" },
      { id: "ib_lat_4", type: "chorus", label: "Chorus 1", text: "(Heavy percussive dembow punch, resonant sub-bass, bright melodic guitar lead)" },
      { id: "ib_lat_5", type: "verse", label: "Verse 2", text: "(Dembow rimshots, smooth trumpet countermelody, muted nylon guitar)" },
      { id: "ib_lat_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Accelerating snare build, rising synth sweeps, filtered brass stabs)" },
      { id: "ib_lat_7", type: "chorus", label: "Chorus 2", text: "(Heavy bass impact, crisp dembow cadence, layered melodic hooks)" },
      { id: "ib_lat_8", type: "breakdown", label: "Bridge", text: "(Half-time romantic breakdown, solo acoustic Spanish guitar plucks, isolated sub thuds)" },
      { id: "ib_lat_9", type: "solo", label: "Solo", text: "(Spanish nylon guitar solo, rapid flamenco rasgueados, legato runs, natural reverb)" },
      { id: "ib_lat_10", type: "chorus", label: "Chorus 3", text: "(Flamenco guitar licks, full pounding dembow percussion section)" },
      { id: "ib_lat_11", type: "outro", label: "Outro", text: "(Dembow tape delay decay, solitary Spanish guitar arpeggios, quiet silence)" }
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
    vocal_lead: "Airy, ethereal female soprano vocal with sustained notes, stereo ping-pong delays, vocoder harmonies, and wordless melodic runs.",
    instrumental_lead: "Pumping four-on-the-floor kick, rolling 16th bassline, lush supersaw chords, plucky arpeggios.",
    arrangement: "Primary: Lush progressive supersaw chords and a rolling 16th-note analog bassline drive the celestial progression. Secondary: A pumping four-on-the-floor kick with sidechain compression, sparkling arpeggiated plucks, accelerating snare risers, and white noise sweeps create euphoric dynamic lifts.",
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
      { id: "ib_hou_1", type: "intro", label: "Intro", text: "(Analog pluck melody, wide stereo delay, warm ethereal synthesizer pad)" },
      { id: "ib_hou_2", type: "verse", label: "Verse 1", text: "(Deep four-on-the-floor kick, rolling 16th-note sub-bassline, closed hi-hats)" },
      { id: "ib_hou_3", type: "pre-chorus", label: "Build-Up 1", text: "(Accelerating snare roll, opening supersaw cutoff filter, rising white noise sweep)" },
      { id: "ib_hou_4", type: "chorus", label: "Drop 1", text: "(Pounding kick, pumping sidechain bassline, soaring wide supersaw lead)" },
      { id: "ib_hou_5", type: "verse", label: "Verse 2", text: "(Driving kick and bass groove, syncopated synth arp counterpoint)" },
      { id: "ib_hou_6", type: "pre-chorus", label: "Build-Up 2", text: "(Rising trance synths, accelerating percussion rolls, sub pitch automation)" },
      { id: "ib_hou_7", type: "chorus", label: "Drop 2", text: "(Roaring supersaw chords, heavy low-end impact, energetic open hi-hat sizzle)" },
      { id: "ib_hou_8", type: "breakdown", label: "Breakdown", text: "(Majestic piano chords, soaring ambient pads, vast reverb wash)" },
      { id: "ib_hou_9", type: "solo", label: "Solo", text: "(High-register synth lead solo, emotional arpeggios, dynamic filter sweeps, delay feedback)" },
      { id: "ib_hou_10", type: "chorus", label: "Drop 3", text: "(Full supersaw power, driving 124 BPM rhythm section, melodic arpeggios)" },
      { id: "ib_hou_11", type: "outro", label: "Outro", text: "(Fading synth chords, gentle tape delay repeats, dissipation into space)" }
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
    vocal_lead: "Punchy, rhythmic tenor vocal with falsetto chorus ad-libs, group backing vocals on hooks, brass-stab vocal syncopation, and pure soul.",
    instrumental_lead: "Slap bass with envelope filter, chicken-scratch Stratocaster guitar, tight punchy horn section.",
    arrangement: "Primary: An envelope-filtered slap bassline and chicken-scratch Stratocaster guitar on the upbeats define the boogie funk foundation. Secondary: Tight four-on-the-floor disco kicks, syncopated handclaps on 2 and 4, punchy horn section fanfares, and vintage Minimoog bass stabs deliver buoyant dance energy.",
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
      { id: "ib_fnk_1", type: "intro", label: "Intro", text: "(Punchy slap bass riff, envelope filter, chicken-scratch Stratocaster upbeats)" },
      { id: "ib_fnk_2", type: "verse", label: "Verse 1", text: "(Four-on-the-floor disco kick, syncopated handclaps on 2 and 4, Fender Rhodes comping)" },
      { id: "ib_fnk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Sharp syncopated horn stabs, walking bassline, buoyant momentum)" },
      { id: "ib_fnk_4", type: "chorus", label: "Chorus 1", text: "(Fat funk bassline, triumphant brass fanfare, rhythm guitar scratches, open hi-hats)" },
      { id: "ib_fnk_5", type: "verse", label: "Verse 2", text: "(Thumb-slap bass groove, auto-wah clavinet counter-rhythms)" },
      { id: "ib_fnk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Call-and-response horn stabs, guitar licks, cowbell percussion build)" },
      { id: "ib_fnk_7", type: "chorus", label: "Chorus 2", text: "(Driving disco beat, rich brass chord hits, relentless slap bass bounce)" },
      { id: "ib_fnk_8", type: "bridge", label: "Bridge", text: "(Solo envelope-filter slap bass, isolated acoustic kick, handclaps on 2 and 4)" },
      { id: "ib_fnk_9", type: "solo", label: "Solo", text: "(Gritty saxophone solo, overblown notes, rapid blues runs, syncopated stabs)" },
      { id: "ib_fnk_10", type: "chorus", label: "Chorus 3", text: "(Soaring saxophone, full horn ensemble, slap bass, driving disco rhythm)" },
      { id: "ib_fnk_11", type: "outro", label: "Outro", text: "(Funky slap-bass vamp, horn stabs, final hit on the one)" }
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
    vocal_lead: "Dynamic male vocal transitioning from whispered baritone verses to gravelly, screaming choruses with full chest resonance and emotional strain.",
    instrumental_lead: "Distorted Gibson Les Paul power chords through vintage Marshall stacks, heavy thumping live drums, driving fuzz bass.",
    arrangement: "Primary: Heavy distorted Gibson Les Paul power chords through vintage Marshall stacks and driving fuzz basslines anchor the grunge dynamic. Secondary: Thumping live acoustic drum kits, brooding clean-chorus guitar picking in the verses, and screaming harmonic feedback build explosive catharsis.",
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
      { id: "ib_rck_1", type: "intro", label: "Intro", text: "(Clean electric guitar, subtle chorus, brooding arpeggio, tube amp hum)" },
      { id: "ib_rck_2", type: "verse", label: "Verse 1", text: "(Gritty fuzz bassline, unhurried acoustic drum beats, sparse rimshots)" },
      { id: "ib_rck_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Harmonic feedback swell, crashing cymbals, building distortion)" },
      { id: "ib_rck_4", type: "chorus", label: "Chorus 1", text: "(Distorted power chords, thumping live drums, thick overdriven bass)" },
      { id: "ib_rck_5", type: "verse", label: "Verse 2", text: "(Brooding clean guitars, rumbling fuzz bass, subtle guitar feedback)" },
      { id: "ib_rck_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Floor tom rolls, swelling guitar distortion, maximum gain crescendo)" },
      { id: "ib_rck_7", type: "chorus", label: "Chorus 2", text: "(Crushing Les Paul riffs, wide open crash cymbals, driving grunge rhythm)" },
      { id: "ib_rck_8", type: "bridge", label: "Bridge", text: "(Clean guitar plucks, isolated pulsating bass notes, open room ambiance)" },
      { id: "ib_rck_9", type: "solo", label: "Solo", text: "(Alternative rock guitar solo, screaming bends, heavy wah-wah, feedback sustain)" },
      { id: "ib_rck_10", type: "chorus", label: "Chorus 3", text: "(Layered guitar tracks, pounding drum fills, maximum emotional intensity)" },
      { id: "ib_rck_11", type: "outro", label: "Outro", text: "(Final ringing power chord, warm harmonic amp feedback, tape delay decay to silence)" }
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
    vocal_lead: "Dramatic soprano solo with operatic vibrato, layered SATB cinematic choir chanting in Latin cadence, and soaring choral crescendos.",
    instrumental_lead: "Full symphonic string section, French horn brass fanfare, massive cinematic Taiko drums, orchestral harp.",
    arrangement: "Primary: A full symphonic string section playing 16th-note spiccato ostinatos and noble French horn brass fanfares establish the monumental theme. Secondary: Booming cinematic Taiko drums, concert harp arpeggios, solo cello countermelodies, and soaring violin lines build majestic emotional power.",
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
      { id: "ib_orc_1", type: "intro", label: "Intro", text: "(Orchestral cellos and contrabasses, somber minor chords, harp arpeggios, distant timpani rolls)" },
      { id: "ib_orc_2", type: "verse", label: "Verse 1", text: "(16th-note spiccato string ostinato, noble French horn fanfares, deep sub-brass pulses)" },
      { id: "ib_orc_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Thunderous Taiko drum hits, ascending violin counterpoint, brass swells)" },
      { id: "ib_orc_4", type: "chorus", label: "Chorus 1", text: "(Full brass ensemble, soaring first violins, massive percussion impacts, cymbal washes)" },
      { id: "ib_orc_5", type: "verse", label: "Verse 2", text: "(Spiccato strings, sweeping solo cello melody, wide stereo reverb)" },
      { id: "ib_orc_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Snare ensemble, orchestral field drums, militaristic brass crescendo)" },
      { id: "ib_orc_7", type: "chorus", label: "Chorus 2", text: "(Trumpet fanfare, sweeping string countermelodies, deep orchestral bass drums)" },
      { id: "ib_orc_8", type: "bridge", label: "Bridge", text: "(Concert harp arpeggios, warm French horn chords, cavernous cathedral reverb)" },
      { id: "ib_orc_9", type: "solo", label: "Solo", text: "(Solo violin performance, impassioned neo-classical runs, expressive vibrato, dynamic trills)" },
      { id: "ib_orc_10", type: "chorus", label: "Chorus 3", text: "(Tutti orchestra, solo violin counterpoint, thunderous Taiko rolls, blazing brass)" },
      { id: "ib_orc_11", type: "outro", label: "Outro", text: "(Decaying orchestral chord, cathedral reverb tails, solitary low cello notes, harp chime to silence)" }
    ]
  });
})(window);