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
    id: "ukg_london_garage",
    title: "South London 2-Step",
    genre: "UK Garage",
    subgenre: "UK Garage / 2-Step Bassline",
    bpm: 134,
    key: "A minor",
    mood: "Bouncy, swaggering, infectious, late-night, slick.",
    vocals: "Slick British male sing-rap tenor with conversational delivery and rapid syncopated cadences. Paired with pitched-up female soul vocal chops, call-and-response ad-libs, and tape-delayed hook throws.",
    arrangement: "Shuffle-quantized 2-step kick and crisp rimshot groove anchor the bounce. Warped FM Donk bassline provides punchy low-end motion around warm Fender Rhodes chords, vinyl crackle, and filtered delay sweeps.",
    blocks: [
      { id: "b_ukg_1", type: "intro", label: "Intro", text: "Yeah, South London in the building\nTuneBloom two-step in full effect\nCheck the swing on the hi-hats\n(Rewind!)\n(Selecta, let the bass bounce!)" },
      { id: "b_ukg_2", type: "verse", label: "Verse 1", text: "Step in the venue, air smelling sweet\nBouncers on the door, people dancing in the street\nTwo-step groove got the ladies looking clean\nBest underground rhythm that you've ever seen\nWhisper in her ear with that London slang\nStep to the bar with the whole damn gang\nChampagne flute overflowing to the brim\nBassline warped and it's looking real grim\nShoes looking fresh, got the Prada on lock\nDancing with my lady till it's five on the clock" },
      { id: "b_ukg_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Feel that swing when the snare hits late\nLondon city lifestyle determining our fate\nStep to the left, then you pivot on the right\nWe are taking over the entire UK night\n(Rewind!)\n(Drop the Donk!)" },
      { id: "b_ukg_4", type: "chorus", label: "Chorus 1", text: "South London two-step bouncing in the chest\nEverybody knowing that the UK is the best\nBassline warped, got the speakers in a spin\nChampagne popping, another major win\n(Yeah, two-step!)\n(Keep that shuffle tight!)\n(Oi! Let's go!)" },
      { id: "b_ukg_5", type: "verse", label: "Verse 2", text: "From Brixton to Hackney, we shut down the place\nSeeing all the joy written on every single face\nDJ on the decks with the vinyl slipmat\nCatching every single lyric just like that\nTwo-tone jacket with the zip pulled high\nWatching all the luxury vehicles drive by\nGot that rhythm locked right inside the blood\nRising up together straight out of the mud" },
      { id: "b_ukg_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Feel that swing when the snare hits late\nLondon city lifestyle determining our fate\nStep to the left, then you pivot on the right\nWe are taking over the entire UK night" },
      { id: "b_ukg_7", type: "chorus", label: "Chorus 2", text: "South London two-step bouncing in the chest\nEverybody knowing that the UK is the best\nBassline warped, got the speakers in a spin\nChampagne popping, another major win" },
      { id: "b_ukg_8", type: "bridge", label: "Bridge", text: "Pull up the selector, let the vocal chop play\nWe don't care what anybody has to say\nFrom the pirate radio tower in the sky\nKeeping the authentic underground vibe high\n(Pull it up!)\n(Rewind that track!)" },
      { id: "b_ukg_9", type: "solo", label: "Solo", text: "(Oi!)\n(Check the bass!)\n(Rewind!)\n(Let it swing!)" },
      { id: "b_ukg_10", type: "chorus", label: "Chorus 3", text: "South London two-step bouncing in the chest\nEverybody knowing that the UK is the best\nBassline warped, got the speakers in a spin\nChampagne popping, another major win\n(Oi! UK Garage Master!)" },
      { id: "b_ukg_11", type: "outro", label: "Outro", text: "Proper two-step\nTuneBloom London Master\nCatch you on the next block\nDone\n(Rewind)" }
    ],
    instrumental_blocks: [
      { id: "ib_ukg_1", type: "intro", label: "Intro", text: "(Filtered Rhodes chords with subtle vinyl crackle and distant vocal formant chops introduce the groove over a ticking swung hi-hat)" },
      { id: "ib_ukg_2", type: "verse", label: "Verse 1", text: "(Warped FM Donk bassline enters on the offbeat with punchy syncopated 2-step rimshot and crisp shaker shuffle)" },
      { id: "ib_ukg_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Rising bandpass-filtered synth stabs and syncopated snare rolls build dynamic tension toward the reload drop)" },
      { id: "ib_ukg_4", type: "chorus", label: "Chorus 1", text: "(Full 2-step drop with deep sub-bass glide, resonant FM bass stabs, bright swung open hats, and lush Rhodes staccato chords)" },
      { id: "ib_ukg_5", type: "verse", label: "Verse 2", text: "(Percussion strips back to kick, rim, and sub-bass while a clean jazz guitar plucks muted counterpoint phrases)" },
      { id: "ib_ukg_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Tape delay sweeps and ascending bass runs build rhythmic momentum with syncopated triplet hi-hat skips)" },
      { id: "ib_ukg_7", type: "chorus", label: "Chorus 2", text: "(Energetic UKG drop featuring bouncing bassline interplay, wide stereo synth chords, and relentless syncopated groove)" },
      { id: "ib_ukg_8", type: "bridge", label: "Bridge", text: "(Half-time breakdown with solo lush electric piano chords, isolated sub-bass warmth, and ambient vinyl flutter)" },
      { id: "ib_ukg_9", type: "solo", label: "Solo", text: "(Warped analog bass synth solos aggressively with resonant filter sweeps, pitch bends, and rapid syncopated stabs)" },
      { id: "ib_ukg_10", type: "chorus", label: "Chorus 3", text: "(Peak garage energy with layered bass melodies, full shuffle percussion, horn stabs, and wide stereo atmosphere)" },
      { id: "ib_ukg_11", type: "outro", label: "Outro", text: "(Drums dissolve into dub delay echoes, leaving solitary warm Rhodes chords to decay smoothly into silence)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "amapiano_johannesburg_pulse",
    title: "Johannesburg Night Groove",
    genre: "Amapiano",
    subgenre: "Deep Soulful Amapiano / Log Drum Heat",
    bpm: 113,
    key: "Ab minor",
    mood: "Hypnotic, spiritual, soulful, deep-grooving, warm.",
    vocals: "Soulful Zulu and English female lead chants with warm, breathy delivery. Supported by rich jazzy vocal harmonies, call-and-response phrases, and rhythmic chant ad-libs.",
    arrangement: "Signature percussive resonant log drums with complex polyrhythmic rolls anchor the low end. Accompanied by warm jazzy grand piano chords, syncopated shaker loops, deep analog sub bass, and airy string pads.",
    blocks: [
      { id: "b_ama_1", type: "intro", label: "Intro", text: "Yelele... Woza!\nTuneBloom Amapiano\nLet the log drum breathe, Jo'burg style\nSiyaphambili, halala, asambe!\n(Yelele mama, yelele baba)\n(Woza, woza, woza!)" },
      { id: "b_ama_2", type: "verse", label: "Verse 1", text: "Midnight cool air falling on the city\nDancing till the morning with my baby pretty\nDeep bass taking all the weight off the mind\nPrettiest groove that you ever could find\nMove to the left then you shift to the right\nLighting the fire in the middle of night\nEverybody know say the music is pure\nNatural medicine, ultimate cure\nFrom Soweto streets to the Sandton lights\nWe celebrate the rhythm of African nights\nDrink in the hand and the soul feeling free\nNothing in this world that I'd rather be" },
      { id: "b_ama_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Woza weekend, woza dance\nGive the heavy rhythm a chance\nFeel the sub hitting down in the chest\nSouth African sound is the absolute best\nShaker is moving and keeping the time\nHarmonies ringing so pure and sublime\n(Woza, woza, asambe sonke!)" },
      { id: "b_ama_4", type: "chorus", label: "Drop 1", text: "Woza! Asambe!\n(Yelele mama, asambe!)\n(Woza, woza, woza!)\n(Halala, halala!)\n(Asambe sonke, siyaya!)\n(Woza! Asambe!)" },
      { id: "b_ama_5", type: "verse", label: "Verse 2", text: "Table filled with laughter, friends all around\nLost inside the beauty of the piano sound\nNo trouble, no drama, we keeping it clean\nSmoothest vibration the world's ever seen\nTake a little sip, let the melody glide\nNothing to hold back, nowhere to hide\nLog drum rolling with intricate rolls\nHealing the spirit and freeing our souls\nJoy in our eyes as the morning comes near\nLifting away every burden and fear\nDance with me now till the sun starts to rise\nPure golden light in the African skies" },
      { id: "b_ama_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Woza weekend, woza dance\nGive the heavy rhythm a chance\nFeel the sub hitting down in the chest\nSouth African sound is the absolute best\nShaker is moving and keeping the time\nHarmonies ringing so pure and sublime\n(Halala! Siyaya!)" },
      { id: "b_ama_7", type: "chorus", label: "Drop 2", text: "Woza! Halala!\n(Halala, halala, asambe!)\n(Hey! Hey! Hey!)\n(Yelele mama, siyaphambili!)\n(Woza, woza, Jo'burg heat!)\n(Asambe sonke!)" },
      { id: "b_ama_8", type: "instrumental", label: "Breakdown", text: "When the night is deep and still\nFeel the space that spirit fill\nMusic is life, music is peace\nLet the good vibration never cease\nHold hands together and look at the sky\nWatching the constellations rolling on by\n(Peace in our hearts, love in the sound)" },
      { id: "b_ama_9", type: "solo", label: "Solo", text: "(Yelele...)\n(Woza mama!)\n(Halala, halala!)\n(Asambe!)" },
      { id: "b_ama_10", type: "chorus", label: "Drop 3", text: "Asambe sonke!\n(Woza! Asambe!)\n(Yelele mama, halala!)\n(Jo'burg vibration!)\n(Woza! Halala!)" },
      { id: "b_ama_11", type: "outro", label: "Outro", text: "Yelele... Johannesburg\nTuneBloom Master\nSiyabonga kakhulu\nPeace and love\n(Halala... asambe)" }
    ],
    instrumental_blocks: [
      { id: "ib_ama_1", type: "intro", label: "Intro", text: "(Spacious jazzy grand piano voicings glide over a continuous African shaker loop and deep warm sub-bass pad)" },
      { id: "ib_ama_2", type: "verse", label: "Verse 1", text: "(Signature resonant log drum enters with complex polyrhythmic rolls, syncopated rim accents, and warm low-end thumps)" },
      { id: "ib_ama_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Percussive log drum triplets build dynamic momentum while sustained string pads swell beneath the piano chord progression)" },
      { id: "ib_ama_4", type: "chorus", label: "Drop 1", text: "(Full hypnotic Amapiano drop with thumping sub kick, pitch-bending log drum bassline, and syncopated woodblock accents)" },
      { id: "ib_ama_5", type: "verse", label: "Verse 2", text: "(Arrangement breathes with delicate piano counter-motifs, subtle log drum ghost notes, and constant steady shaker movement)" },
      { id: "ib_ama_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Rolling log drum fills accelerate alongside ascending piano arpeggios, creating deep spiritual anticipation)" },
      { id: "ib_ama_7", type: "chorus", label: "Drop 2", text: "(Powerful percussive climax featuring dual interlocking log drum layers, rich piano stabs, and expansive stereo presence)" },
      { id: "ib_ama_8", type: "bridge", label: "Breakdown", text: "(Deep meditative breakdown stripping away percussion to leave solitary resonant grand piano chords and warm sub-bass air)" },
      { id: "ib_ama_9", type: "solo", label: "Solo", text: "(Acoustic grand piano solos with fluid jazz runs, expressive grace notes, syncopated octave leaps, and natural room dynamics)" },
      { id: "ib_ama_10", type: "chorus", label: "Drop 3", text: "(Ultimate rhythmic release combining virtuosic piano improvisation with driving log drum rolls and full percussion pocket)" },
      { id: "ib_ama_11", type: "outro", label: "Outro", text: "(Log drums taper off gradually, leaving solitary gentle piano chords and distant shaker loops fading into warmth)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "jersey_club_heartbeat",
    title: "Jersey Heartbeat",
    genre: "Dance",
    subgenre: "Jersey Club / Hyperactive Bounce",
    bpm: 138,
    key: "C major",
    mood: "Energetic, frantic, bounce-heavy, club-ready, infectious.",
    vocals: "High-energy rhythmic male hype vocals with aggressive chopped stabs, pitched vocal micro-samples, and rapid call-and-response party chants.",
    arrangement: "Signature 5-beat Jersey club kick pattern, bed-squeak sample on 2 and 4, hyperactive sub-bass drops, sliced vocal loops, and bright synth chords.",
    blocks: [
      { id: "b_jcb_1", type: "intro", label: "Intro", text: "Jersey! TuneBloom in the mix!\nPut your hands up, let's get it!\nRock your hips, rock your hips!\nNewark to Philly, you know what time it is!\n(Go! Go! Go! Let's go!)" },
      { id: "b_jcb_2", type: "verse", label: "Verse 1", text: "Step in the circle, show 'em what you got\nTaking the rhythm and making it hot\nLeft foot, right foot, hit the floor\nEverybody screaming and asking for more\nBassline bumping right in the chest\nJersey club bounce is the absolute best\nFast tempo moving, never gon' stall\nTaking the party and rocking the hall\nGot the whole club jumping on beat\nFeel that sub-bass under your feet\nHands to the ceiling, let your body shake\nBest vibration that we ever could make" },
      { id: "b_jcb_3", type: "pre-chorus", label: "Build-Up 1", text: "Work it, work it, let it go!\nThree, two, one, hit the floor!\n(Work it! Work it! Faster!)\n(Three! Two! One! Let's go!)" },
      { id: "b_jcb_4", type: "chorus", label: "Drop 1", text: "Rock that body! Shake that ass!\nPut the whole party right on blast!\n(Work! Work! Rock that body!)\n(Shake that ass! Go! Go!)\n(Hit the floor! Let's get it!)\n(Jersey bounce!)" },
      { id: "b_jcb_5", type: "verse", label: "Verse 2", text: "Sweat on the forehead, energy peaked\nGiving them everything they came to seek\nDJ spinning the hottest release\nMaking the excitement never decrease\nTurn up the monitors, let it all bang\nRep for the city and rep for the gang\nHands to the ceiling, feet off the ground\nNobody messing with Jersey sound\nDouble time kick drum rattling the space\nLighting up a smile on everybody's face" },
      { id: "b_jcb_6", type: "pre-chorus", label: "Build-Up 2", text: "Work it, work it, let it go!\nThree, two, one, hit the floor!\n(Work it! Work it! Turn it up!)\n(Three! Two! One! Let's go!)" },
      { id: "b_jcb_7", type: "chorus", label: "Drop 2", text: "Break it down! Let's go!\n(Rock! Rock! Hit the floor!)\n(Rock your hips! Shake that ass!)\n(Put the whole room on blast!)\n(Go! Go! Go! Go!)" },
      { id: "b_jcb_8", type: "instrumental", label: "Breakdown", text: "Jersey vibe in the atmosphere\nMaking it crystal clean and clear\nWhen the kick drum hits the floor\nYou already know what we came here for\nTake a quick breath, get ready to roll\nJersey club rhythm taking control" },
      { id: "b_jcb_9", type: "pre-chorus", label: "Build-Up 3", text: "All my people make some noise!\nTurn up the power for the girls and boys!\nThree... two... one... let's go!" },
      { id: "b_jcb_10", type: "chorus", label: "Drop 3", text: "Rock your hips! Shake that ass!\nJersey Master in the class!\n(Work it! Let's go! Rock it out!)\n(Maximum bounce!)\n(Go! Go! Go! Go!)" },
      { id: "b_jcb_11", type: "outro", label: "Outro", text: "Yeah! TuneBloom Jersey Club Master\nDrop that beat to a dead stop\nNewark stand up\nDrop\n(Work!)" }
    ],
    instrumental_blocks: [
      { id: "ib_jcb_1", type: "intro", label: "Intro", text: "(Bright staccato synthesizer chords play high-energy party progression alongside ticking 16th-note hi-hats)" },
      { id: "ib_jcb_2", type: "verse", label: "Verse 1", text: "(Signature 5-beat Jersey club kick pattern drops in with bed-squeak sample on 2 and 4 and rapid sub-bass stabs)" },
      { id: "ib_jcb_3", type: "pre-chorus", label: "Build-Up 1", text: "(Snare rolls double in tempo into 32nd-note rolls while high-pass filters open rapidly and sub bass pitch bends upward)" },
      { id: "ib_jcb_4", type: "chorus", label: "Drop 1", text: "(Explosive Jersey club drop with heavy 5-beat kick pattern, thunderous low-end drops, cutting synth brass, and bright crash cymbals)" },
      { id: "ib_jcb_5", type: "verse", label: "Verse 2", text: "(Rhythm skips into syncopated triplet kick variations while an arpeggiated synth lead dances across the stereo field)" },
      { id: "ib_jcb_6", type: "pre-chorus", label: "Build-Up 2", text: "(Fast-paced snare accelerations and rising white noise risers drive peak dynamic tension toward the second drop)" },
      { id: "ib_jcb_7", type: "chorus", label: "Drop 2", text: "(Maximum-intensity bounce drop with distorted sub-bass drops, piercing synth chords, and hyperactive sample triggers)" },
      { id: "ib_jcb_8", type: "bridge", label: "Breakdown", text: "(Half-time rhythmic interlude stripping the kick pattern down to bed-squeak accents, sub drone, and filtered synth chords)" },
      { id: "ib_jcb_9", type: "solo", label: "Solo", text: "(Frenetic lead synthesizer solos with high-speed pitch bends, rapid staccato arpeggiation, and wide stereo delay)" },
      { id: "ib_jcb_10", type: "chorus", label: "Drop 3", text: "(Final frantic drop featuring full 5-beat kick fury, thunderous sub impact, and continuous bright synth riffs)" },
      { id: "ib_jcb_11", type: "outro", label: "Outro", text: "(Beat abruptly cuts to a lone bed-squeak sample and a final clean low-end 808 sub thump to complete silence)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "afropop_lagos_vibrations",
    title: "Lagos Nightfall",
    genre: "Afropop",
    subgenre: "Afrobeats / Lagos Highlife Bounce",
    bpm: 104,
    key: "F# major",
    mood: "Infectious, joyful, seductive, rhythmic, celebratory.",
    vocals: "Silky Nigerian Pidgin and English melodic tenor with effortless rhythmic cadence. Supported by catchy call-and-response vocal chants and lush African choir harmonies.",
    arrangement: "Bright clean African electric guitar plucks playing melodic highlife riffs, syncopated Shekere shakers, resonant log drum accents, rich warm bassline, and brass stabs.",
    blocks: [
      { id: "b_afr_1", type: "intro", label: "Intro", text: "Oshey! TuneBloom sound\nOmo, listen to the groove\nKilode? Na the vibe we dey give them tonight\nYeah, make we start am\nFrom Lagos island straight to the world\n(Let's go! Oshey!)" },
      { id: "b_afr_2", type: "verse", label: "Verse 1", text: "Fine girl from the mainland moving sweet\nHer waistline vibrating down to the beat\nShe tell me say na my melody she want\nNobody fit do the things that we stunt\nBottles on the table, champagne dey flow\nEvery single corner catching the glow\nNo time for the bad belle people at all\nWe just dey answer to the blessings we call\nBody dey sweet me, ginger dey body\nCome make we dance and enjoy this party\nRoll that waistline make you show them the style\nPut on a beautiful African smile" },
      { id: "b_afr_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Oya shake am, roll am, give me that wine\nEvery single rhythm design so divine\nFeel the heat in the room, temperature high\nReaching straight to the African sky\nNobody fit bring the energy down\nWe be the finest people in town\n(Oshey! Oya!)" },
      { id: "b_afr_4", type: "chorus", label: "Chorus 1", text: "Lagos vibrations inside my soul\nThis heavy rhythm done take control\nGirl your body bad, you dey make me lose my head\nEverything sweet like the butter and the bread\n(Oya dance, oya move, make you feel the sound)\n(Best vibrations in the whole damn town)\n(Oshey, oshey, give them the vibe!)" },
      { id: "b_afr_5", type: "verse", label: "Verse 2", text: "From Victoria Island down to the beach\nThere's no height that our rhythm cannot reach\nShe whisper in my ear say make I no stop\nSay na this master tune go take the top\nBassline rolling like the ocean tide\nGot the baddest lady right by my side\nWe no dey look back, we dey focus ahead\nLiving up the dream like the wise man said\nMoney in the bank and the spirit feeling blessed\nAfrican beauty beating down in the chest" },
      { id: "b_afr_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Oya shake am, roll am, give me that wine\nEvery single rhythm design so divine\nFeel the heat in the room, temperature high\nReaching straight to the African sky\nNobody fit bring the energy down\nWe be the finest people in town" },
      { id: "b_afr_7", type: "chorus", label: "Chorus 2", text: "Lagos vibrations inside my soul\nThis heavy rhythm done take control\nGirl your body bad, you dey make me lose my head\nEverything sweet like the butter and the bread\n(Oya dance, oya move, make you feel the sound)\n(Best vibrations in the whole damn town)" },
      { id: "b_afr_8", type: "bridge", label: "Bridge", text: "Ehn ehn, take it down easy\nLet the sweet horn section blow breezy\nNobody can kill this natural vibe\nOne love for the entire tribe\nFrom Nigeria to Ghana, Jamaica to the UK\nCelebrate the music each and every day\n(One love! Oshey!)" },
      { id: "b_afr_9", type: "solo", label: "Solo", text: "(Oya!)\n(Sweet vibration!)\n(Kilode!)\n(Oshey!)" },
      { id: "b_afr_10", type: "chorus", label: "Chorus 3", text: "Lagos vibrations inside my soul\nThis heavy rhythm done take control\nGirl your body bad, you dey make me lose my head\nEverything sweet like the butter and the bread\n(Oya dance, oya move, make you feel the sound)\n(Best vibrations in the whole damn town)" },
      { id: "b_afr_11", type: "outro", label: "Outro", text: "Yeah... Lagos to the world\nOshey!\nTuneBloom Master\nBlessings on blessings\nDone" }
    ],
    instrumental_blocks: [
      { id: "ib_afr_1", type: "intro", label: "Intro", text: "(Sparkling clean African electric guitar plucks highlife melodic riffs over delicate Shekere shaker and warm Rhodes chords)" },
      { id: "ib_afr_2", type: "verse", label: "Verse 1", text: "(Bouncy Afrobeats kick and rimshot groove drop into the pocket, anchored by a melodic, rolling electric bassline)" },
      { id: "ib_afr_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Horn section swells gently with warm brass stabs while conga fills and log drum accents build celebratory momentum)" },
      { id: "ib_afr_4", type: "chorus", label: "Chorus 1", text: "(Full joyful Lagos drop with punchy kick, vibrant highlife guitar lead, warm brass countermelodies, and driving percussion)" },
      { id: "ib_afr_5", type: "verse", label: "Verse 2", text: "(Guitar switches to muted syncopated picking while a secondary electric guitar plays soaring legato licks in the right channel)" },
      { id: "ib_afr_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Percussion section accelerates with polyrhythmic talking drum accents and ascending brass fanfare)" },
      { id: "ib_afr_7", type: "chorus", label: "Chorus 2", text: "(Climactic African groove drop featuring layered guitar counterpoints, deep resonant bass, and infectious dance rhythm)" },
      { id: "ib_afr_8", type: "bridge", label: "Bridge", text: "(Subtractive breakdown highlighting acoustic fingerpicked guitar, soft shaker rhythms, and warm saxophone phrases)" },
      { id: "ib_afr_9", type: "solo", label: "Solo", text: "(Lush brass section and clean electric guitar trade virtuosic highlife melodies with sweet vibrato and slides)" },
      { id: "ib_afr_10", type: "chorus", label: "Chorus 3", text: "(Final celebratory explosion of sound with full horns, dual guitars, driving bassline, and complete percussive section)" },
      { id: "ib_afr_11", type: "outro", label: "Outro", text: "(Percussion gradually subsides, leaving a solitary clean guitar riff and decaying warm reverb tails to fade out)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "trapsoul_henny_tears",
    title: "Henny & Midnight Thoughts",
    genre: "R&B",
    subgenre: "TrapSoul / Dark Alternative R&B",
    bpm: 82,
    key: "D minor",
    mood: "Introspective, moody, toxic-romance, vulnerable, atmospheric.",
    vocals: "Dark, reverb-heavy male R&B vocal blending smooth singing with melancholic melodic sing-rap, deep pitch-shifted backing ad-libs, and intimate breathy delivery.",
    arrangement: "Distorted 808 sub-bass, underwater filtered Rhodes chords, reverse vocal chops, crisp tight trap snare, and ambient vinyl crackle.",
    blocks: [
      { id: "b_ts_1", type: "intro", label: "Intro", text: "Yeah, three AM again...\nDrinking Henny straight out the bottle, thinking 'bout you\nShit never changes, does it?\nPhone ringing off the hook, but I can't even pick up\nYeah, listen\n(Late nights in the studio)" },
      { id: "b_ts_2", type: "verse", label: "Verse 1", text: "Phone glowing on the nightstand screen\nYou texting me like you don't know what it mean\nSaying you miss how we used to connect\nWhile you out with someone that you don't respect\nI take a sip let the burn hit my chest\nTrying my hardest to put you to rest\nKnow I was wrong for the things that I did\nActed too reckless, behaved like a kid\nNow I'm in the studio pouring my heart\nWatching the pieces all falling apart\nSmoke in the air and it's clouding my vision\nLiving with every damn broken decision" },
      { id: "b_ts_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Toxic love running deep in my veins\nBoth of us addicted to playing these games\nYou know you're the one that I shouldn't be calling\nEvery single time that the evening is falling\nPulling me under, you got that control\nTaking a piece of my mind and my soul\n(Yeah, piece of my soul)" },
      { id: "b_ts_4", type: "chorus", label: "Chorus 1", text: "Henny and midnight thoughts got me fucked up\nPouring more liquor inside of my cup\nYou got that body that I can't replace\nCan't get the memory out of my face\nSay that you hate me then pull up at four\nLeaving your clothes on the hardwood floor\nToxic as hell but you know that it's real\nNobody else make me feel how I feel\n(Nobody else... yeah)" },
      { id: "b_ts_5", type: "verse", label: "Verse 2", text: "Pulled up to your crib with the headlights off\nRoom full of smoke got you trying not to cough\nYou look at me with that dangerous smile\nSaying you needed me here for a while\nKiss on your neck and you lose all control\nDeep in your eyes I can see in your soul\nWe break every promise we made in the day\nFucking each other's emotions away\nWe know it's wrong but it feels way too good\nDoing the things that we never should\nSun coming up through the blinds on the glass\nKnowing this high isn't going to last" },
      { id: "b_ts_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Toxic love running deep in my veins\nBoth of us addicted to playing these games\nYou know you're the one that I shouldn't be calling\nEvery single time that the evening is falling\nPulling me under, you got that control\nTaking a piece of my mind and my soul" },
      { id: "b_ts_7", type: "chorus", label: "Chorus 2", text: "Henny and midnight thoughts got me fucked up\nPouring more liquor inside of my cup\nYou got that body that I can't replace\nCan't get the memory out of my face\nSay that you hate me then pull up at four\nLeaving your clothes on the hardwood floor\nToxic as hell but you know that it's real\nNobody else make me feel how I feel" },
      { id: "b_ts_8", type: "bridge", label: "Bridge", text: "Why do we always repeat the mistake?\nHow many promises can we still break?\nSun's coming up and the high starts to fade\nLiving with every decision we made\nEmpty glass sitting right next to the bed\nEchoes of everything that we just said\n(Why do we do this?)" },
      { id: "b_ts_9", type: "solo", label: "Solo", text: "(Oh, yeah...)\n(Late night thoughts taking over)\n(Can't get you out of my head)\n(Yeah...)" },
      { id: "b_ts_10", type: "chorus", label: "Chorus 3", text: "Henny and midnight thoughts got me fucked up\nPouring more liquor inside of my cup\nYou got that body that I can't replace\nCan't get the memory out of my face\nSay that you hate me then pull up at four\nLeaving your clothes on the hardwood floor\nToxic as hell but you know that it's real\nNobody else make me feel how I feel" },
      { id: "b_ts_11", type: "outro", label: "Outro", text: "Yeah... three AM thoughts\nTuneBloom Master\nEmpty bottle on the floor\nFade to dark\n(Gone)" }
    ],
    instrumental_blocks: [
      { id: "ib_ts_1", type: "intro", label: "Intro", text: "(Underwater low-pass filtered Rhodes chords ring out over vinyl crackle and distant tape-saturated sub rumble)" },
      { id: "ib_ts_2", type: "verse", label: "Verse 1", text: "(Deep distorted 808 sub-bass glides smoothly under a crisp dry rimshot on 3 and sparse, delayed acoustic guitar notes)" },
      { id: "ib_ts_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Low-pass filter opens slowly on the Rhodes as rolling 32nd-note hi-hats and reverse ambient swell fx build dark tension)" },
      { id: "ib_ts_4", type: "chorus", label: "Chorus 1", text: "(Heavy TrapSoul drop with booming distorted 808 slides, rich Rhodes tremolo chords, tight trap snare, and reverse vocal textures)" },
      { id: "ib_ts_5", type: "verse", label: "Verse 2", text: "(Rhythm strips back to an intimate pocket: solitary sub thuds, crisp rim, and an expressive electric guitar playing legato licks)" },
      { id: "ib_ts_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Ascending bass glides and rolling trap hi-hats create an intoxicating, moody build toward the second hook)" },
      { id: "ib_ts_7", type: "chorus", label: "Chorus 2", text: "(Climactic drop featuring maximum low-end impact, wide stereo Rhodes panning, and somber acoustic guitar motifs)" },
      { id: "ib_ts_8", type: "bridge", label: "Bridge", text: "(Filtered breakdown where the drums vanish, leaving solitary reverbed electric piano chords and decaying vinyl noise)" },
      { id: "ib_ts_9", type: "solo", label: "Solo", text: "(Emotional electric guitar solo with warm neck pickup tone, singing legato bends, and heavy tape delay slapback)" },
      { id: "ib_ts_10", type: "chorus", label: "Chorus 3", text: "(Final immersive drop with the guitar solo weaving over heavy sliding 808s and the full late-night rhythm section)" },
      { id: "ib_ts_11", type: "outro", label: "Outro", text: "(Low-pass filter closes down over the mix, leaving a solitary Rhodes chord and fading sub drone dissolving into the dark)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "dancehall_kingston_heat",
    title: "Kingston Heatwave",
    genre: "Dancehall",
    subgenre: "Modern Dancehall / Bashment Riddim",
    bpm: 100,
    key: "G minor",
    mood: "Carnival, seductive, heavy-hitting, swaggering, raw.",
    vocals: "Authentic Jamaican Patois toaster cadence with aggressive deejay chanting, rapid rhythmic flow, and smooth melodic female hook counterpoint.",
    arrangement: "Heavy 808 dancehall dembow riddim, metallic rimshots, syncopated offbeat synth plucks, dub siren effects, and deep sub-bass drops.",
    blocks: [
      { id: "b_dh_1", type: "intro", label: "Intro", text: "Brap! TuneBloom sound system!\nBig up every dancer inna di dancehall!\nWine up your body, gyal!\nPull up di selector, make the riddim drop heavy!\n(Brap! Brap! Brap!)" },
      { id: "b_dh_2", type: "verse", label: "Verse 1", text: "Gyal a wine to di riddim and she move so tight\nKingston city burning bright tonight\nHeavy bassline a rattle up di entire sound\nBaddest dancers a take over di town\nMi see di waistline a move inna slow motion\nCausing pure trouble and commotion\nStep inna di party with di natural flex\nNobody worry 'bout who coming next\nDiamonds pon di wrist and di Hennessy pour\nEvery single gyal a demand fi some more\nBounce to di bass, let your body vibrate\nKingston champions setting di fate" },
      { id: "b_dh_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Wine up, bend down, touch di floor\nGive di selector something fi adore\nTemperature boiling right to di max\nFull dancehall power, straight facts\nLock down di venue from front to di back\nNobody can stop this aggressive attack\n(Pull up! Brap!)" },
      { id: "b_dh_4", type: "chorus", label: "Chorus 1", text: "Kingston heatwave inna di place!\nWine up your body and set di pace!\nGyal you a win, nobody fit contest\nDancehall champion, you a di best!\n(Wine, wine, wine up your waist)\n(Kingston sound, nobody can replace)\n(Pull up dat riddim again!)" },
      { id: "b_dh_5", type: "verse", label: "Verse 2", text: "Champagne popping and di vibe stay real\nNobody duplicate di way dat we feel\nSound system pumping with maximum bass\nLighting up every single square of di space\nHer body bad, she know she look clean\nFinest queen dat di island ever seen\nMove to di left and then back to di right\nWe mash up di dance till di morning light\nRewind di tape make di people dem scream\nLiving up di authentic Kingston dream" },
      { id: "b_dh_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Wine up, bend down, touch di floor\nGive di selector something fi adore\nTemperature boiling right to di max\nFull dancehall power, straight facts\nLock down di venue from front to di back\nNobody can stop this aggressive attack" },
      { id: "b_dh_7", type: "chorus", label: "Chorus 2", text: "Kingston heatwave inna di place!\nWine up your body and set di pace!\nGyal you a win, nobody fit contest\nDancehall champion, you a di best!" },
      { id: "b_dh_8", type: "bridge", label: "Bridge", text: "Rewind selecta, make it roll again\nFrom Kingston town straight to every friend\nAuthentic energy dat cannot fake\nFeel how di heavy ground start to shake\nBig up Jamaica, big up di world\nEvery rude boy and every bad girl\n(Pull up!)" },
      { id: "b_dh_9", type: "solo", label: "Solo", text: "(Pull up! Brap!)\n(Drop it!)\n(Wine up, gyal!)\n(Full power!)" },
      { id: "b_dh_10", type: "chorus", label: "Chorus 3", text: "Kingston heatwave inna di place!\nWine up your body and set di pace!\nGyal you a win, nobody fit contest\nDancehall champion, you a di best!\n(Pull up dat!)" },
      { id: "b_dh_11", type: "outro", label: "Outro", text: "Brap! Kingston sound\nTuneBloom Dancehall Master\nSelector sign off\nDone\n(Pull up!)" }
    ],
    instrumental_blocks: [
      { id: "ib_dh_1", type: "intro", label: "Intro", text: "(Syncopated metallic offbeat synth skanks establish the dancehall rhythm alongside dub siren effects and tape echo)" },
      { id: "ib_dh_2", type: "verse", label: "Verse 1", text: "(Heavy dembow kick-and-snare pattern drops hard with warm sub-bass glide, sharp metallic rimshots, and dry percussive clicks)" },
      { id: "ib_dh_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Dembow snare rolls accelerate and synth brass stabs build carnival energy toward the selector drop)" },
      { id: "ib_dh_4", type: "chorus", label: "Chorus 1", text: "(Full bashment drop with maximum low-end 808 pressure, piercing offbeat organ chops, and driving syncopated percussion)" },
      { id: "ib_dh_5", type: "verse", label: "Verse 2", text: "(Rhythm strips back to bass and kick while a muted clean electric guitar plays syncopated Jamaican skank chords)" },
      { id: "ib_dh_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Dub laser fx, rolling timbales, and ascending synth sweeps create an unstoppable dancehall crescendo)" },
      { id: "ib_dh_7", type: "chorus", label: "Chorus 2", text: "(Massive sound system drop featuring thunderous sub-bass, cutting brass leads, and energetic polyrhythmic percussion)" },
      { id: "ib_dh_8", type: "bridge", label: "Bridge", text: "(Half-time dub breakdown featuring low-pass filtered organ, isolated sub thuds, and cavernous spring reverb sweeps)" },
      { id: "ib_dh_9", type: "solo", label: "Solo", text: "(High-register synth lead plays agile Caribbean melodies with rapid pitch-bend ornaments and delay repeats)" },
      { id: "ib_dh_10", type: "chorus", label: "Chorus 3", text: "(Final explosive dancehall climax with full dembow kit, screaming synth leads, and maximum harmonic punch)" },
      { id: "ib_dh_11", type: "outro", label: "Outro", text: "(Beat abruptly cuts to a dub siren echo and a solitary descending sub glide that resonates into silence)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "boombap_crate_diggers",
    title: "Crate Diggers Anthem",
    genre: "Hip Hop",
    subgenre: "90s East Coast Boom Bap / Jazz Rap",
    bpm: 92,
    key: "C minor",
    mood: "Gritty, authentic, soulful, head-nodding, focused.",
    vocals: "Crisp rhythmic baritone flow with sharp enunciation and complex internal rhymes. Layered hype ad-libs on bar ends, vocal scratch hooks, and unhurried confidence.",
    arrangement: "Chopped SP-1200 jazz horn samples, crunchy 12-bit acoustic drum break with dirty snare punch, warm filtered upright bassline, and constant needle crackle.",
    blocks: [
      { id: "b_hip_1", type: "intro", label: "Intro", text: "Check the levels on the tape deck\nOne, two... yeah\nDropping the needle on ninety-two\nFrom Queensbridge to Brooklyn, real boom bap\n(Listen close, yeah)\n(Drop the break!)" },
      { id: "b_hip_2", type: "verse", label: "Verse 1", text: "Sifting through the crates in the basement store\nFinding rare gems on the dusty floor\nTwelve-bit textures hitting hard on the one\nMaking classic rhythm till the rising sun\nPen on the notebook, capturing the rhyme\nEvery single syllable is locked in time\nMPC pads and the vinyl crackle\nOvercoming every industry obstacle\nRaw hip-hop straight out the sewer grate\nServing pure knowledge on a dinner plate\nKick drum thumping in your chest real heavy\nRhymes razor sharp and we keeping 'em steady" },
      { id: "b_hip_3", type: "chorus", label: "Hook 1", text: "Keep the rhythm raw, never compromise\nRocking on the beat right before your eyes\nCrate diggers anthem from the underground\nPure authentic feeling in the master sound\n(Check it out! Yeah!)\n(True school hip-hop!)" },
      { id: "b_hip_4", type: "verse", label: "Verse 2", text: "Analog warmth through the vacuum tube\nCutting straight through the surrounding cube\nHeavy bass foundation rattling the trunk\nNothing artificial, just the real raw funk\nKick-snare cadence walking down the block\nSynchronized perfectly to turn the clock\nGraffiti on the train car running down the line\nEvery single bar is a timeless design\nSP-1200 chopping up the horn\nThis is where the golden era sound was born" },
      { id: "b_hip_5", type: "instrumental", label: "Breakdown", text: "Let the groove breathe for a minute\nReal audio craftsmanship with soul inside it\nFilter down the bass, let the needle pop\nTrue hip-hop culture that will never stop\n(Yeah, real hip hop)" },
      { id: "b_hip_6", type: "chorus", label: "Hook 2", text: "Keep the rhythm raw, never compromise\nRocking on the beat right before your eyes\nCrate diggers anthem from the underground\nPure authentic feeling in the master sound" },
      { id: "b_hip_7", type: "verse", label: "Verse 3", text: "Mastering the craft till the break of day\nStacking up the reels in a clean display\nTimeless frequency living in the groove\nGive the people something that can make them move\nNo autotune gimmick, just raw lyricism\nBreaking through the fake with a sonic prism\nNew York state of mind on the master tape\nReal sound artistry taking new shape" },
      { id: "b_hip_8", type: "bridge", label: "Bridge", text: "From the SP pads to the master reel\nYou can never duplicate the way we feel\nHarmonic overtones ringing in the room\nEngineered precision in the sonic bloom\n(Pure craftsmanship!)" },
      { id: "b_hip_9", type: "solo", label: "Solo", text: "(Scratch that!)\n(Cut it up, yeah!)\n(Drop the needle!)\n(One, two, on the one!)" },
      { id: "b_hip_10", type: "chorus", label: "Hook 3", text: "Keep the rhythm raw, never compromise\nRocking on the beat right before your eyes\nCrate diggers anthem from the underground\nPure authentic feeling in the master sound" },
      { id: "b_hip_11", type: "outro", label: "Outro", text: "Fading out on the groove\nClassic master tape finish\nTuneBloom East Coast Master\nPeace out to all the real diggers\n(Peace)" }
    ],
    instrumental_blocks: [
      { id: "ib_hip_1", type: "intro", label: "Intro", text: "(Authentic vinyl needle drop crackle followed by chopped warm jazz trumpet sample loops and isolated upright bass notes)" },
      { id: "ib_hip_2", type: "verse", label: "Verse 1", text: "(Crunchy 12-bit SP-1200 acoustic drum break drops with heavy punchy snare on 2 and 4 and filtered walking upright bass)" },
      { id: "ib_hip_3", type: "chorus", label: "Hook 1", text: "(Full East Coast boom bap groove drops in with rich chopped brass chords, resonant kick drum thumps, and muted Rhodes counterpoint)" },
      { id: "ib_hip_4", type: "verse", label: "Verse 2", text: "(Acoustic upright bass walks smoothly through the chord changes while muted guitar scratches punctuate the drum break)" },
      { id: "ib_hip_5", type: "bridge", label: "Breakdown", text: "(Low-pass filter sweeps down over the drums, highlighting solo warm double bass plucks, tape hiss, and sparse trumpet phrases)" },
      { id: "ib_hip_6", type: "chorus", label: "Hook 2", text: "(Full drum break returns with maximum punch, accompanied by soaring muted jazz saxophone chops and warm piano fills)" },
      { id: "ib_hip_7", type: "verse", label: "Verse 3", text: "(Rhythm section locks into an unhurried golden-era pocket with subtle open hi-hat accents and vintage vinyl atmosphere)" },
      { id: "ib_hip_8", type: "bridge", label: "Bridge", text: "(Delicate vibraphone chords join the upright bass and soft brushed snare, creating deep nostalgic jazz warmth)" },
      { id: "ib_hip_9", type: "solo", label: "Solo", text: "(Expressive muted jazz trumpet solos over the boom bap break, delivering soulful blues inflections and melodic stabs)" },
      { id: "ib_hip_10", type: "chorus", label: "Hook 3", text: "(Final celebratory boom bap release with full horn ensemble chops, heavy head-nodding drum groove, and rich bass)" },
      { id: "ib_hip_11", type: "outro", label: "Outro", text: "(Drums slowly fade out, leaving solitary muted jazz trumpet notes and needle static running out into silence)" }
    ]
  });
})(window);