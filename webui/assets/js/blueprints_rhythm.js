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
    vocal_lead: "Slick British male sing-rap tenor with conversational delivery and rapid syncopated cadences. Paired with pitched-up female soul vocal chops, call-and-response ad-libs, and tape-delayed hook throws.",
    instrumental_lead: "Warped FM Donk bassline, warm Fender Rhodes chords, pitched vocal chop accents.",
    arrangement: "Primary: A warped FM Donk bassline provides punchy low-end motion around warm Fender Rhodes chords and vinyl crackle. Secondary: Shuffle-quantized 2-step kick and crisp rimshot groove anchor the bounce, accented by filtered delay sweeps and syncopated open hi-hat skips.",
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
      { id: "ib_ukg_1", type: "intro", label: "Intro", text: "(Filtered Rhodes chords, vinyl crackle, vocal formant chops, ticking swung hi-hats)" },
      { id: "ib_ukg_2", type: "verse", label: "Verse 1", text: "(Warped FM Donk bassline, offbeat bounce, syncopated 2-step rimshot, shaker shuffle)" },
      { id: "ib_ukg_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Bandpass-filtered synth stabs, syncopated snare rolls, tape delay sweep)" },
      { id: "ib_ukg_4", type: "chorus", label: "Chorus 1", text: "(Deep sub-bass glide, resonant FM bass stabs, swung open hats, Rhodes staccato chords)" },
      { id: "ib_ukg_5", type: "verse", label: "Verse 2", text: "(Kick and rim groove, deep sub-bass, clean muted jazz guitar counterpoint)" },
      { id: "ib_ukg_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Tape delay sweeps, ascending bass runs, syncopated triplet hi-hat skips)" },
      { id: "ib_ukg_7", type: "chorus", label: "Chorus 2", text: "(Bouncing bassline interplay, wide stereo synth chords, relentless syncopated groove)" },
      { id: "ib_ukg_8", type: "bridge", label: "Bridge", text: "(Half-time breakdown, solo electric piano chords, isolated sub-bass warmth, vinyl flutter)" },
      { id: "ib_ukg_9", type: "solo", label: "Solo", text: "(Analog bass synth solo, resonant filter sweeps, pitch bends, rapid syncopated stabs)" },
      { id: "ib_ukg_10", type: "chorus", label: "Chorus 3", text: "(Layered bass melodies, full shuffle percussion, brass stabs, wide stereo ambiance)" },
      { id: "ib_ukg_11", type: "outro", label: "Outro", text: "(Dub delay echoes, solitary Rhodes chords, gradual decay to silence)" }
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
    vocal_lead: "Soulful Zulu and English female lead chants with warm, breathy delivery. Supported by rich jazzy vocal harmonies, call-and-response phrases, and rhythmic chant ad-libs.",
    instrumental_lead: "Resonant percussive log drums, jazzy acoustic grand piano, warm analog sub-bass.",
    arrangement: "Primary: Signature percussive resonant log drums with complex polyrhythmic rolls anchor the low end. Secondary: Warm jazzy grand piano voicings, continuous African shaker loops, and deep analog sub bass pads create deep hypnotic movement.",
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
      { id: "ib_ama_1", type: "intro", label: "Intro", text: "(Spacious jazzy grand piano voicings, continuous African shaker loop, warm sub-bass pad)" },
      { id: "ib_ama_2", type: "verse", label: "Verse 1", text: "(Resonant log drum rolls, syncopated rim clicks, warm low-end thumps)" },
      { id: "ib_ama_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Percussive log drum triplets, sustained string pad swells, piano chord movement)" },
      { id: "ib_ama_4", type: "chorus", label: "Drop 1", text: "(Thumping sub kick, pitch-bending log drum bassline, syncopated woodblock accents)" },
      { id: "ib_ama_5", type: "verse", label: "Verse 2", text: "(Delicate piano counter-motifs, log drum ghost notes, steady shaker groove)" },
      { id: "ib_ama_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Rolling log drum fills, ascending piano arpeggios, dynamic sub swells)" },
      { id: "ib_ama_7", type: "chorus", label: "Drop 2", text: "(Dual interlocking log drum layers, rich piano chord stabs, wide stereo soundstage)" },
      { id: "ib_ama_8", type: "bridge", label: "Breakdown", text: "(Solo resonant grand piano chords, warm sub-bass air, stripped percussion)" },
      { id: "ib_ama_9", type: "solo", label: "Solo", text: "(Acoustic grand piano solo, fluid jazz runs, grace notes, syncopated octave leaps)" },
      { id: "ib_ama_10", type: "chorus", label: "Drop 3", text: "(Virtuosic piano improvisation, driving log drum rolls, full percussion pocket)" },
      { id: "ib_ama_11", type: "outro", label: "Outro", text: "(Tapering log drums, solitary piano voicings, fading shaker loop)" }
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
    vocal_lead: "High-energy rhythmic male hype vocals with aggressive chopped stabs, pitched vocal micro-samples, and rapid call-and-response party chants.",
    instrumental_lead: "Staccato synthesizer brass leads, sliced vocal micro-chops, hyperactive sub-bass drops.",
    arrangement: "Primary: Signature 5-beat Jersey club kick patterns and hyperactive sub-bass drops anchor the bounce. Secondary: Bed-squeak samples on 2 and 4, bright staccato synth brass chords, and sliced vocal loops drive frantic party energy.",
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
      { id: "ib_jcb_1", type: "intro", label: "Intro", text: "(Staccato synth chords, ticking 16th-note hi-hats, vocal micro-stabs)" },
      { id: "ib_jcb_2", type: "verse", label: "Verse 1", text: "(5-beat Jersey club kick pattern, bed-squeak samples on 2 and 4, rapid sub-bass stabs)" },
      { id: "ib_jcb_3", type: "pre-chorus", label: "Build-Up 1", text: "(32nd-note snare roll acceleration, opening high-pass filter, upward sub pitch bends)" },
      { id: "ib_jcb_4", type: "chorus", label: "Drop 1", text: "(5-beat kick pattern, thunderous low-end drops, cutting synth brass, crash cymbals)" },
      { id: "ib_jcb_5", type: "verse", label: "Verse 2", text: "(Syncopated triplet kick variations, arpeggiated stereo synth lead, bed-squeak accents)" },
      { id: "ib_jcb_6", type: "pre-chorus", label: "Build-Up 2", text: "(Fast-paced snare builds, rising white noise sweeps, sub-bass pitch glide)" },
      { id: "ib_jcb_7", type: "chorus", label: "Drop 2", text: "(Distorted sub-bass drops, piercing synth brass chords, hyperactive sample triggers)" },
      { id: "ib_jcb_8", type: "bridge", label: "Breakdown", text: "(Half-time breakdown, bed-squeak accents, sub drone, filtered synth chords)" },
      { id: "ib_jcb_9", type: "solo", label: "Solo", text: "(Lead synth solo, rapid pitch bends, staccato arpeggiation, stereo delay)" },
      { id: "ib_jcb_10", type: "chorus", label: "Drop 3", text: "(Full 5-beat kick fury, thunderous sub impacts, continuous bright synth riffs)" },
      { id: "ib_jcb_11", type: "outro", label: "Outro", text: "(Lone bed-squeak sample, clean low-end 808 sub thump, abrupt silence)" }
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
    vocal_lead: "Silky Nigerian Pidgin and English melodic tenor with effortless rhythmic cadence. Supported by catchy call-and-response vocal chants and lush African choir harmonies.",
    instrumental_lead: "Clean African electric guitar plucks, melodic highlife brass lines, Shekere percussion.",
    arrangement: "Primary: Bright clean African electric guitar plucks playing highlife melodic riffs anchor the piece. Secondary: Syncopated Shekere shakers, resonant log drum accents, and warm electric basslines establish a joyful, buoyant dance groove.",
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
      { id: "ib_afr_1", type: "intro", label: "Intro", text: "(Clean African electric guitar highlife riffs, Shekere shaker, warm Rhodes chords)" },
      { id: "ib_afr_2", type: "verse", label: "Verse 1", text: "(Afrobeats kick and rimshot groove, melodic rolling electric bassline)" },
      { id: "ib_afr_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Warm brass stabs, conga fills, log drum accents, rising festive energy)" },
      { id: "ib_afr_4", type: "chorus", label: "Chorus 1", text: "(Punchy Afrobeats kick, highlife guitar lead, brass countermelodies, full percussion)" },
      { id: "ib_afr_5", type: "verse", label: "Verse 2", text: "(Syncopated guitar picking, secondary lead guitar legato licks, steady shaker)" },
      { id: "ib_afr_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Polyrhythmic talking drum accents, ascending brass fanfare, driving momentum)" },
      { id: "ib_afr_7", type: "chorus", label: "Chorus 2", text: "(Layered guitar counterpoints, deep resonant bassline, celebratory groove)" },
      { id: "ib_afr_8", type: "bridge", label: "Bridge", text: "(Acoustic fingerpicked guitar, soft shaker rhythms, warm saxophone phrases)" },
      { id: "ib_afr_9", type: "solo", label: "Solo", text: "(Brass section and clean electric guitar trading virtuosic highlife melodies)" },
      { id: "ib_afr_10", type: "chorus", label: "Chorus 3", text: "(Tutti brass fanfare, dual guitars, driving bassline, complete percussive section)" },
      { id: "ib_afr_11", type: "outro", label: "Outro", text: "(Solitary clean highlife guitar riff, decaying warm reverb tails, fading silence)" }
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
    vocal_lead: "Dark, reverb-heavy male R&B vocal blending smooth singing with melancholic melodic sing-rap, deep pitch-shifted backing ad-libs, and intimate breathy delivery.",
    instrumental_lead: "Underwater low-pass Rhodes chords, distorted 808 sub-bass glides, expressive legato electric guitar.",
    arrangement: "Primary: Underwater filtered Rhodes chords and vinyl crackle create a dark, nocturnal aesthetic. Secondary: Booming distorted 808 sub slides and tight trap snares lock into a lazy, spacious groove, accented by reverse vocal textures and clean electric guitar licks.",
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
      { id: "ib_ts_1", type: "intro", label: "Intro", text: "(Underwater filtered Rhodes chords, vinyl crackle, tape-saturated sub rumble)" },
      { id: "ib_ts_2", type: "verse", label: "Verse 1", text: "(Distorted 808 sub-bass glides, dry rimshot on 3, sparse delayed guitar plucks)" },
      { id: "ib_ts_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Opening low-pass filter on Rhodes, rolling 32nd-note hi-hats, reverse ambient swell)" },
      { id: "ib_ts_4", type: "chorus", label: "Chorus 1", text: "(Booming distorted 808 slides, Rhodes tremolo chords, tight trap snare, reverse textures)" },
      { id: "ib_ts_5", type: "verse", label: "Verse 2", text: "(Stripped sub thuds, crisp rimshot, expressive electric guitar legato licks)" },
      { id: "ib_ts_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Ascending bass glides, rolling trap hi-hats, moody dynamic build)" },
      { id: "ib_ts_7", type: "chorus", label: "Chorus 2", text: "(Heavy low-end impact, wide stereo Rhodes panning, somber guitar motifs)" },
      { id: "ib_ts_8", type: "bridge", label: "Bridge", text: "(Solitary reverbed electric piano chords, decaying vinyl noise, sub drone)" },
      { id: "ib_ts_9", type: "solo", label: "Solo", text: "(Electric guitar solo, warm neck pickup tone, singing legato bends, tape slapback)" },
      { id: "ib_ts_10", type: "chorus", label: "Chorus 3", text: "(Guitar solo counterpoint, heavy sliding 808s, complete late-night rhythm section)" },
      { id: "ib_ts_11", type: "outro", label: "Outro", text: "(Low-pass filter close, solitary Rhodes chord, fading sub drone to silence)" }
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
    vocal_lead: "Authentic Jamaican Patois toaster cadence with aggressive deejay chanting, rapid rhythmic flow, and smooth melodic female hook counterpoint.",
    instrumental_lead: "Heavy 808 dancehall dembow riddim, syncopated offbeat synth plucks, dub siren fx.",
    arrangement: "Primary: Heavy 808 dancehall dembow riddims and metallic rimshots anchor the groove. Secondary: Syncopated offbeat synth plucks, dub siren effects, and deep sub-bass drops drive the carnival atmosphere, framed by spring-reverb organ skanks.",
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
      { id: "ib_dh_1", type: "intro", label: "Intro", text: "(Metallic offbeat synth skanks, dub siren fx, tape echo sweeps)" },
      { id: "ib_dh_2", type: "verse", label: "Verse 1", text: "(Heavy dembow kick-snare pattern, sub-bass glides, metallic rimshots, dry clicks)" },
      { id: "ib_dh_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Dembow snare roll acceleration, synth brass stabs, rising energy)" },
      { id: "ib_dh_4", type: "chorus", label: "Chorus 1", text: "(Low-end 808 pressure, offbeat organ chops, driving syncopated percussion)" },
      { id: "ib_dh_5", type: "verse", label: "Verse 2", text: "(Stripped kick and sub-bass, clean electric guitar Jamaican skank chords)" },
      { id: "ib_dh_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Dub laser fx, rolling timbales, ascending synth sweeps, crescendo)" },
      { id: "ib_dh_7", type: "chorus", label: "Chorus 2", text: "(Thunderous sub-bass, cutting brass leads, polyrhythmic percussion pocket)" },
      { id: "ib_dh_8", type: "bridge", label: "Bridge", text: "(Low-pass filtered organ, isolated sub thuds, spring reverb sweeps)" },
      { id: "ib_dh_9", type: "solo", label: "Solo", text: "(High-register synth lead solo, pitch-bend ornaments, stereo delay repeats)" },
      { id: "ib_dh_10", type: "chorus", label: "Chorus 3", text: "(Full dembow kit, piercing synth leads, maximum low-end impact)" },
      { id: "ib_dh_11", type: "outro", label: "Outro", text: "(Dub siren echo, descending sub glide, clean decay to silence)" }
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
    vocal_lead: "Crisp rhythmic baritone flow with sharp enunciation and complex internal rhymes. Layered hype ad-libs on bar ends, vocal scratch hooks, and unhurried confidence.",
    instrumental_lead: "Chopped SP-1200 jazz horn samples, acoustic upright bass, crunchy 12-bit drum break.",
    arrangement: "Primary: Chopped SP-1200 jazz horn samples and filtered acoustic upright basslines establish the golden-era vibe. Secondary: A crunchy 12-bit drum break with a dirty acoustic snare on 2 and 4 and constant needle crackle drives the unhurried head-nodding bounce.",
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
      { id: "ib_hip_1", type: "intro", label: "Intro", text: "(Vinyl needle drop crackle, chopped jazz trumpet loops, isolated double bass notes)" },
      { id: "ib_hip_2", type: "verse", label: "Verse 1", text: "(12-bit SP-1200 drum break, punchy snare on 2 and 4, walking upright bass)" },
      { id: "ib_hip_3", type: "chorus", label: "Hook 1", text: "(Chopped brass chords, resonant kick drum thumps, muted Rhodes counterpoint)" },
      { id: "ib_hip_4", type: "verse", label: "Verse 2", text: "(Acoustic upright bassline walking, muted guitar scratches, punchy breakbeat)" },
      { id: "ib_hip_5", type: "bridge", label: "Breakdown", text: "(Low-pass filter on drums, warm double bass plucks, tape hiss, sparse trumpet notes)" },
      { id: "ib_hip_6", type: "chorus", label: "Hook 2", text: "(Full drum break, muted jazz saxophone chops, warm piano fills)" },
      { id: "ib_hip_7", type: "verse", label: "Verse 3", text: "(Unhurried golden-era drum pocket, open hi-hat accents, vinyl atmosphere)" },
      { id: "ib_hip_8", type: "bridge", label: "Bridge", text: "(Delicate vibraphone chords, upright bass, soft brushed snare)" },
      { id: "ib_hip_9", type: "solo", label: "Solo", text: "(Muted jazz trumpet solo, blues inflections, melodic stabs, boom bap groove)" },
      { id: "ib_hip_10", type: "chorus", label: "Hook 3", text: "(Horn ensemble chops, head-nodding drum groove, rich upright bass)" },
      { id: "ib_hip_11", type: "outro", label: "Outro", text: "(Solo muted jazz trumpet notes, needle static run-out groove, fading silence)" }
    ]
  });
})(window);