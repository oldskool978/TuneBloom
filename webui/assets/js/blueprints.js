(function (window) {
  class BlueprintRegistry {
    constructor() {
      this.nodes = new Map();
      this.order = [];
    }

    register(node) {
      if (!node || !node.id) return;
      const cleanNode = {
        id: String(node.id).trim(),
        title: (node.title || "Untitled Master").slice(0, 80),
        genre: (node.genre || "Contemporary R&B").slice(0, 60),
        subgenre: (node.subgenre || "2000s Pop R&B / Slow Jam Bounce").slice(0, 60),
        bpm: Math.max(30, Math.min(300, Number(node.bpm) || 96)),
        key: (node.key || "F minor").slice(0, 30),
        mood: (node.mood || "Sensual, passionate, smooth, driving.").slice(0, 200),
        vocals: (node.vocals || "Silky tenor lead").slice(0, 300),
        arrangement: (node.arrangement || "Deep 808, hybrid snare, Fender Rhodes").slice(0, 300),
        blocks: Array.isArray(node.blocks) ? node.blocks : []
      };
      if (!this.nodes.has(cleanNode.id)) {
        this.order.push(cleanNode.id);
      }
      this.nodes.set(cleanNode.id, cleanNode);
    }

    getById(id) {
      if (this.nodes.has(id)) {
        return JSON.parse(JSON.stringify(this.nodes.get(id)));
      }
      const firstKey = this.order[0];
      return firstKey ? JSON.parse(JSON.stringify(this.nodes.get(firstKey))) : null;
    }

    getAll() {
      return this.order.map((id) => JSON.parse(JSON.stringify(this.nodes.get(id))));
    }

    getRandom(excludeDefault = true) {
      const pool = excludeDefault
        ? this.order.filter((id) => id !== "rnb_midnight_frequency")
        : this.order;

      if (pool.length === 0) {
        return this.order.length > 0 ? this.getById(this.order[0]) : null;
      }

      const idx = Math.floor(Math.random() * pool.length);
      return this.getById(pool[idx]);
    }
  }

  const registry = new BlueprintRegistry();

  // 1. Contemporary R&B / 2000s Slow Jam Bounce
  registry.register({
    id: "rnb_midnight_frequency",
    title: "Midnight Frequency",
    genre: "Contemporary R&B",
    subgenre: "2000s Pop R&B / Slow Jam Bounce",
    bpm: 96,
    key: "F minor",
    mood: "Sensual, passionate, smooth, confident, driving.",
    vocals: "Silky male tenor lead vocal, dynamic chest-to-falsetto transitions, intricate melismatic ad-libs, stacked 4-part harmonies.",
    arrangement: "Deep 808 sub-bass, crisp acoustic-electronic hybrid snare on 2 and 4, syncopated hi-hat rolls, warm Fender Rhodes chords, acoustic nylon guitar plucks.",
    blocks: [
      { id: "b_rnb_1", type: "intro", label: "Intro", text: "(Smooth Rhodes chords, filtered 808 glide, ad-libs)\nYeah, listen\nMidnight in the city, let the groove breathe\nOh, oh-woah, yeah" },
      { id: "b_rnb_2", type: "verse", label: "Verse 1", text: "Midnight riding under neon streetlights\nSearching for the answers in the rearview mirror\nThought I had the blueprint solid in my mind\nNow the silhouette of you is drawing nearer\nDashboard glowing with a steady slow pulse\nEchoes of your whisper in the night air" },
      { id: "b_rnb_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "I try to fight it, but it's pulling me in\nEvery harmonic frequency starts spinning again\nTension rising from the bottom to top\nGot that momentum and we never gon' stop" },
      { id: "b_rnb_4", type: "chorus", label: "Chorus 1", text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\n(Yeah, yeah, keep it right there)" },
      { id: "b_rnb_5", type: "verse", label: "Verse 2", text: "Two in the morning, baseline taking over\nSip of something smooth, leaning in a little closer\nSub-frequencies vibrating the floor\nYou give me everything, but I still want more\nSyncopated touch, perfect timing on the beat\nFire in our eyes, generating pure heat" },
      { id: "b_rnb_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "I try to fight it, but it's pulling me in\nEvery harmonic frequency starts spinning again\nTension rising from the bottom to top\nGot that momentum and we never gon' stop" },
      { id: "b_rnb_7", type: "chorus", label: "Chorus 2", text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\n(Yeah, yeah, right into the pocket)" },
      { id: "b_rnb_8", type: "bridge", label: "Bridge", text: "Take it to the falsetto high, let the bass drop clean\nSmoothest vibration that you've ever seen\nCounterpoint melodies weaving around\nElevating the pressure, capturing the sound\nHold that note, let the energy soar\nTake it to places that we never went before" },
      { id: "b_rnb_9", type: "solo", label: "Solo", text: "(Warm expressive nylon and electric guitar soloing over deep sub-bass and syncopated percussion)" },
      { id: "b_rnb_10", type: "chorus", label: "Chorus 3", text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\n(Oh-woah, give me one more time)" },
      { id: "b_rnb_11", type: "outro", label: "Outro", text: "Fade into the low-end frequency\nKeep the drum pocket steady for me\nAd-libs drifting out into the night\nYeah, just like that\nFade to black" }
    ]
  });

  // 2. Modern Atlanta Trap / Melodic Auto-Tune
  registry.register({
    id: "trap_atlanta_no_cap",
    title: "No Cap In My Section",
    genre: "Hip Hop",
    subgenre: "Atlanta Trap / Melodic Auto-Tune",
    bpm: 136,
    key: "C# minor",
    mood: "Triumphant, ruthless, opulent, bouncy, high-energy.",
    vocals: "Aggressive melodic auto-tune trap vocal with heavy ad-lib layering, rapid triplet cadences, and distorted background vocal chops.",
    arrangement: "Heavy sliding 808 sub-bass, rapid 32nd-note rolling hi-hats, sharp brass stabs, dark detuned bell arpeggio, clean clap on the 3.",
    blocks: [
      { id: "b_trp_1", type: "intro", label: "Intro", text: "(Dark bell melody reverses, heavy 808 slide drops with tape stop effect)\nYeah, Metro vibe on this one\nTurn that shit up in the monitors\nLook, ain't no cap in my section, nigga\nWe ran the whole city up, let's get it" },
      { id: "b_trp_2", type: "verse", label: "Verse 1", text: "Came from the mud, now the wrist on freeze\nPopping big tags like it's nothing to me\nNiggas was talking, they broke on they knees\nNow I get paid just to breathe in the breeze\nBad bitch beside me, she bad as a sin\nDrop the top down let the turbo kick in\nFuck what they saying, I came here to win\nCounting these hundreds and doing it again\nStack on my wrist and my circle stay tight\nGlock in the console, we ready tonight" },
      { id: "b_trp_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Niggas keep flexing on gram for the clout\nI put the work in, they know what I'm 'bout\nCash on the table, no running your mouth\nKing of the city, we running the South" },
      { id: "b_trp_4", type: "chorus", label: "Chorus 1", text: "Ain't no cap in my section, you know how we rock\nBroke niggas talking, they watching the clock\nTurn up the bass till it shatter the block\nTaking that top spot and locking the lock\nYeah, we running this shit\nWhole squad rich and we never gon' quit\nBad ass vibe and she lit in the pit\nFuck all the fake shit, you know who this is" },
      { id: "b_trp_5", type: "verse", label: "Verse 2", text: "Pulled out the foreign, the leather is red\nNiggas be worried 'bout what someone said\nI'm stacking paper and breaking the bread\nKeep all my family protected and fed\nHit up the jeweler, the chain hit like flash\nWhipping that work, put my foot on the gas\nShorty got body, she shaking that ass\nSpending this money and making it last\nNever went broke, kept my head on a swivel\nPressure too heavy, you niggas will cripple" },
      { id: "b_trp_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Niggas keep flexing on gram for the clout\nI put the work in, they know what I'm 'bout\nCash on the table, no running your mouth\nKing of the city, we running the South" },
      { id: "b_trp_7", type: "chorus", label: "Chorus 2", text: "Ain't no cap in my section, you know how we rock\nBroke niggas talking, they watching the clock\nTurn up the bass till it shatter the block\nTaking that top spot and locking the lock\nYeah, we running this shit\nWhole squad rich and we never gon' quit\nBad ass vibe and she lit in the pit\nFuck all the fake shit, you know who this is" },
      { id: "b_trp_8", type: "bridge", label: "Bridge", text: "(Drums cut out, heavy distorted 808 rumble with telephone vocal effect)\nThey tried to count a young nigga right out\nNow look at the penthouse, look at the route\nTurned every whisper to screams and a shout\nNobody can tell me what hustle's about" },
      { id: "b_trp_9", type: "solo", label: "Solo", text: "(Distorted synth lead bends wildly over frantic triplet hi-hat rolls and stutter claps)" },
      { id: "b_trp_10", type: "chorus", label: "Chorus 3", text: "Ain't no cap in my section, you know how we rock\nBroke niggas talking, they watching the clock\nTurn up the bass till it shatter the block\nTaking that top spot and locking the lock\nYeah, we running this shit\nWhole squad rich and we never gon' quit\nBad ass vibe and she lit in the pit\nFuck all the fake shit, you know who this is" },
      { id: "b_trp_11", type: "outro", label: "Outro", text: "(808 slides into low sub register, hi-hats stutter and filter out)\nYeah... no cap.\nStraight facts.\nTuneBloom Master.\nGone." }
    ]
  });

  // 3. Afrobeats / Lagos Highlife Fusion
  registry.register({
    id: "afropop_lagos_vibrations",
    title: "Lagos Nightfall",
    genre: "Afropop",
    subgenre: "Afrobeats / Lagos Highlife Bounce",
    bpm: 104,
    key: "F# major",
    mood: "Infectious, joyful, seductive, rhythmic, celebratory.",
    vocals: "Silky Nigerian Pidgin & English melodic delivery, catchy call-and-response vocal chants, lush African backing chorus.",
    arrangement: "Log drum percussive fills, syncopated Shekere shakers, bright clean African clean guitar plucks, rich warm bassline, brass stabs.",
    blocks: [
      { id: "b_afr_1", type: "intro", label: "Intro", text: "(Sweet highlife guitar riff rolls in with shekere shaker and talking drum)\nOshey! TuneBloom sound\nOmo, listen to the groove\nKilode? Na the vibe we dey give them tonight\nYeah, make we start am" },
      { id: "b_afr_2", type: "verse", label: "Verse 1", text: "Fine girl from the mainland moving sweet\nHer waistline vibrating down to the beat\nShe tell me say na my melody she want\nNobody fit do the things that we stunt\nBottles on the table, champagne dey flow\nEvery single corner catching the glow\nNo time for the bad belle people at all\nWe just dey answer to the blessings we call" },
      { id: "b_afr_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Oya shake am, roll am, give me that wine\nEvery single rhythm design so divine\nFeel the heat in the room, temperature high\nReaching straight to the African sky" },
      { id: "b_afr_4", type: "chorus", label: "Chorus 1", text: "Lagos vibrations inside my soul\nThis heavy rhythm done take control\nGirl your body bad, you dey make me lose my head\nEverything sweet like the butter and the bread\n(Oya dance, oya move, make you feel the sound)\n(Best vibrations in the whole damn town)" },
      { id: "b_afr_5", type: "verse", label: "Verse 2", text: "From Victoria Island down to the beach\nThere's no height that our rhythm cannot reach\nShe whisper in my ear say make I no stop\nSay na this master tune go take the top\nBassline rolling like the ocean tide\nGot the baddest lady right by my side\nWe no dey look back, we dey focus ahead\nLiving up the dream like the wise man said" },
      { id: "b_afr_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Oya shake am, roll am, give me that wine\nEvery single rhythm design so divine\nFeel the heat in the room, temperature high\nReaching straight to the African sky" },
      { id: "b_afr_7", type: "chorus", label: "Chorus 2", text: "Lagos vibrations inside my soul\nThis heavy rhythm done take control\nGirl your body bad, you dey make me lose my head\nEverything sweet like the butter and the bread\n(Oya dance, oya move, make you feel the sound)\n(Best vibrations in the whole damn town)" },
      { id: "b_afr_8", type: "bridge", label: "Bridge", text: "(Percussion breaks down to talking drums and acoustic nylon guitar)\nEhn ehn, take it down easy\nLet the sweet horn section blow breezy\nNobody can kill this natural vibe\nOne love for the entire tribe" },
      { id: "b_afr_9", type: "solo", label: "Solo", text: "(Jubilant African brass section trading bars with virtuoso palm-wine guitar plucks)" },
      { id: "b_afr_10", type: "chorus", label: "Chorus 3", text: "Lagos vibrations inside my soul\nThis heavy rhythm done take control\nGirl your body bad, you dey make me lose my head\nEverything sweet like the butter and the bread\n(Oya dance, oya move, make you feel the sound)\n(Best vibrations in the whole damn town)" },
      { id: "b_afr_11", type: "outro", label: "Outro", text: "(Talking drum echoes with warm horns fading out)\nYeah... Lagos to the world.\nOshey!\nTuneBloom Master." }
    ]
  });

  // 4. NY / UK Sample Drill
  registry.register({
    id: "drill_bronx_shadows",
    title: "Bronx Protocol",
    genre: "Drill",
    subgenre: "NY Sample Drill / UK Dark Bounce",
    bpm: 142,
    key: "E minor",
    mood: "Ominous, aggressive, cold, gritty, cinematic.",
    vocals: "Deep raspy baritone with aggressive staccato delivery, haunting pitched vocal sample loops, layered drill ad-libs (Bow, Grrt).",
    arrangement: "Violent pitch-sliding 808s, syncopated drill snare with 3rd-beat skips, pitch-shifted soulful choral vocal chop, ominous piano.",
    blocks: [
      { id: "b_drl_1", type: "intro", label: "Intro", text: "(Soulful pitched-up sample loop plays with vinyl filter, violent 808 slide explodes)\nGrrt! Bow!\nLook, don't play with me nigga\nYou know the routine\nBronx state of mind, get it right" },
      { id: "b_drl_2", type: "verse", label: "Verse 1", text: "Step in the spot, niggas know it's a problem\nGot all these issues, you know we gon' solve 'em\nDark tint foreign rolling down the Grand Concourse\nKick in the door with the momentum and raw force\nNiggas be cappin', they talking too reckless\nDiamonds be choking me right on my necklace\nFuck with the gang and you find out the hard way\nRunning these blocks from the night to the hallway\nSlide with the 808, hear how it rumble\nStep in the jungle, you slip and you tumble" },
      { id: "b_drl_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "They see the vision, they hating the rise\nI see the fake in the back of their eyes\nWe take the city, no room for disguise\nLook at the score, see who really survives" },
      { id: "b_drl_4", type: "chorus", label: "Chorus 1", text: "Bronx protocol, niggas know we don't play\nClearing the lane when we come out the way\nGrrt, bow, do what we want every day\nStacking this money, there's nothing to say\nYeah, you hear the sub hit the chest\nBulletproof armor, we putting to rest\nAll of the nonsense, we taking the best\nReal drill heavyweight passing the test" },
      { id: "b_drl_5", type: "verse", label: "Verse 2", text: "Catch 'em off guard with the timing and cadence\nNobody stopping the moves that we making\nCame from the baseline, the concrete and pavement\nLook at the checks and the empire created\nBitch on my arm and she looking exotic\nBass in the trunk and the pressure psychotic\nNever folded under heat, we iconic\nSpitting pure truth, every bar is harmonic\nFuck who was doubting, we standing right here\nMaking them feel every second of fear" },
      { id: "b_drl_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "They see the vision, they hating the rise\nI see the fake in the back of their eyes\nWe take the city, no room for disguise\nLook at the score, see who really survives" },
      { id: "b_drl_7", type: "chorus", label: "Chorus 2", text: "Bronx protocol, niggas know we don't play\nClearing the lane when we come out the way\nGrrt, bow, do what we want every day\nStacking this money, there's nothing to say\nYeah, you hear the sub hit the chest\nBulletproof armor, we putting to rest\nAll of the nonsense, we taking the best\nReal drill heavyweight passing the test" },
      { id: "b_drl_8", type: "bridge", label: "Bridge", text: "(Sample chops loop rapidly, 808 slides high into distorted screaming register)\nNo backing down.\nLock the perimeter, hold the whole town.\nKings of the sound, who taking the crown?\nReal niggas only when we touch the ground." },
      { id: "b_drl_9", type: "solo", label: "Solo", text: "(Frantic sliding 808 sub bass solo trading aggressive chops with reverse sample rolls)" },
      { id: "b_drl_10", type: "chorus", label: "Chorus 3", text: "Bronx protocol, niggas know we don't play\nClearing the lane when we come out the way\nGrrt, bow, do what we want every day\nStacking this money, there's nothing to say\nYeah, you hear the sub hit the chest\nBulletproof armor, we putting to rest\nAll of the nonsense, we taking the best\nReal drill heavyweight passing the test" },
      { id: "b_drl_11", type: "outro", label: "Outro", text: "(Vocal sample trails into dark reverb, 808 glides downward into silence)\nGrrt... Bow.\nTuneBloom Drill.\nBronx Master." }
    ]
  });

  // 5. South African Amapiano
  registry.register({
    id: "amapiano_johannesburg_pulse",
    title: "Johannesburg Night Groove",
    genre: "Amapiano",
    subgenre: "Deep Soulful Amapiano / Log Drum Heat",
    bpm: 113,
    key: "Ab minor",
    mood: "Hypnotic, spiritual, soulful, deep-grooving, warm.",
    vocals: "Soulful Zulu & English female lead chants, deep jazzy vocal harmonies, call-and-response group phrases.",
    arrangement: "Signature percussive resonant log drums, warm jazzy piano chords, syncopated shaker loop, deep analog sub bass, atmospheric pad.",
    blocks: [
      { id: "b_ama_1", type: "intro", label: "Intro", text: "(Warm jazzy Rhodes progression, shaker builds with high-pass filter, subtle log drum tease)\nYelele... Woza!\nTuneBloom Amapiano\nLet the log drum breathe, Jo'burg style\nAsambe!" },
      { id: "b_ama_2", type: "verse", label: "Verse 1", text: "Midnight cool air falling on the city\nDancing till the morning with my baby pretty\nDeep bass taking all the weight off the mind\nPrettiest groove that you ever could find\nMove to the left then you shift to the right\nLighting the fire in the middle of night\nEverybody know say the music is pure\nNatural medicine, ultimate cure" },
      { id: "b_ama_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Woza weekend, woza dance\nGive the heavy rhythm a chance\nFeel the sub hitting down in the chest\nSouth African sound is the absolute best" },
      { id: "b_ama_4", type: "drop", label: "Drop 1", text: "(Massive resonant log drum rolls explode into heavy syncopated rhythm with piano stabs)\nWoza! Asambe!\n(Log drums bounce and roll with aggressive percussive power)" },
      { id: "b_ama_5", type: "verse", label: "Verse 2", text: "Table filled with laughter, friends all around\nLost inside the beauty of the piano sound\nNo trouble, no drama, we keeping it clean\nSmoothest vibration the world's ever seen\nTake a little sip, let the melody glide\nNothing to hold back, nowhere to hide\nLog drum rolling with intricate rolls\nHealing the spirit and freeing our souls" },
      { id: "b_ama_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Woza weekend, woza dance\nGive the heavy rhythm a chance\nFeel the sub hitting down in the chest\nSouth African sound is the absolute best" },
      { id: "b_ama_7", type: "drop", label: "Drop 2", text: "(Full log drum ensemble with complex syncopation and saxophone counterpoint)\nWoza! Halala!\n(Heavy percussive bounce with rolling bassline)" },
      { id: "b_ama_8", type: "breakdown", label: "Breakdown", text: "(Drums cut out to atmospheric synth pad, delicate jazz piano chords and solo vocal chant)\nWhen the night is deep and still\nFeel the space that spirit fill\nMusic is life, music is peace\nLet the good vibration never cease" },
      { id: "b_ama_9", type: "solo", label: "Solo", text: "(Warm jazz flugelhorn and Rhodes piano trading solos over shaker rhythm)" },
      { id: "b_ama_10", type: "drop", label: "Drop 3", text: "(Climactic final drop with maximum log drum saturation and vocal choir chants)\nAsambe sonke!\n(Full energy log drum bounce)" },
      { id: "b_ama_11", type: "outro", label: "Outro", text: "(Log drums filter away into lush piano chords and sustained vocal pad)\nYelele... Johannesburg.\nTuneBloom Master." }
    ]
  });

  // 6. TrapSoul / Dark Alternative R&B
  registry.register({
    id: "trapsoul_henny_tears",
    title: "Henny & Midnight Thoughts",
    genre: "R&B",
    subgenre: "TrapSoul / Dark Alternative R&B",
    bpm: 82,
    key: "D minor",
    mood: "Introspective, moody, toxic-romance, vulnerable, atmospheric.",
    vocals: "Dark, reverb-heavy male R&B vocal blending smooth singing with melodic sing-rap, deep pitch-shifted backing ad-libs.",
    arrangement: "Distorted 808 sub-bass, underwater filtered Rhodes chords, reverse vocal chops, crisp tight trap snare, ambient vinyl crackle.",
    blocks: [
      { id: "b_ts_1", type: "intro", label: "Intro", text: "(Underwater filtered Rhodes chords with pitched-down vocal loop)\nYeah, three AM again...\nDrinking Henny straight out the bottle, thinking 'bout you\nShit never changes, does it?\nYeah, listen" },
      { id: "b_ts_2", type: "verse", label: "Verse 1", text: "Phone glowing on the nightstand screen\nYou texting me like you don't know what it mean\nSaying you miss how we used to connect\nWhile you out with someone that you don't respect\nI take a sip let the burn hit my chest\nTrying my hardest to put you to rest\nKnow I was wrong for the things that I did\nActed too reckless, behaved like a kid\nNow I'm in the studio pouring my heart\nWatching the pieces all falling apart" },
      { id: "b_ts_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Toxic love running deep in my veins\nBoth of us addicted to playing these games\nYou know you're the one that I shouldn't be calling\nEvery single time that the evening is falling" },
      { id: "b_ts_4", type: "chorus", label: "Chorus 1", text: "Henny and midnight thoughts got me fucked up\nPouring more liquor inside of my cup\nYou got that body that I can't replace\nCan't get the memory out of my face\nSay that you hate me then pull up at four\nLeaving your clothes on the hardwood floor\nToxic as hell but you know that it's real\nNobody else make me feel how I feel" },
      { id: "b_ts_5", type: "verse", label: "Verse 2", text: "Pulled up to your crib with the headlights off\nRoom full of smoke got you trying not to cough\nYou look at me with that dangerous smile\nSaying you needed me here for a while\nKiss on your neck and you lose all control\nDeep in your eyes I can see in your soul\nWe break every promise we made in the day\nFucking each other's emotions away\nWe know it's wrong but it feels way too good\nDoing the things that we never should" },
      { id: "b_ts_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Toxic love running deep in my veins\nBoth of us addicted to playing these games\nYou know you're the one that I shouldn't be calling\nEvery single time that the evening is falling" },
      { id: "b_ts_7", type: "chorus", label: "Chorus 2", text: "Henny and midnight thoughts got me fucked up\nPouring more liquor inside of my cup\nYou got that body that I can't replace\nCan't get the memory out of my face\nSay that you hate me then pull up at four\nLeaving your clothes on the hardwood floor\nToxic as hell but you know that it's real\nNobody else make me feel how I feel" },
      { id: "b_ts_8", type: "bridge", label: "Bridge", text: "(Bass drops out, ambient guitar loop echoes with heavy stereo plate reverb)\nWhy do we always repeat the mistake?\nHow many promises can we still break?\nSun's coming up and the high starts to fade\nLiving with every decision we made" },
      { id: "b_ts_9", type: "solo", label: "Solo", text: "(Expressive electric guitar solo with heavy whammy vibrato and warm analog overdrive)" },
      { id: "b_ts_10", type: "chorus", label: "Chorus 3", text: "Henny and midnight thoughts got me fucked up\nPouring more liquor inside of my cup\nYou got that body that I can't replace\nCan't get the memory out of my face\nSay that you hate me then pull up at four\nLeaving your clothes on the hardwood floor\nToxic as hell but you know that it's real\nNobody else make me feel how I feel" },
      { id: "b_ts_11", type: "outro", label: "Outro", text: "(Reverse vocal chops echo into the distance, low 808 note fades)\nYeah... three AM thoughts.\nTuneBloom Master.\nFade to dark." }
    ]
  });

  // 7. Jersey Club / High-Energy Jersey Bounce
  registry.register({
    id: "jersey_club_heartbeat",
    title: "Jersey Heartbeat",
    genre: "Dance",
    subgenre: "Jersey Club / Hyperactive Bounce",
    bpm: 138,
    key: "C major",
    mood: "Energetic, frantic, bounce-heavy, club-ready, infectious.",
    vocals: "High-energy rhythmic hype vocals, chopped vocal stabs, bed-squeak accent triggers, rapid party chants.",
    arrangement: "Signature 5-beat Jersey club kick pattern, bed-squeak sample on 2 and 4, hyperactive sub bass drops, sliced vocal loop.",
    blocks: [
      { id: "b_jcb_1", type: "intro", label: "Intro", text: "(Bed squeak chops, fast snare roll, iconic Jersey 5-beat kick pattern starts)\nJersey! TuneBloom in the mix!\nPut your hands up, let's get it!\nRock your hips, rock your hips!\nGo!" },
      { id: "b_jcb_2", type: "verse", label: "Verse 1", text: "Step in the circle, show 'em what you got\nTaking the rhythm and making it hot\nLeft foot, right foot, hit the floor\nEverybody screaming and asking for more\nBassline bumping right in the chest\nJersey club bounce is the absolute best\nFast tempo moving, never gon' stall\nTaking the party and rocking the hall" },
      { id: "b_jcb_3", type: "build", label: "Build-Up 1", text: "(Rapid snare build accelerates to 32nd notes, vocal chop loops faster)\nWork it, work it, let it go!\nThree, two, one, hit the floor!" },
      { id: "b_jcb_4", type: "drop", label: "Drop 1", text: "(Heavy 5-beat kick bounce with sub bass drops and bed-squeak chops)\nRock that body! Shake that ass!\nPut the whole party right on blast!" },
      { id: "b_jcb_5", type: "verse", label: "Verse 2", text: "Sweat on the forehead, energy peaked\nGiving them everything they came to seek\nDJ spinning the hottest release\nMaking the excitement never decrease\nTurn up the monitors, let it all bang\nRep for the city and rep for the gang\nHands to the ceiling, feet off the ground\nNobody messing with Jersey sound" },
      { id: "b_jcb_6", type: "build", label: "Build-Up 2", text: "(Double-time snare riser with vocal chops sweeping across stereo width)\nWork it, work it, let it go!\nThree, two, one, hit the floor!" },
      { id: "b_jcb_7", type: "drop", label: "Drop 2", text: "(Full energetic Jersey drop with vocal gun-cock and laser sound effects)\nBreak it down! Let's go!\n(Frantic 5-beat bounce)" },
      { id: "b_jcb_8", type: "breakdown", label: "Breakdown", text: "(Kicks cut out, ambient pad and vocal chop sustain)\nJersey vibe in the atmosphere\nMaking it crystal clean and clear\nWhen the kick drum hits the floor\nYou already know what we came here for" },
      { id: "b_jcb_9", type: "build", label: "Build-Up 3", text: "(Intense snare roll with rising pitch siren)\nAll my people make some noise!\nLet's go!" },
      { id: "b_jcb_10", type: "drop", label: "Drop 3", text: "(Climactic final drop with maximum sub-bass bounce)\nRock your hips! Shake that ass!\nJersey Master in the class!" },
      { id: "b_jcb_11", type: "outro", label: "Outro", text: "(5-beat kick pattern stutters to sharp halt on final vocal stab)\nYeah! TuneBloom Jersey Club Master.\nDrop." }
    ]
  });

  // 8. Modern Kingston Dancehall / Bashment
  registry.register({
    id: "dancehall_kingston_heat",
    title: "Kingston Heatwave",
    genre: "Dancehall",
    subgenre: "Modern Dancehall / Bashment Riddim",
    bpm: 100,
    key: "G minor",
    mood: "Carnival, seductive, heavy-hitting, swaggering, raw.",
    vocals: "Authentic Jamaican Patois toaster cadence, aggressive deejay chanting, smooth melodic female hook counterpoint.",
    arrangement: "Heavy 808 dancehall dembow riddim, metallic rimshots, syncopated offbeat synth plucks, siren effects, deep sub-bass drop.",
    blocks: [
      { id: "b_dh_1", type: "intro", label: "Intro", text: "(Air horn blast, heavy riddim bassline drops with rimshot cadence)\nBrap! TuneBloom sound system!\nBig up every dancer inna di dancehall!\nWine up your body, gyal!\nPull up di selector!" },
      { id: "b_dh_2", type: "verse", label: "Verse 1", text: "Gyal a wine to di riddim and she move so tight\nKingston city burning bright tonight\nHeavy bassline a rattle up di entire sound\nBaddest dancers a take over di town\nMi see di waistline a move inna slow motion\nCausing pure trouble and commotion\nStep inna di party with di natural flex\nNobody worry 'bout who coming next" },
      { id: "b_dh_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Wine up, bend down, touch di floor\nGive di selector something fi adore\nTemperature boiling right to di max\nFull dancehall power, straight facts" },
      { id: "b_dh_4", type: "chorus", label: "Chorus 1", text: "Kingston heatwave inna di place!\nWine up your body and set di pace!\nGyal you a win, nobody fit contest\nDancehall champion, you a di best!\n(Wine, wine, wine up your waist)\n(Kingston sound, nobody can replace)" },
      { id: "b_dh_5", type: "verse", label: "Verse 2", text: "Champagne popping and di vibe stay real\nNobody duplicate di way dat we feel\nSound system pumping with maximum bass\nLighting up every single square of di space\nHer body bad, she know she look clean\nFinest queen dat di island ever seen\nMove to di left and then back to di right\nWe mash up di dance till di morning light" },
      { id: "b_dh_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Wine up, bend down, touch di floor\nGive di selector something fi adore\nTemperature boiling right to di max\nFull dancehall power, straight facts" },
      { id: "b_dh_7", type: "chorus", label: "Chorus 2", text: "Kingston heatwave inna di place!\nWine up your body and set di pace!\nGyal you a win, nobody fit contest\nDancehall champion, you a di best!" },
      { id: "b_dh_8", type: "bridge", label: "Bridge", text: "(Drums strip to rimshots and dub delay throws)\nRewind selecta, make it roll again\nFrom Kingston town straight to every friend\nAuthentic energy dat cannot fake\nFeel how di heavy ground start to shake" },
      { id: "b_dh_9", type: "solo", label: "Solo", text: "(Dancehall synth lead solo with dub tape delay echos and siren FX)" },
      { id: "b_dh_10", type: "chorus", label: "Chorus 3", text: "Kingston heatwave inna di place!\nWine up your body and set di pace!\nGyal you a win, nobody fit contest\nDancehall champion, you a di best!\n(Pull up dat!)" },
      { id: "b_dh_11", type: "outro", label: "Outro", text: "(Air horn blast, riddim bass fades into dub echo)\nBrap! Kingston sound.\nTuneBloom Dancehall Master.\nDone." }
    ]
  });

  // 9. Synthwave / Cyberpunk Darksynth
  registry.register({
    id: "synth_neon_overdrive",
    title: "Neon Overdrive",
    genre: "Synthwave",
    subgenre: "Darksynth / Cyberpunk Electro",
    bpm: 128,
    key: "D minor",
    mood: "Relentless, cinematic, electric, dark, adrenaline-fueled.",
    vocals: "Distorted vocoder intro, soaring anthemic baritone lead with wide stereo chorus and tape delay slapback.",
    arrangement: "Pumping sidechain bassline, Oberheim 8-voice brass stabs, gated LinnDrum snare, arpeggiated analog lead, driving 16th hi-hats.",
    blocks: [
      { id: "b_syn_1", type: "intro", label: "Intro", text: "(Analog clock arp accelerates, heavy analog sidechain sweep)\nGrid status: Overclocked\nIgnition sequence engaged" },
      { id: "b_syn_2", type: "verse", label: "Verse 1", text: "Chromium skyline bleeding in the rain\nZero-latency adrenaline through every vein\nSpeedometer redlining past the perimeter line\nRunning through the shadows at the edge of time" },
      { id: "b_syn_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Sensors ignite, engines awake\nToo much momentum for the system to break\nTarget acquired, locking the sight\nWe burn across the cybernetic night" },
      { id: "b_syn_4", type: "chorus", label: "Chorus 1", text: "Push it into neon overdrive\nOnly the electric are gonna survive\nShatter the barrier, tear up the street\nLocked to the pulse of the digital beat" },
      { id: "b_syn_5", type: "verse", label: "Verse 2", text: "Signal reflections in the visor glow\nHigh-voltage rhythm moving down below\nNo looking back when the sirens rise\nChasing the horizon under synthetic skies" },
      { id: "b_syn_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Sensors ignite, engines awake\nToo much momentum for the system to break\nTarget acquired, locking the sight\nWe burn across the cybernetic night" },
      { id: "b_syn_7", type: "chorus", label: "Chorus 2", text: "Push it into neon overdrive\nOnly the electric are gonna survive\nShatter the barrier, tear up the street\nLocked to the pulse of the digital beat" },
      { id: "b_syn_8", type: "bridge", label: "Bridge", text: "Overload the circuit, let the voltage peak\nFinding the transcendence that we came to seek\nFrequency rising, tearing through the noise\nListen to the thunder of the engine voice" },
      { id: "b_syn_9", type: "solo", label: "Solo", text: "(Screaming dual-saw oscillator solo with pitch-wheel bends and analog tape flutter)" },
      { id: "b_syn_10", type: "chorus", label: "Chorus 3", text: "Push it into neon overdrive\nOnly the electric are gonna survive\nShatter the barrier, tear up the street\nLocked to the pulse of the digital beat" },
      { id: "b_syn_11", type: "outro", label: "Outro", text: "System cooling down...\nDecelerating from orbit...\nPulse... fading... static." }
    ]
  });

  // 10. Neo-Soul / Organic Lo-Fi R&B
  registry.register({
    id: "neosoul_golden_hour",
    title: "Golden Hour Bloom",
    genre: "Neo-Soul",
    subgenre: "Organic Lo-Fi R&B / Jazzy Pocket",
    bpm: 84,
    key: "Eb major",
    mood: "Warm, reflective, nostalgic, intimate, cozy.",
    vocals: "Breathy female alto with rich low resonance, unhurried phrasing, layered backing choir harmonies, natural dynamic expression.",
    arrangement: "Damped upright piano, unquantized live rimshot groove, upright bass with finger-noise detail, lush Rhodes tremolo, brushed cymbals.",
    blocks: [
      { id: "b_neo_1", type: "intro", label: "Intro", text: "(Vinyl crackle, warm upright piano chords walking up, gentle vocal humming)\nMmm-mmm, yeah\nRight where we need to be" },
      { id: "b_neo_2", type: "verse", label: "Verse 1", text: "Sunlight spilling on the hardwood floor\nCoffee steaming by the open door\nTime moves slower when you're in the room\nEvery little silence begins to bloom" },
      { id: "b_neo_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "No rush against the ticking hand\nDrifting like golden desert sand\nYou smile and tilt your head away\nNothing else matters in the day" },
      { id: "b_neo_4", type: "chorus", label: "Chorus 1", text: "Caught in the golden hour light\nEverything feels easy and right\nLet the world keep rushing on by\nWe've got the sun and the morning sky" },
      { id: "b_neo_5", type: "verse", label: "Verse 2", text: "Unfinished melodies written on a page\nStepping off the rush of the modern stage\nJust your fingers tapping out a simple chord\nRichest peace that we could afford" },
      { id: "b_neo_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "No rush against the ticking hand\nDrifting like golden desert sand\nYou smile and tilt your head away\nNothing else matters in the day" },
      { id: "b_neo_7", type: "chorus", label: "Chorus 2", text: "Caught in the golden hour light\nEverything feels easy and right\nLet the world keep rushing on by\nWe've got the sun and the morning sky" },
      { id: "b_neo_8", type: "bridge", label: "Bridge", text: "No hurry, no race to win\nJust breathing the morning in\nHarmonies settling in the air\nWithout a single heavy care" },
      { id: "b_neo_9", type: "solo", label: "Solo", text: "(Warm jazz flugelhorn solo over gentle upright bass and brushed hi-hats)" },
      { id: "b_neo_10", type: "chorus", label: "Chorus 3", text: "Caught in the golden hour light\nEverything feels easy and right\nLet the world keep rushing on by\nWe've got the sun and the morning sky" },
      { id: "b_neo_11", type: "outro", label: "Outro", text: "(Piano sustains and trails off, soft vocal ad-libs)\nStay right here...\nGolden hour...\nMmm." }
    ]
  });

  // 11. Indie Dream Pop / Shoegaze
  registry.register({
    id: "dreampop_coastal_drift",
    title: "Coastal Drift",
    genre: "Indie Dream Pop",
    subgenre: "Shoegaze / Jangle Pop",
    bpm: 112,
    key: "A major",
    mood: "Ethereal, breezy, bittersweet, expansive, melancholic.",
    vocals: "Airy, reverb-drenched dual male/female harmony, soft delivery floating behind shimmering chorus guitars.",
    arrangement: "Rickenbacker jangle guitars with stereo chorus, driving melodic bassline, punchy 80s snare with hall reverb, Prophet-5 synth pads.",
    blocks: [
      { id: "b_pop_1", type: "intro", label: "Intro", text: "(Shimmering chorus guitar riff, gentle ocean swell effect, sparkling tambourine)" },
      { id: "b_pop_2", type: "verse", label: "Verse 1", text: "Salt air drifting through the open car\nWondering if we traveled far\nWater gleaming in the afternoon haze\nLost in the rhythm of the summer days" },
      { id: "b_pop_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Past the dunes where the grasses sway\nWatching the daylight slip away\nColors bleeding into the tide\nWith the whole wide world on our side" },
      { id: "b_pop_4", type: "chorus", label: "Chorus 1", text: "Wash away into the coastal tide\nNowhere left we need to hide\nFloating on the current out to sea\nJust you and the open horizon with me" },
      { id: "b_pop_5", type: "verse", label: "Verse 2", text: "Footprints washed from the shoreline track\nNo clear reason for looking back\nSun sinking low into shades of rose\nWhere the cool evening current flows" },
      { id: "b_pop_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Past the dunes where the grasses sway\nWatching the daylight slip away\nColors bleeding into the tide\nWith the whole wide world on our side" },
      { id: "b_pop_7", type: "chorus", label: "Chorus 2", text: "Wash away into the coastal tide\nNowhere left we need to hide\nFloating on the current out to sea\nJust you and the open horizon with me" },
      { id: "b_pop_8", type: "bridge", label: "Bridge", text: "Let the waves crash high above\nEverything we were dreaming of\nCatch the swell before it breaks\nFor all our memories' sakes" },
      { id: "b_pop_9", type: "solo", label: "Solo", text: "(Lush, delayed guitar melody echoing across the stereo field with tremolo vibrato)" },
      { id: "b_pop_10", type: "chorus", label: "Chorus 3", text: "Wash away into the coastal tide\nNowhere left we need to hide\nFloating on the current out to sea\nJust you and the open horizon with me" },
      { id: "b_pop_11", type: "outro", label: "Outro", text: "(Waves recede, jangle guitars slowly fade into ambient synth mist)" }
    ]
  });

  // 12. 90s East Coast Boom Bap / Jazz Rap
  registry.register({
    id: "boombap_crate_diggers",
    title: "Crate Diggers Anthem",
    genre: "Hip Hop",
    subgenre: "90s East Coast Boom Bap / Jazz Rap",
    bpm: 92,
    key: "C minor",
    mood: "Gritty, authentic, soulful, head-nodding, focused.",
    vocals: "Crisp rhythmic baritone flow, sharp enunciation, layered hype ad-libs on bar ends, vinyl-scratched chorus hooks.",
    arrangement: "Chopped SP-1200 jazz horn sample, crunchy 12-bit acoustic drum break with dirty snare punch, filtered upright bassline.",
    blocks: [
      { id: "b_hip_1", type: "intro", label: "Intro", text: "(Dusty vinyl needle drop, muted jazz trumpet loop, DJ scratch)\nCheck the levels on the tape deck\nOne, two... yeah\nDropping the needle on ninety-two" },
      { id: "b_hip_2", type: "verse", label: "Verse 1", text: "Sifting through the crates in the basement store\nFinding rare gems on the dusty floor\nTwelve-bit textures hitting hard on the one\nMaking classic rhythm till the rising sun\nPen on the notebook, capturing the rhyme\nEvery single syllable is locked in time" },
      { id: "b_hip_3", type: "hook", label: "Hook 1", text: "(Scratched vocal sample cut over heavy kick and snare)\n\"Keep the rhythm raw, never compromise\"\n\"Rocking on the beat right before your eyes\"\nCrate diggers anthem from the underground\nPure authentic feeling in the master sound" },
      { id: "b_hip_4", type: "verse", label: "Verse 2", text: "Analog warmth through the vacuum tube\nCutting straight through the surrounding cube\nHeavy bass foundation rattling the trunk\nNothing artificial, just the real raw funk\nKick-snare cadence walking down the block\nSynchronized perfectly to turn the clock" },
      { id: "b_hip_5", type: "breakdown", label: "Breakdown", text: "(Drums drop out, isolated bass and Rhodes chords filter in, tape delay echoes)\nLet the groove breathe for a minute\nReal audio craftsmanship with soul inside it" },
      { id: "b_hip_6", type: "hook", label: "Hook 2", text: "(Full drum break slams back in with vocal scratches)\n\"Keep the rhythm raw, never compromise\"\n\"Rocking on the beat right before your eyes\"\nCrate diggers anthem from the underground\nPure authentic feeling in the master sound" },
      { id: "b_hip_7", type: "verse", label: "Verse 3", text: "Mastering the craft till the break of day\nStacking up the reels in a clean display\nTimeless frequency living in the groove\nGive the people something that can make them move" },
      { id: "b_hip_8", type: "bridge", label: "Bridge", text: "From the SP pads to the master reel\nYou can never duplicate the way we feel\nHarmonic overtones ringing in the room\nEngineered precision in the sonic bloom" },
      { id: "b_hip_9", type: "solo", label: "Solo", text: "(Fast rhythmic turntable scratch solo over isolated breakbeat)" },
      { id: "b_hip_10", type: "hook", label: "Hook 3", text: "(Full drum break slams back in with vocal scratches)\n\"Keep the rhythm raw, never compromise\"\n\"Rocking on the beat right before your eyes\"\nCrate diggers anthem from the underground\nPure authentic feeling in the master sound" },
      { id: "b_hip_11", type: "outro", label: "Outro", text: "(Turntable baby scratches, trumpet loop echoes out into warm tape noise)\nFading out on the groove\nClassic master tape finish." }
    ]
  });

  // 13. Progressive Djent / Modern Metalcore
  registry.register({
    id: "metalcore_quantum_break",
    title: "Quantum Break",
    genre: "Metalcore",
    subgenre: "Progressive Djent / Modern Post-Hardcore",
    bpm: 140,
    key: "Drop D",
    mood: "Aggressive, technical, relentless, explosive, triumphant.",
    vocals: "Visceral mid-range screams and guttural lows on verses, soaring anthemic clean chorus with stereo octave doubling.",
    arrangement: "Down-tuned 8-string polyrhythmic chugs, rapid double-bass drum triggers, atmospheric ambient glitch synths, sub drops.",
    blocks: [
      { id: "b_met_1", type: "intro", label: "Intro", text: "(Sub drop rumble, dissonant guitar lead, massive snare crack explodes into full groove)" },
      { id: "b_met_2", type: "verse", label: "Verse 1", text: "Shattered glass on the concrete floor\nCan't find the truth behind this broken door\nFractured timelines tearing in two\nSearching for the anchor to pull me through\nPressure building inside the core\nWe can't ignore the warning anymore!" },
      { id: "b_met_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Tearing through the veil of reality\nSevering the chains of our gravity\nLook into the fire and take the stand\nEverything we built is in our hands!" },
      { id: "b_met_4", type: "chorus", label: "Chorus 1", text: "Stand in the eye of the quantum storm!\nReinvent the ashes and take new form!\nThrough the darkest void we ignite the spark\nLeave an everlasting light in the dark!" },
      { id: "b_met_5", type: "verse", label: "Verse 2", text: "Zero tolerance for the silent decay\nWash all the compromised illusions away\nBinary structures collapse to dust\nIn our own conviction we put our trust\nFeel the recoil, embrace the sound\nNothing can tear our foundation down!" },
      { id: "b_met_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Tearing through the veil of reality\nSevering the chains of our gravity\nLook into the fire and take the stand\nEverything we built is in our hands!" },
      { id: "b_met_7", type: "chorus", label: "Chorus 2", text: "Stand in the eye of the quantum storm!\nReinvent the ashes and take new form!\nThrough the darkest void we ignite the spark\nLeave an everlasting light in the dark!" },
      { id: "b_met_8", type: "breakdown", label: "Breakdown", text: "(Down-tempo half-time crushing 8-string breakdown, syncopated china cymbal accents)\nBREAK THE MATRIX!\n(Massive sub drop, frantic polyrhythmic blast)" },
      { id: "b_met_9", type: "solo", label: "Solo", text: "(High-speed sweep-picked arpeggio solo transitioning into soaring melodic guitar harmonies)" },
      { id: "b_met_10", type: "chorus", label: "Chorus 3", text: "Stand in the eye of the quantum storm!\nReinvent the ashes and take new form!\nThrough the darkest void we ignite the spark\nLeave an everlasting light in the dark!" },
      { id: "b_met_11", type: "outro", label: "Outro", text: "(Final dissonant chord feedback sustains over heart-beat sub-bass pulse, cutting to sharp silence)" }
    ]
  });

  // 14. Modern Alt-Country / Americana
  registry.register({
    id: "country_dust_and_diesel",
    title: "Dust & Diesel",
    genre: "Country",
    subgenre: "Modern Americana / Heartland Rock",
    bpm: 104,
    key: "G major",
    mood: "Grounded, nostalgic, honest, open-road, uplifting.",
    vocals: "Warm raspy male baritone lead with rich southern drawl, acoustic harmony on choruses, conversational delivery.",
    arrangement: "Acoustic Martin D-28 rhythm strumming, weeping pedal steel guitar, punchy kick-snare train beat, Telecaster twang.",
    blocks: [
      { id: "b_cnt_1", type: "intro", label: "Intro", text: "(Pedal steel guitar swells over steady acoustic strumming and subtle kick drum)\nYeah, rolling down County Line\nJust like old times" },
      { id: "b_cnt_2", type: "verse", label: "Verse 1", text: "Old pine trees leaning by the gravel road\nCarrying sixty miles worth of heavy load\nGot the windows down catching that summer rain\nWashing all the rust off this two-lane lane\nBoot heels worn from the honest grind\nLeaving every troubled thought way behind" },
      { id: "b_cnt_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Sun sinking down past the harvest grain\nNothing quite cures like an open plain\nTurn the dial up till the speakers roar\nTo the songs that we've been waiting for" },
      { id: "b_cnt_4", type: "chorus", label: "Chorus 1", text: "Running on dust, diesel, and prayers tonight\nChasing the red glow of the taillight\nNothing in this world can slow me down\nThirty miles past the edge of town\nGot a full tank and a clear blue sky\nWatching all the hard miles roll on by" },
      { id: "b_cnt_5", type: "verse", label: "Verse 2", text: "Silver moonlight shining on the tractor line\nNeighbor's porch light burning like a friendly sign\nWorking with your hands gives you peace of mind\nBest kind of freedom you can ever find\nHard-earned dollar and a faithful heart\nKnowing right where the real things start" },
      { id: "b_cnt_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Sun sinking down past the harvest grain\nNothing quite cures like an open plain\nTurn the dial up till the speakers roar\nTo the songs that we've been waiting for" },
      { id: "b_cnt_7", type: "chorus", label: "Chorus 2", text: "Running on dust, diesel, and prayers tonight\nChasing the red glow of the taillight\nNothing in this world can slow me down\nThirty miles past the edge of town\nGot a full tank and a clear blue sky\nWatching all the hard miles roll on by" },
      { id: "b_cnt_8", type: "bridge", label: "Bridge", text: "There's a comfort in the rhythm of the highway line\nKnowing that the future's gonna turn out fine\nKeep your eyes on the horizon ahead\nRemembering every word that mama said" },
      { id: "b_cnt_9", type: "solo", label: "Solo", text: "(Expressive Telecaster guitar solo with chicken-pickin' runs and pedal steel counterpoint)" },
      { id: "b_cnt_10", type: "chorus", label: "Chorus 3", text: "Running on dust, diesel, and prayers tonight\nChasing the red glow of the taillight\nNothing in this world can slow me down\nThirty miles past the edge of town\nGot a full tank and a clear blue sky\nWatching all the hard miles roll on by" },
      { id: "b_cnt_11", type: "outro", label: "Outro", text: "(Acoustic guitar rings out with weeping pedal steel, fading into ambient cricket chirps)\nJust rolling on home...\nDust and diesel." }
    ]
  });

  // 15. Latin Urban / Sensual Dembow Pop
  registry.register({
    id: "latin_fuego_en_la_noche",
    title: "Fuego en la Noche",
    genre: "Latin Pop",
    subgenre: "Modern Reggaeton / Sensual Dembow",
    bpm: 98,
    key: "B minor",
    mood: "Sensual, rhythmic, hypnotic, tropical, seductive.",
    vocals: "Smooth bilingual Spanish/English tenor vocal, rhythmic cadence, autotune ad-libs, stacked chorus choir.",
    arrangement: "Punchy dembow drum groove, deep sub-bass glide, muted flamenco nylon guitar riff, atmospheric synth plucks.",
    blocks: [
      { id: "b_lat_1", type: "intro", label: "Intro", text: "(Flamenco guitar riff with vinyl hiss, muted dembow kick builds up)\nDímelo... TuneBloom\nLa noche está llamando\nBailando suave, tú y yo" },
      { id: "b_lat_2", type: "verse", label: "Verse 1", text: "Luces bajas en la ciudad\nTu mirada dice la verdad\nTe acercas lento sin preguntar\nEl ritmo empieza a acelerar\nMoviéndote con esa elegancia\nEliminando toda la distancia" },
      { id: "b_lat_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "La música sube y no podemos parar\nEl bajo retumba hasta hacernos vibrar\nBailando pegados bajo el resplandor\nSintiendo en el pecho este gran calor" },
      { id: "b_lat_4", type: "chorus", label: "Chorus 1", text: "Hay fuego en la noche, déjate llevar\nNadie como tú me puede controlar\nCon ese movimiento me vas a matar\nHasta que la luna se vaya a ocultar\n(Fuego, fuego... bien pegao)" },
      { id: "b_lat_5", type: "verse", label: "Verse 2", text: "Whiskey en la mesa, humo en el salón\nSincronizados en la misma emoción\nTu cuerpo sabe cómo navegar\nCada compás me vuelve a atrapar\nNo hay prisa cuando se siente así\nTodo lo que quiero lo encuentro en ti" },
      { id: "b_lat_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "La música sube y no podemos parar\nEl bajo retumba hasta hacernos vibrar\nBailando pegados bajo el resplandor\nSintiendo en el pecho este gran calor" },
      { id: "b_lat_7", type: "chorus", label: "Chorus 2", text: "Hay fuego en la noche, déjate llevar\nNadie como tú me puede controlar\nCon ese movimiento me vas a matar\nHasta que la luna se vaya a ocultar" },
      { id: "b_lat_8", type: "bridge", label: "Bridge", text: "Suavemente al oído susúrrame\nQue esta noche nunca se termine\nElevando el tempo sin condición\nSomos la chispa de la creación" },
      { id: "b_lat_9", type: "solo", label: "Solo", text: "(Expressive nylon guitar and synth brass duet soloing over rolling dembow percussion)" },
      { id: "b_lat_10", type: "chorus", label: "Chorus 3", text: "Hay fuego en la noche, déjate llevar\nNadie como tú me puede controlar\nCon ese movimiento me vas a matar\nHasta que la luna se vaya a ocultar\n(Fuego en la noche... tú y yo)" },
      { id: "b_lat_11", type: "outro", label: "Outro", text: "(Dembow beat strips to clean nylon guitar chords and vocal reverb echoes)\nAsí mismito...\nHasta que salga el sol.\nFuego." }
    ]
  });

  // 16. Melodic Progressive House / Trance
  registry.register({
    id: "house_echoes_of_elysium",
    title: "Echoes of Elysium",
    genre: "Electronic",
    subgenre: "Melodic Progressive House / Deep Trance",
    bpm: 124,
    key: "F# minor",
    mood: "Euphoric, driving, transcendent, atmospheric, hypnotic.",
    vocals: "Airy, ethereal female soprano vocal with long sustained notes, stereo ping-pong delays, vocoder harmonies.",
    arrangement: "Pumping four-on-the-floor kick, rolling 16th bassline, lush supersaw chords, plucky arpeggios, white noise sweeps.",
    blocks: [
      { id: "b_hou_1", type: "intro", label: "Intro", text: "(Subtle four-on-the-floor kick fades in with resonant high-pass filter sweep and ambient vocal pads)" },
      { id: "b_hou_2", type: "verse", label: "Verse 1", text: "Drifting through the endless blue\nEvery shadow turning into light with you\nBoundless ocean beneath the sky\nWatching ancient constellations passing by" },
      { id: "b_hou_3", type: "build", label: "Build-Up 1", text: "(Snare roll accelerates, rising pitch riser, kick filter opens up)\nFrequency climbing higher and higher\nIgniting the universal fire\nFeel the pressure start to rise\nOpen up your eyes!" },
      { id: "b_hou_4", type: "drop", label: "Drop 1", text: "(Massive sidechained supersaw drop with driving rolling bassline and euphoric melody)" },
      { id: "b_hou_5", type: "verse", label: "Verse 2", text: "Weightless in the sonic stream\nLiving inside a lucid waking dream\nHarmonic overtones fill the room\nEvery single frequency begins to bloom" },
      { id: "b_hou_6", type: "build", label: "Build-Up 2", text: "(Double-time snare riser with vocal chops sweeping into stereo width)\nFrequency climbing higher and higher\nIgniting the universal fire\nRelease the tension, break the wall\nAnswer to the call!" },
      { id: "b_hou_7", type: "drop", label: "Drop 2", text: "(Full progressive drop with layered lead melody, driving sub-bass, and crisp percussion)" },
      { id: "b_hou_8", type: "breakdown", label: "Breakdown", text: "(Beats cut completely, lush ambient piano and pad chords take center stage with solo vocal lead)\nWhen the world is quiet and still\nWe find the space that love can fill" },
      { id: "b_hou_9", type: "build", label: "Build-Up 3", text: "(Intense 32nd-note snare build, rising white noise rush)\nThree... two... one... let it soar!" },
      { id: "b_hou_10", type: "drop", label: "Drop 3", text: "(Climactic final drop with maximum harmonic saturation and layered arp counterpoints)" },
      { id: "b_hou_11", type: "outro", label: "Outro", text: "(Kick and bass slowly filter downward into deep reverb tail, leaving gentle synth arpeggios)" }
    ]
  });

  // 17. Funk / Nu-Disco
  registry.register({
    id: "funk_starlight_groove",
    title: "Starlight Groove",
    genre: "Funk",
    subgenre: "Nu-Disco / Modern Boogie Funk",
    bpm: 116,
    key: "E minor",
    mood: "Funky, energetic, celebratory, joyous, infectious.",
    vocals: "Punchy, rhythmic tenor vocal with falsetto chorus ad-libs, group backing vocals on hooks, brass-stab vocal syncopation.",
    arrangement: "Slap bass with envelope filter, chicken-scratch Stratocaster guitar, tight punchy horn section, vintage Minimoog bass synthesizer.",
    blocks: [
      { id: "b_fnk_1", type: "intro", label: "Intro", text: "(Slap bass riff, four-on-the-floor disco beat with open hi-hat, tight horn stabs)\nGet down!\nYeah, bring it on in\nTuneBloom funk in the pocket" },
      { id: "b_fnk_2", type: "verse", label: "Verse 1", text: "Spotted shoes on the parquet floor\nCan't keep your feet from heading for the door\nBassline popping right into your soul\nTaking full momentum and complete control\nGot that rhythm locked into the groove\nGiving everybody something to prove" },
      { id: "b_fnk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Hands in the air, feeling the beat\nTurning up the power on the city street\nHorn section blowing till the roof comes down\nBest vibrations in the entire town!" },
      { id: "b_fnk_4", type: "chorus", label: "Chorus 1", text: "Ride on the starlight groove tonight!\nEverything's shining underneath the light!\nShake off the heavy and let it unwind\nLeave all the ordinary far behind!\n(Yeah! Starlight groove!)" },
      { id: "b_fnk_5", type: "verse", label: "Verse 2", text: "Stratocaster scratching out the tempo clean\nFunkier than anything you've ever seen\nSyncopated magic on the two and four\nMaking every dancer come back for more\nGot no worries, got no blues\nJust dynamic rhythm you can never lose" },
      { id: "b_fnk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Hands in the air, feeling the beat\nTurning up the power on the city street\nHorn section blowing till the roof comes down\nBest vibrations in the entire town!" },
      { id: "b_fnk_7", type: "chorus", label: "Chorus 2", text: "Ride on the starlight groove tonight!\nEverything's shining underneath the light!\nShake off the heavy and let it unwind\nLeave all the ordinary far behind!" },
      { id: "b_fnk_8", type: "bridge", label: "Bridge", text: "Break it down to the bass and drum!\nWatch where the heavy groove is coming from!\n(Bass slap solo groove with clavinet chords)" },
      { id: "b_fnk_9", type: "solo", label: "Solo", text: "(Sizzling alto saxophone solo trading bars with funk wah-wah guitar)" },
      { id: "b_fnk_10", type: "chorus", label: "Chorus 3", text: "Ride on the starlight groove tonight!\nEverything's shining underneath the light!\nShake off the heavy and let it unwind\nLeave all the ordinary far behind!\n(One more time, groove it out!)" },
      { id: "b_fnk_11", type: "outro", label: "Outro", text: "(Full ensemble groove with energetic vocal chants)\nKeep it funky... just like that!\nHit me on the one!\n(Sharp brass hit to silence)" }
    ]
  });

  // 18. 90s Grunge Revival / Alternative Rock
  registry.register({
    id: "rock_static_and_rust",
    title: "Static & Rust",
    genre: "Alternative Rock",
    subgenre: "90s Grunge Revival / Post-Grunge",
    bpm: 108,
    key: "E minor",
    mood: "Raw, gritty, brooding, explosive, cathartic.",
    vocals: "Dynamic male vocal transitioning from whispered baritone verses to gravelly, screaming choruses with full chest resonance.",
    arrangement: "Distorted Gibson Les Paul power chords through vintage Marshall stacks, heavy thumping live drums, driving fuzz bass.",
    blocks: [
      { id: "b_rck_1", type: "intro", label: "Intro", text: "(Clean chorus-drenched guitar riff with subtle amp hum, suddenly explodes into heavy fuzz riff)" },
      { id: "b_rck_2", type: "verse", label: "Verse 1", text: "Cracked ceiling staring down at me\nTrapped inside this quiet frequency\nCounting seconds till the engine turns\nWatching how the slow ignition burns\nWords written down on a crumpled sheet\nEchoing across the empty street" },
      { id: "b_rck_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Turn up the feedback, let it scream\nNothing is ever quite what it seems\nTension stretching till the wire snaps\nFalling right into the open traps" },
      { id: "b_rck_4", type: "chorus", label: "Chorus 1", text: "Caught in the static and the rust!\nWatching our promises turn to dust!\nScream at the wall till the shadows break\nFor all the chances we didn't take!" },
      { id: "b_rck_5", type: "verse", label: "Verse 2", text: "Old photographs on the painted wall\nWaiting for the heavy rain to fall\nScars on the knuckle from the fight we chose\nKnowing how the bitter story goes\nNo more apologies, no more delay\nTime to wash the compromise away" },
      { id: "b_rck_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Turn up the feedback, let it scream\nNothing is ever quite what it seems\nTension stretching till the wire snaps\nFalling right into the open traps" },
      { id: "b_rck_7", type: "chorus", label: "Chorus 2", text: "Caught in the static and the rust!\nWatching our promises turn to dust!\nScream at the wall till the shadows break\nFor all the chances we didn't take!" },
      { id: "b_rck_8", type: "bridge", label: "Bridge", text: "Strip it down to the raw bone frame\nNobody else left that we can blame\nIgnite the fuel and let it go\nDown in the fire down below" },
      { id: "b_rck_9", type: "solo", label: "Solo", text: "(Raw, feedback-drenched guitar solo with aggressive bends, wah-wah sweeps, and tremolo picking)" },
      { id: "b_rck_10", type: "chorus", label: "Chorus 3", text: "Caught in the static and the rust!\nWatching our promises turn to dust!\nScream at the wall till the shadows break\nFor all the chances we didn't take!" },
      { id: "b_rck_11", type: "outro", label: "Outro", text: "(Guitars feedback violently over heavy rolling tom fills, ending on a crushing final chord that rings out)" }
    ]
  });

  // 19. Cinematic Orchestral / Epic Neo-Classical
  registry.register({
    id: "orchestral_valkyrie_ascending",
    title: "Valkyrie Ascending",
    genre: "Cinematic",
    subgenre: "Epic Orchestral / Neo-Classical Hybrid",
    bpm: 90,
    key: "D minor",
    mood: "Heroic, dramatic, monumental, majestic, expansive.",
    vocals: "Full dramatic soprano solo with operatic vibrato, layered SATB cinematic choir chanting in Latin cadence.",
    arrangement: "Full symphonic string section, French horn brass fanfare, massive cinematic Taiko drums, orchestral harp, subtle modular synth sub-pulses.",
    blocks: [
      { id: "b_orc_1", type: "intro", label: "Intro", text: "(Subtle orchestral cellos and violas establish brooding ostinato, timpani roll builds under atmospheric brass)" },
      { id: "b_orc_2", type: "verse", label: "Verse 1", text: "Across the mountain ridge the storm unfolds\nA legacy of iron, blood, and gold\nThrough freezing winds the ancient banner flies\nUnder the gaze of dark immortal skies\nHold the perimeter, protect the flame\nHonor the glory of the fallen name" },
      { id: "b_orc_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Strings swell with rapid spiccato runs, French horns lead thematic counterpoint)\nAeterna lux, veritas in armis\nSurge ad astra, victoria nos vocat" },
      { id: "b_orc_4", type: "chorus", label: "Chorus 1", text: "Rise from the ashes of the battleground!\nWhere destiny and courage can be found!\nWith wings of iron we ascend the crest\nPutting our mortal fear to rest!" },
      { id: "b_orc_5", type: "verse", label: "Verse 2", text: "The thunder echoes through the frozen canyon deep\nA sacred vigil that we swear to keep\nNo sword shall falter in the decisive hour\nWe stand as guardians of transcendent power\nThrough every trial we shall remain\nUnbroken by the tempest and the pain" },
      { id: "b_orc_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Full brass section joins the rhythmic ostinato with thunderous Taiko accents)\nAeterna lux, veritas in armis\nSurge ad astra, victoria nos vocat" },
      { id: "b_orc_7", type: "chorus", label: "Chorus 2", text: "Rise from the ashes of the battleground!\nWhere destiny and courage can be found!\nWith wings of iron we ascend the crest\nPutting our mortal fear to rest!" },
      { id: "b_orc_8", type: "breakdown", label: "Breakdown", text: "(Drums drop out; solo French horn plays melancholy theme over gentle harp arpeggios and low string drone)" },
      { id: "b_orc_9", type: "solo", label: "Solo", text: "(Virtuosic solo violin soars over full choir harmonies, executing passionate high-register melodic lines)" },
      { id: "b_orc_10", type: "chorus", label: "Chorus 3", text: "(Full orchestra, choir, and epic percussion explode at maximum dynamic intensity)\nRise from the ashes of the battleground!\nWhere destiny and courage can be found!\nWith wings of iron we ascend the crest\nPutting our mortal fear to rest!" },
      { id: "b_orc_11", type: "outro", label: "Outro", text: "(Grand orchestral cadence resolves on a resonant D-minor chord, harp trails off into silence)" }
    ]
  });

  window.TuneBloomBlueprints = registry;
})(window);