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
      { id: "b_rnb_1", type: "intro", label: "Intro", text: "Yeah, listen\nMidnight in the city, let the groove breathe\n(Oh, oh-woah, yeah)" },
      { id: "b_rnb_2", type: "verse", label: "Verse 1", text: "Midnight riding under neon streetlights\nSearching for the answers in the rearview mirror\nThought I had the blueprint solid in my mind\nNow the silhouette of you is drawing nearer\nDashboard glowing with a steady slow pulse\nEchoes of your whisper in the night air" },
      { id: "b_rnb_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "I try to fight it, but it's pulling me in\nEvery harmonic frequency starts spinning again\nTension rising from the bottom to top\nGot that momentum and we never gon' stop" },
      { id: "b_rnb_4", type: "chorus", label: "Chorus 1", text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\n(Yeah, yeah, keep it right there)" },
      { id: "b_rnb_5", type: "verse", label: "Verse 2", text: "Two in the morning, baseline taking over\nSip of something smooth, leaning in a little closer\nSub-frequencies vibrating the floor\nYou give me everything, but I still want more\nSyncopated touch, perfect timing on the beat\nFire in our eyes, generating pure heat" },
      { id: "b_rnb_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "I try to fight it, but it's pulling me in\nEvery harmonic frequency starts spinning again\nTension rising from the bottom to top\nGot that momentum and we never gon' stop" },
      { id: "b_rnb_7", type: "chorus", label: "Chorus 2", text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\n(Yeah, yeah, right into the pocket)" },
      { id: "b_rnb_8", type: "bridge", label: "Bridge", text: "Take it to the falsetto high, let the bass drop clean\nSmoothest vibration that you've ever seen\nCounterpoint melodies weaving around\nElevating the pressure, capturing the sound\nHold that note, let the energy soar\nTake it to places that we never went before" },
      { id: "b_rnb_9", type: "solo", label: "Solo", text: "(Oh, yeah)\n(Ride the wave)" },
      { id: "b_rnb_10", type: "chorus", label: "Chorus 3", text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\n(Oh-woah, give me one more time)" },
      { id: "b_rnb_11", type: "outro", label: "Outro", text: "Fade into the low-end frequency\nKeep the drum pocket steady for me\n(Yeah, just like that)\n(Fade to black)" }
    ]
  });

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
      { id: "b_trp_1", type: "intro", label: "Intro", text: "(Yeah! What?)\nTurn that shit up in the monitors\nLook, ain't no cap in my section, nigga\nWe ran the whole city up, let's get it\n(Let's go!)" },
      { id: "b_trp_2", type: "verse", label: "Verse 1", text: "Came from the mud, now the wrist on freeze\nPopping big tags like it's nothing to me\nNiggas was talking, they broke on they knees\nNow I get paid just to breathe in the breeze\nBad bitch beside me, she bad as a sin\nDrop the top down let the turbo kick in\nFuck what they saying, I came here to win\nCounting these hundreds and doing it again\n(Racks!)\nStack on my wrist and my circle stay tight\nGlock in the console, we ready tonight" },
      { id: "b_trp_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Niggas keep flexing on gram for the clout\nI put the work in, they know what I'm 'bout\nCash on the table, no running your mouth\nKing of the city, we running the South\n(Yeah!)" },
      { id: "b_trp_4", type: "chorus", label: "Chorus 1", text: "Ain't no cap in my section, you know how we rock\nBroke niggas talking, they watching the clock\nTurn up the bass till it shatter the block\nTaking that top spot and locking the lock\nYeah, we running this shit\n(Nigga!)\nWhole squad rich and we never gon' quit\nBad ass vibe and she lit in the pit\nFuck all the fake shit, you know who this is" },
      { id: "b_trp_5", type: "verse", label: "Verse 2", text: "Pulled out the foreign, the leather is red\nNiggas be worried 'bout what someone said\nI'm stacking paper and breaking the bread\nKeep all my family protected and fed\nHit up the jeweler, the chain hit like flash\nWhipping that work, put my foot on the gas\nShorty got body, she shaking that ass\nSpending this money and making it last\nNever went broke, kept my head on a swivel\nPressure too heavy, you niggas will cripple" },
      { id: "b_trp_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Niggas keep flexing on gram for the clout\nI put the work in, they know what I'm 'bout\nCash on the table, no running your mouth\nKing of the city, we running the South" },
      { id: "b_trp_7", type: "chorus", label: "Chorus 2", text: "Ain't no cap in my section, you know how we rock\nBroke niggas talking, they watching the clock\nTurn up the bass till it shatter the block\nTaking that top spot and locking the lock\nYeah, we running this shit\n(What?)\nWhole squad rich and we never gon' quit\nBad ass vibe and she lit in the pit\nFuck all the fake shit, you know who this is" },
      { id: "b_trp_8", type: "bridge", label: "Bridge", text: "They tried to count a young nigga right out\nNow look at the penthouse, look at the route\nTurned every whisper to screams and a shout\nNobody can tell me what hustle's about\n(No cap!)" },
      { id: "b_trp_9", type: "solo", label: "Solo", text: "(Turn me up!)\n(Yeah, yeah, yeah!)" },
      { id: "b_trp_10", type: "chorus", label: "Chorus 3", text: "Ain't no cap in my section, you know how we rock\nBroke niggas talking, they watching the clock\nTurn up the bass till it shatter the block\nTaking that top spot and locking the lock\nYeah, we running this shit\nWhole squad rich and we never gon' quit\nBad ass vibe and she lit in the pit\nFuck all the fake shit, you know who this is" },
      { id: "b_trp_11", type: "outro", label: "Outro", text: "Yeah, no cap\nStraight facts\nTuneBloom Master\nGone\n(Bitch!)" }
    ]
  });

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
      { id: "b_drl_1", type: "intro", label: "Intro", text: "(Grrt! Bow!)\nLook, don't play with me nigga\nYou know the routine\nBronx state of mind, get it right\n(Bow, bow, bow!)" },
      { id: "b_drl_2", type: "verse", label: "Verse 1", text: "Step in the spot, niggas know it's a problem\nGot all these issues, you know we gon' solve 'em\nDark tint foreign rolling down the Grand Concourse\nKick in the door with the momentum and raw force\nNiggas be cappin', they talking too reckless\nDiamonds be choking me right on my necklace\nFuck with the gang and you find out the hard way\nRunning these blocks from the night to the hallway\nSlide with the eight-o-eight, hear how it rumble\nStep in the jungle, you slip and you tumble\n(Grrt!)" },
      { id: "b_drl_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "They see the vision, they hating the rise\nI see the fake in the back of their eyes\nWe take the city, no room for disguise\nLook at the score, see who really survives" },
      { id: "b_drl_4", type: "chorus", label: "Chorus 1", text: "Bronx protocol, niggas know we don't play\nClearing the lane when we come out the way\nGrrt, bow, do what we want every day\nStacking this money, there's nothing to say\nYeah, you hear the sub hit the chest\nBulletproof armor, we putting to rest\nAll of the nonsense, we taking the best\nReal drill heavyweight passing the test\n(Bow!)" },
      { id: "b_drl_5", type: "verse", label: "Verse 2", text: "Catch 'em off guard with the timing and cadence\nNobody stopping the moves that we making\nCame from the baseline, the concrete and pavement\nLook at the checks and the empire created\nBitch on my arm and she looking exotic\nBass in the trunk and the pressure psychotic\nNever folded under heat, we iconic\nSpitting pure truth, every bar is harmonic\nFuck who was doubting, we standing right here\nMaking them feel every second of fear" },
      { id: "b_drl_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "They see the vision, they hating the rise\nI see the fake in the back of their eyes\nWe take the city, no room for disguise\nLook at the score, see who really survives" },
      { id: "b_drl_7", type: "chorus", label: "Chorus 2", text: "Bronx protocol, niggas know we don't play\nClearing the lane when we come out the way\nGrrt, bow, do what we want every day\nStacking this money, there's nothing to say\nYeah, you hear the sub hit the chest\nBulletproof armor, we putting to rest\nAll of the nonsense, we taking the best\nReal drill heavyweight passing the test" },
      { id: "b_drl_8", type: "bridge", label: "Bridge", text: "No backing down\nLock the perimeter, hold the whole town\nKings of the sound, who taking the crown?\nReal niggas only when we touch the ground\n(Grrt, bow!)" },
      { id: "b_drl_9", type: "solo", label: "Solo", text: "(Bow! Bow! Bow!)\n(Grrt!)" },
      { id: "b_drl_10", type: "chorus", label: "Chorus 3", text: "Bronx protocol, niggas know we don't play\nClearing the lane when we come out the way\nGrrt, bow, do what we want every day\nStacking this money, there's nothing to say\nYeah, you hear the sub hit the chest\nBulletproof armor, we putting to rest\nAll of the nonsense, we taking the best\nReal drill heavyweight passing the test" },
      { id: "b_drl_11", type: "outro", label: "Outro", text: "Grrt... Bow\nTuneBloom Drill\nBronx Master\n(Bow!)" }
    ]
  });

  registry.register({
    id: "phonk_memphis_evil_drift",
    title: "Nightmare On 66th",
    genre: "Phonk",
    subgenre: "Memphis Dark Phonk / Evil Trap",
    bpm: 145,
    key: "F# minor",
    mood: "Dark, menacing, relentless, hypnotic, aggressive.",
    vocals: "Aggressive chopped Memphis triplet cadence, distorted vocal doubling, dark pitched-down backing chants.",
    arrangement: "Saturated Memphis cowbell melody, blown-out distorted 808 sub slides, gritty SP-1200 kick, open hi-hat rolls, ominous cassette tape hiss.",
    blocks: [
      { id: "b_phk_1", type: "intro", label: "Intro", text: "(Yeah, mane)\n(Triple six in the cut)\nCreepin' through the fog, Glock cocked in the dash\nWatch a busta fold when we step on the gas\n(What? Yeah!)" },
      { id: "b_phk_2", type: "verse", label: "Verse 1", text: "Ridin' through the south side, trunk bump loud\nSmoke fill the chamber, lost up in the cloud\nDevil in my ear tellin' me to take the crown\nPut a scary nigga six feet beneath the ground\nTape deck hissin' with that nineteen-ninety-five\nRollin' with the demons, only real ones survive\nCowbell ringin' through the pitch-black street\nBlood on the asphalt, locked into the beat\nMask on my face, you can't see what I'm thinkin'\nDouble cup dirty, that potion I'm drinkin'" },
      { id: "b_phk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Late night stalkin' in the dead of the night\nHeadlights off, yeah we killin' the light\nTire smoke risin' when we rip around the bend\nAin't no mercy when the nightmare begin\n(Mane!)" },
      { id: "b_phk_4", type: "chorus", label: "Chorus 1", text: "Drift in the shadow, murder in the dark\nLeave a cold stain where the hollow points spark\nCatch a nigga slippin', put that bitch on a shirt\nTen toes down while we dig in the dirt\nYeah, we evil with the rhythm and the flow\nMemphis sound hittin' everywhere that we go\nScreamin' in the alley, nobody hear a sound\nWatch another body sink into the ground\n(Yeah!)" },
      { id: "b_phk_5", type: "verse", label: "Verse 2", text: "Stepped inside the dungeon with the steel in my grip\nBitch try to talk, slap the taste off her lip\nChopped up cadence from the ninety-one track\nNever look behind, ain't no turnin' on back\nLoaded up the clip with the heavy hollow tip\nSlidin' on the eighty-eight, hear the rubber rip\nNiggas talk heavy till they starin' at the barrel\nWalkin' through the shadow of the valley and the peril\nMoney on my mind and the blood on my hand\nLord of the underground, runnin' the land" },
      { id: "b_phk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Late night stalkin' in the dead of the night\nHeadlights off, yeah we killin' the light\nTire smoke risin' when we rip around the bend\nAin't no mercy when the nightmare begin" },
      { id: "b_phk_7", type: "chorus", label: "Chorus 2", text: "Drift in the shadow, murder in the dark\nLeave a cold stain where the hollow points spark\nCatch a nigga slippin', put that bitch on a shirt\nTen toes down while we dig in the dirt\nYeah, we evil with the rhythm and the flow\nMemphis sound hittin' everywhere that we go\nScreamin' in the alley, nobody hear a sound\nWatch another body sink into the ground" },
      { id: "b_phk_8", type: "bridge", label: "Bridge", text: "Hear the static in the dark, feel the reaper come close\nGive a busta what he really fear the most\nNo salvation, no prayer in the dark\nWatch the whole city ignite from the spark\n(Triple six!)" },
      { id: "b_phk_9", type: "solo", label: "Solo", text: "(Drift! Mane!)\n(Yeah!)" },
      { id: "b_phk_10", type: "chorus", label: "Chorus 3", text: "Drift in the shadow, murder in the dark\nLeave a cold stain where the hollow points spark\nCatch a nigga slippin', put that bitch on a shirt\nTen toes down while we dig in the dirt\nYeah, we evil with the rhythm and the flow\nMemphis sound hittin' everywhere that we go\nScreamin' in the alley, nobody hear a sound\nWatch another body sink into the ground" },
      { id: "b_phk_11", type: "outro", label: "Outro", text: "Yeah, mane\nMemphis underground\nTuneBloom Evil Phonk\nRest in piss\n(Mane!)" }
    ]
  });

  registry.register({
    id: "westcoast_bay_area_bounce",
    title: "Sideshow Geometry",
    genre: "West Coast Hip Hop",
    subgenre: "Bay Area Hyphy / G-Funk Bounce",
    bpm: 98,
    key: "G minor",
    mood: "Swaggering, bouncy, triumphant, sun-drenched, raw.",
    vocals: "Laid-back aggressive West Coast baritone flow, syncopated talkbox vocal hooks, hypeman call-and-response ad-libs.",
    arrangement: "Whining analog Portamento G-Funk synth lead, slapping live bassline, heavy acoustic-electronic clap on the 2 and 4, syncopated congas, talkbox.",
    blocks: [
      { id: "b_wcb_1", type: "intro", label: "Intro", text: "(Yeah! Bay Area!)\nSwing the five-point-oh through the intersection\nGas, brake, dip, nigga\nYou already know what time it is\n(Get stupid!)" },
      { id: "b_wcb_2", type: "verse", label: "Verse 1", text: "Swinging out the scraper in the middle of the street\nDonut round the fire while we bangin' to the beat\nGot the dreads shakin', whole clique goin' dumb\nWhite-Tee fresh, watch the heavy dollar come\nNigga from the Town, put the city on my back\nTwo-tone Cutlass rollin' heavy on the track\nTell a bad bitch get up in it if she bout it\nPut the top down, ain't a motherfucker doubt it\nSmokin' on the finest out the Oakland dispensary\nBlowin' big cloud, legacy of the century" },
      { id: "b_wcb_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Watch the tires smoke when we hit that slide\nEvery single rider down for the ride\nHop on the hood, let the whole thing spin\nNiggas in the back countin' up that win\n(Yee!)" },
      { id: "b_wcb_4", type: "chorus", label: "Chorus 1", text: "Sideshow geometry, we rockin' the bay\nDo a whole thirty in the middle of the day\nTell that square nigga get the fuck out the way\nReal West Coast, ain't a thing you can say\nGas, brake, dip, let the bass drum drop\nWe be goin' dumb and we never gon' stop\nPop that collar, keep the dollar on lock\nKing of the pavement, runnin' the block\n(Yee-hee!)" },
      { id: "b_wcb_5", type: "verse", label: "Verse 2", text: "Slappin' out the subs till the rearview shatter\nNiggas talk beef, but it really don't matter\nHeavy on the gas, watch the speedometer climb\nEvery single bar is ahead of its time\nGot a thick thang with the gold hoop ring\nTell me that she love how the G-Funk sing\nMac Dre spirit in the air tonight\nMobbin' through the fog under amber light\nGot the hustle encoded in my DNA\nFrom the East Bay streets to the LA bay" },
      { id: "b_wcb_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Watch the tires smoke when we hit that slide\nEvery single rider down for the ride\nHop on the hood, let the whole thing spin\nNiggas in the back countin' up that win" },
      { id: "b_wcb_7", type: "chorus", label: "Chorus 2", text: "Sideshow geometry, we rockin' the bay\nDo a whole thirty in the middle of the day\nTell that square nigga get the fuck out the way\nReal West Coast, ain't a thing you can say\nGas, brake, dip, let the bass drum drop\nWe be goin' dumb and we never gon' stop\nPop that collar, keep the dollar on lock\nKing of the pavement, runnin' the block" },
      { id: "b_wcb_8", type: "bridge", label: "Bridge", text: "Tell the DJ let the funky synth whine\nRoll another blunt of the California pine\nStand on the roof, throw the W high\nReppin' for the coast till the day that I die\n(West Coast!)" },
      { id: "b_wcb_9", type: "solo", label: "Solo", text: "(Talk that shit!)\n(Yee!)" },
      { id: "b_wcb_10", type: "chorus", label: "Chorus 3", text: "Sideshow geometry, we rockin' the bay\nDo a whole thirty in the middle of the day\nTell that square nigga get the fuck out the way\nReal West Coast, ain't a thing you can say\nGas, brake, dip, let the bass drum drop\nWe be goin' dumb and we never gon' stop\nPop that collar, keep the dollar on lock\nKing of the pavement, runnin' the block" },
      { id: "b_wcb_11", type: "outro", label: "Outro", text: "Yee!\nTuneBloom West Coast Master\nGas, brake, dip\nOut\n(Get stupid!)" }
    ]
  });

  registry.register({
    id: "drill_chicago_war_zone",
    title: "No Mercy In The Trenches",
    genre: "Drill",
    subgenre: "Chicago Street Drill / Dark Trap",
    bpm: 138,
    key: "C minor",
    mood: "Grim, lethal, relentless, dark, intense.",
    vocals: "Raspy aggressive street baritone, staccato triplet punchlines, authentic Chicago ad-libs (On God, Glrr, Gang), aggressive vocal double.",
    arrangement: "Menacing minor piano chords, heavy punchy low-end 808s, rapid-fire hi-hat rolls, crisp dry trap snare, sub bass drops.",
    blocks: [
      { id: "b_chd_1", type: "intro", label: "Intro", text: "(Glrr! On God!)\nMan what? Niggas know what time it is\nSouth side trenches, keep your head down\n(Gang, gang, gang!)" },
      { id: "b_chd_2", type: "verse", label: "Verse 1", text: "Snow falling down on sixty-fourth street\nNiggas outside with the heat on the seat\nDon't step out if you ain't bout that life\nCut through the block like a switchblade knife\nOpp talking reckless on live for a minute\nPulled up in ten, put a whole clip in it\nAin't no remorse for a nigga who snitch\nPut him in the river, leave him cold in a ditch\nDrum on the stick hold fifty-plus rounds\nClean out the block when we makin' the rounds\n(Boom, boom, boom!)" },
      { id: "b_chd_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Red laser beam pointing straight at your head\nOne wrong move and you already dead\nNo cap rap, every lyric is real\nLivin' by the gun, dyin' by the steel\n(On God!)" },
      { id: "b_chd_4", type: "chorus", label: "Chorus 1", text: "No mercy in the trenches, you know how we slide\nNiggas be talkin' then runnin' to hide\nHeavy drill bass got the whole block shakin'\nLook at the body and look at the check made\nGang in the cut, we don't ever miss target\nWalk in the room, we the biggest in market\nBlood on the snow, that's the price that you pay\nChicago drill king, do it every damn day\n(Glrr!)" },
      { id: "b_chd_5", type: "verse", label: "Verse 2", text: "Came from the bottom where mothers be cryin'\nEvery single week another brother be dyin'\nTold myself I was gon' make it on top\nNiggas got smoked when they thought I would stop\nBitch in the hotel counting the bag\nRockin' designer, don't look at the tag\nShooter stay loyal, he ready to dump\nHit from a block away, watch how he jump\nWar in the streets and it never gon' cease\nNiggas want war, ain't no talkin' no peace" },
      { id: "b_chd_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Red laser beam pointing straight at your head\nOne wrong move and you already dead\nNo cap rap, every lyric is real\nLivin' by the gun, dyin' by the steel" },
      { id: "b_chd_7", type: "chorus", label: "Chorus 2", text: "No mercy in the trenches, you know how we slide\nNiggas be talkin' then runnin' to hide\nHeavy drill bass got the whole block shakin'\nLook at the body and look at the check made\nGang in the cut, we don't ever miss target\nWalk in the room, we the biggest in market\nBlood on the snow, that's the price that you pay\nChicago drill king, do it every damn day" },
      { id: "b_chd_8", type: "bridge", label: "Bridge", text: "Sirens in the distance, smoke in the air\nLook in our eyes, ain't a sliver of fear\nWe run the cold streets, hold down the fort\nTaking you niggas right out of the court\n(Gang!)" },
      { id: "b_chd_9", type: "solo", label: "Solo", text: "(Glrr! Boom!)\n(On gang!)" },
      { id: "b_chd_10", type: "chorus", label: "Chorus 3", text: "No mercy in the trenches, you know how we slide\nNiggas be talkin' then runnin' to hide\nHeavy drill bass got the whole block shakin'\nLook at the body and look at the check made\nGang in the cut, we don't ever miss target\nWalk in the room, we the biggest in market\nBlood on the snow, that's the price that you pay\nChicago drill king, do it every damn day" },
      { id: "b_chd_11", type: "outro", label: "Outro", text: "Man what?\nChicago trenches\nTuneBloom Drill Master\n(Glrr, bow!)" }
    ]
  });

  registry.register({
    id: "detroit_scam_punch",
    title: "Wire Transfers At 5 AM",
    genre: "Hip Hop",
    subgenre: "Detroit Scam Rap / Southern Plugg Fusion",
    bpm: 100,
    key: "D# minor",
    mood: "Arrogant, bouncy, raw, unapologetic, high-tempo.",
    vocals: "Off-beat Detroit punchflow, witty deadpan staccato delivery, layered hype ad-libs (What? Yeah, Huh), rapid bars without breathing.",
    arrangement: "Jumping Plugg synth bells, heavy punching 808 kick drum, bouncy claps, off-beat baseline stabs, bright 16th hi-hats.",
    blocks: [
      { id: "b_dtp_1", type: "intro", label: "Intro", text: "(What? Huh? Yeah!)\nFive in the morning, VPN connected to Romania\nJust hit for fifty bands on a fake routing number\nStop playin' with me, nigga\n(Let's get it!)" },
      { id: "b_dtp_2", type: "verse", label: "Verse 1", text: "Woke up at four, made thirty bands before breakfast\nSwiped a card at Saks Fifth, bought a brand new necklace\nNiggas rap about the trap, but they credit score zero\nI just bought my mom a crib, now I'm lookin' like a hero\nOff-beat flow got you niggas confused\nWalked in Neiman Marcus with ten thousand in shoes\nCashier lookin' at the screen like 'how did this pass?'\nPut my signature down, then I step on the gas\nCrypto wallet lookin' fat, got the ledger on ice\nNever paid for a meal in my motherfuckin' life" },
      { id: "b_dtp_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Punching on the keys, watch the balance go green\nSmoothest young scammer that you ever have seen\nServer in Iceland, proxy is tight\nMaking hundred-thousand dollar deposits tonight\n(What?)" },
      { id: "b_dtp_4", type: "chorus", label: "Chorus 1", text: "Wire transfers at five AM, nigga check the account\nEvery single day we withdraw the maximum amount\nGot the bins, got the slips, got the full-zips loaded\nWhole database in my hand, server just exploded\nYeah, we off the leash with the cash and the punch\nSteak and lobster dinner for a casual lunch\nFuck a job application, we just print out the check\nPut a half a million dollar chain right round the neck\n(Huh?)" },
      { id: "b_dtp_5", type: "verse", label: "Verse 2", text: "Pulled up to the dealership with three different names\nWalked out with the Hellcat, this ain't no games\nBank teller asked for ID, handed her a fake\nLooked her in the eye while I took the whole cake\nNigga mad 'cause his girl in my DM requestin'\nSay she wanna fly to Cabo where I be investin'\nI don't even rap on beat, but the music still slaps\nWhile you niggas workin' shifts, I be runnin' through apps\nGot the burner phone ringin' with the foreign alert\nMaking ten bands sittin' in a Balenciaga shirt" },
      { id: "b_dtp_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Punching on the keys, watch the balance go green\nSmoothest young scammer that you ever have seen\nServer in Iceland, proxy is tight\nMaking hundred-thousand dollar deposits tonight" },
      { id: "b_dtp_7", type: "chorus", label: "Chorus 2", text: "Wire transfers at five AM, nigga check the account\nEvery single day we withdraw the maximum amount\nGot the bins, got the slips, got the full-zips loaded\nWhole database in my hand, server just exploded\nYeah, we off the leash with the cash and the punch\nSteak and lobster dinner for a casual lunch\nFuck a job application, we just print out the check\nPut a half a million dollar chain right round the neck" },
      { id: "b_dtp_8", type: "bridge", label: "Bridge", text: "Swipe it once, swipe it twice, do the transaction clear?\nSmilin' at the camera with a forty-carat ear\nNo trace, no case, hit the highway and skate\nNiggas talkin' down while we clearin' the plate\n(Yeah!)" },
      { id: "b_dtp_9", type: "solo", label: "Solo", text: "(Huh? What?)\n(Count that shit up!)" },
      { id: "b_dtp_10", type: "chorus", label: "Chorus 3", text: "Wire transfers at five AM, nigga check the account\nEvery single day we withdraw the maximum amount\nGot the bins, got the slips, got the full-zips loaded\nWhole database in my hand, server just exploded\nYeah, we off the leash with the cash and the punch\nSteak and lobster dinner for a casual lunch\nFuck a job application, we just print out the check\nPut a half a million dollar chain right round the neck" },
      { id: "b_dtp_11", type: "outro", label: "Outro", text: "Transaction confirmed\nFunds deposited\nTuneBloom Detroit Punch Master\n(What? Huh? Out!)" }
    ]
  });

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
      { id: "b_afr_1", type: "intro", label: "Intro", text: "Oshey! TuneBloom sound\nOmo, listen to the groove\nKilode? Na the vibe we dey give them tonight\nYeah, make we start am\n(Let's go!)" },
      { id: "b_afr_2", type: "verse", label: "Verse 1", text: "Fine girl from the mainland moving sweet\nHer waistline vibrating down to the beat\nShe tell me say na my melody she want\nNobody fit do the things that we stunt\nBottles on the table, champagne dey flow\nEvery single corner catching the glow\nNo time for the bad belle people at all\nWe just dey answer to the blessings we call" },
      { id: "b_afr_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Oya shake am, roll am, give me that wine\nEvery single rhythm design so divine\nFeel the heat in the room, temperature high\nReaching straight to the African sky" },
      { id: "b_afr_4", type: "chorus", label: "Chorus 1", text: "Lagos vibrations inside my soul\nThis heavy rhythm done take control\nGirl your body bad, you dey make me lose my head\nEverything sweet like the butter and the bread\n(Oya dance, oya move, make you feel the sound)\n(Best vibrations in the whole damn town)" },
      { id: "b_afr_5", type: "verse", label: "Verse 2", text: "From Victoria Island down to the beach\nThere's no height that our rhythm cannot reach\nShe whisper in my ear say make I no stop\nSay na this master tune go take the top\nBassline rolling like the ocean tide\nGot the baddest lady right by my side\nWe no dey look back, we dey focus ahead\nLiving up the dream like the wise man said" },
      { id: "b_afr_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Oya shake am, roll am, give me that wine\nEvery single rhythm design so divine\nFeel the heat in the room, temperature high\nReaching straight to the African sky" },
      { id: "b_afr_7", type: "chorus", label: "Chorus 2", text: "Lagos vibrations inside my soul\nThis heavy rhythm done take control\nGirl your body bad, you dey make me lose my head\nEverything sweet like the butter and the bread\n(Oya dance, oya move, make you feel the sound)\n(Best vibrations in the whole damn town)" },
      { id: "b_afr_8", type: "bridge", label: "Bridge", text: "Ehn ehn, take it down easy\nLet the sweet horn section blow breezy\nNobody can kill this natural vibe\nOne love for the entire tribe" },
      { id: "b_afr_9", type: "solo", label: "Solo", text: "(Oya!)\n(Feel the horn!)" },
      { id: "b_afr_10", type: "chorus", label: "Chorus 3", text: "Lagos vibrations inside my soul\nThis heavy rhythm done take control\nGirl your body bad, you dey make me lose my head\nEverything sweet like the butter and the bread\n(Oya dance, oya move, make you feel the sound)\n(Best vibrations in the whole damn town)" },
      { id: "b_afr_11", type: "outro", label: "Outro", text: "Yeah... Lagos to the world\nOshey!\nTuneBloom Master" }
    ]
  });

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
      { id: "b_ama_1", type: "intro", label: "Intro", text: "Yelele... Woza!\nTuneBloom Amapiano\nLet the log drum breathe, Jo'burg style\nAsambe!" },
      { id: "b_ama_2", type: "verse", label: "Verse 1", text: "Midnight cool air falling on the city\nDancing till the morning with my baby pretty\nDeep bass taking all the weight off the mind\nPrettiest groove that you ever could find\nMove to the left then you shift to the right\nLighting the fire in the middle of night\nEverybody know say the music is pure\nNatural medicine, ultimate cure" },
      { id: "b_ama_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Woza weekend, woza dance\nGive the heavy rhythm a chance\nFeel the sub hitting down in the chest\nSouth African sound is the absolute best" },
      { id: "b_ama_4", type: "drop", label: "Drop 1", text: "Woza! Asambe!\n(Woza, woza, asambe sonke!)" },
      { id: "b_ama_5", type: "verse", label: "Verse 2", text: "Table filled with laughter, friends all around\nLost inside the beauty of the piano sound\nNo trouble, no drama, we keeping it clean\nSmoothest vibration the world's ever seen\nTake a little sip, let the melody glide\nNothing to hold back, nowhere to hide\nLog drum rolling with intricate rolls\nHealing the spirit and freeing our souls" },
      { id: "b_ama_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Woza weekend, woza dance\nGive the heavy rhythm a chance\nFeel the sub hitting down in the chest\nSouth African sound is the absolute best" },
      { id: "b_ama_7", type: "drop", label: "Drop 2", text: "Woza! Halala!\n(Halala, halala, asambe!)" },
      { id: "b_ama_8", type: "breakdown", label: "Breakdown", text: "When the night is deep and still\nFeel the space that spirit fill\nMusic is life, music is peace\nLet the good vibration never cease" },
      { id: "b_ama_9", type: "solo", label: "Solo", text: "(Yelele...)\n(Woza!)" },
      { id: "b_ama_10", type: "drop", label: "Drop 3", text: "Asambe sonke!\n(Woza! Asambe!)" },
      { id: "b_ama_11", type: "outro", label: "Outro", text: "Yelele... Johannesburg\nTuneBloom Master" }
    ]
  });

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
      { id: "b_ts_1", type: "intro", label: "Intro", text: "Yeah, three AM again...\nDrinking Henny straight out the bottle, thinking 'bout you\nShit never changes, does it?\nYeah, listen" },
      { id: "b_ts_2", type: "verse", label: "Verse 1", text: "Phone glowing on the nightstand screen\nYou texting me like you don't know what it mean\nSaying you miss how we used to connect\nWhile you out with someone that you don't respect\nI take a sip let the burn hit my chest\nTrying my hardest to put you to rest\nKnow I was wrong for the things that I did\nActed too reckless, behaved like a kid\nNow I'm in the studio pouring my heart\nWatching the pieces all falling apart" },
      { id: "b_ts_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Toxic love running deep in my veins\nBoth of us addicted to playing these games\nYou know you're the one that I shouldn't be calling\nEvery single time that the evening is falling" },
      { id: "b_ts_4", type: "chorus", label: "Chorus 1", text: "Henny and midnight thoughts got me fucked up\nPouring more liquor inside of my cup\nYou got that body that I can't replace\nCan't get the memory out of my face\nSay that you hate me then pull up at four\nLeaving your clothes on the hardwood floor\nToxic as hell but you know that it's real\nNobody else make me feel how I feel" },
      { id: "b_ts_5", type: "verse", label: "Verse 2", text: "Pulled up to your crib with the headlights off\nRoom full of smoke got you trying not to cough\nYou look at me with that dangerous smile\nSaying you needed me here for a while\nKiss on your neck and you lose all control\nDeep in your eyes I can see in your soul\nWe break every promise we made in the day\nFucking each other's emotions away\nWe know it's wrong but it feels way too good\nDoing the things that we never should" },
      { id: "b_ts_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Toxic love running deep in my veins\nBoth of us addicted to playing these games\nYou know you're the one that I shouldn't be calling\nEvery single time that the evening is falling" },
      { id: "b_ts_7", type: "chorus", label: "Chorus 2", text: "Henny and midnight thoughts got me fucked up\nPouring more liquor inside of my cup\nYou got that body that I can't replace\nCan't get the memory out of my face\nSay that you hate me then pull up at four\nLeaving your clothes on the hardwood floor\nToxic as hell but you know that it's real\nNobody else make me feel how I feel" },
      { id: "b_ts_8", type: "bridge", label: "Bridge", text: "Why do we always repeat the mistake?\nHow many promises can we still break?\nSun's coming up and the high starts to fade\nLiving with every decision we made" },
      { id: "b_ts_9", type: "solo", label: "Solo", text: "(Oh, yeah...)\n(Why do we do this?)" },
      { id: "b_ts_10", type: "chorus", label: "Chorus 3", text: "Henny and midnight thoughts got me fucked up\nPouring more liquor inside of my cup\nYou got that body that I can't replace\nCan't get the memory out of my face\nSay that you hate me then pull up at four\nLeaving your clothes on the hardwood floor\nToxic as hell but you know that it's real\nNobody else make me feel how I feel" },
      { id: "b_ts_11", type: "outro", label: "Outro", text: "Yeah... three AM thoughts\nTuneBloom Master\nFade to dark" }
    ]
  });

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
      { id: "b_jcb_1", type: "intro", label: "Intro", text: "Jersey! TuneBloom in the mix!\nPut your hands up, let's get it!\nRock your hips, rock your hips!\nGo!" },
      { id: "b_jcb_2", type: "verse", label: "Verse 1", text: "Step in the circle, show 'em what you got\nTaking the rhythm and making it hot\nLeft foot, right foot, hit the floor\nEverybody screaming and asking for more\nBassline bumping right in the chest\nJersey club bounce is the absolute best\nFast tempo moving, never gon' stall\nTaking the party and rocking the hall" },
      { id: "b_jcb_3", type: "build", label: "Build-Up 1", text: "Work it, work it, let it go!\nThree, two, one, hit the floor!" },
      { id: "b_jcb_4", type: "drop", label: "Drop 1", text: "Rock that body! Shake that ass!\nPut the whole party right on blast!\n(Work! Work! Let's go!)" },
      { id: "b_jcb_5", type: "verse", label: "Verse 2", text: "Sweat on the forehead, energy peaked\nGiving them everything they came to seek\nDJ spinning the hottest release\nMaking the excitement never decrease\nTurn up the monitors, let it all bang\nRep for the city and rep for the gang\nHands to the ceiling, feet off the ground\nNobody messing with Jersey sound" },
      { id: "b_jcb_6", type: "build", label: "Build-Up 2", text: "Work it, work it, let it go!\nThree, two, one, hit the floor!" },
      { id: "b_jcb_7", type: "drop", label: "Drop 2", text: "Break it down! Let's go!\n(Rock! Rock! Hit the floor!)" },
      { id: "b_jcb_8", type: "breakdown", label: "Breakdown", text: "Jersey vibe in the atmosphere\nMaking it crystal clean and clear\nWhen the kick drum hits the floor\nYou already know what we came here for" },
      { id: "b_jcb_9", type: "build", label: "Build-Up 3", text: "All my people make some noise!\nLet's go!" },
      { id: "b_jcb_10", type: "drop", label: "Drop 3", text: "Rock your hips! Shake that ass!\nJersey Master in the class!\n(Work it! Let's go!)" },
      { id: "b_jcb_11", type: "outro", label: "Outro", text: "Yeah! TuneBloom Jersey Club Master\nDrop\n(Work!)" }
    ]
  });

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
      { id: "b_dh_1", type: "intro", label: "Intro", text: "Brap! TuneBloom sound system!\nBig up every dancer inna di dancehall!\nWine up your body, gyal!\nPull up di selector!" },
      { id: "b_dh_2", type: "verse", label: "Verse 1", text: "Gyal a wine to di riddim and she move so tight\nKingston city burning bright tonight\nHeavy bassline a rattle up di entire sound\nBaddest dancers a take over di town\nMi see di waistline a move inna slow motion\nCausing pure trouble and commotion\nStep inna di party with di natural flex\nNobody worry 'bout who coming next" },
      { id: "b_dh_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Wine up, bend down, touch di floor\nGive di selector something fi adore\nTemperature boiling right to di max\nFull dancehall power, straight facts" },
      { id: "b_dh_4", type: "chorus", label: "Chorus 1", text: "Kingston heatwave inna di place!\nWine up your body and set di pace!\nGyal you a win, nobody fit contest\nDancehall champion, you a di best!\n(Wine, wine, wine up your waist)\n(Kingston sound, nobody can replace)" },
      { id: "b_dh_5", type: "verse", label: "Verse 2", text: "Champagne popping and di vibe stay real\nNobody duplicate di way dat we feel\nSound system pumping with maximum bass\nLighting up every single square of di space\nHer body bad, she know she look clean\nFinest queen dat di island ever seen\nMove to di left and then back to di right\nWe mash up di dance till di morning light" },
      { id: "b_dh_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Wine up, bend down, touch di floor\nGive di selector something fi adore\nTemperature boiling right to di max\nFull dancehall power, straight facts" },
      { id: "b_dh_7", type: "chorus", label: "Chorus 2", text: "Kingston heatwave inna di place!\nWine up your body and set di pace!\nGyal you a win, nobody fit contest\nDancehall champion, you a di best!" },
      { id: "b_dh_8", type: "bridge", label: "Bridge", text: "Rewind selecta, make it roll again\nFrom Kingston town straight to every friend\nAuthentic energy dat cannot fake\nFeel how di heavy ground start to shake" },
      { id: "b_dh_9", type: "solo", label: "Solo", text: "(Pull up! Brap!)\n(Selector!)" },
      { id: "b_dh_10", type: "chorus", label: "Chorus 3", text: "Kingston heatwave inna di place!\nWine up your body and set di pace!\nGyal you a win, nobody fit contest\nDancehall champion, you a di best!\n(Pull up dat!)" },
      { id: "b_dh_11", type: "outro", label: "Outro", text: "Brap! Kingston sound\nTuneBloom Dancehall Master\nDone\n(Pull up!)" }
    ]
  });

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
      { id: "b_syn_1", type: "intro", label: "Intro", text: "Grid status: Overclocked\nIgnition sequence engaged\n(Engage!)" },
      { id: "b_syn_2", type: "verse", label: "Verse 1", text: "Chromium skyline bleeding in the rain\nZero-latency adrenaline through every vein\nSpeedometer redlining past the perimeter line\nRunning through the shadows at the edge of time" },
      { id: "b_syn_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Sensors ignite, engines awake\nToo much momentum for the system to break\nTarget acquired, locking the sight\nWe burn across the cybernetic night" },
      { id: "b_syn_4", type: "chorus", label: "Chorus 1", text: "Push it into neon overdrive\nOnly the electric are gonna survive\nShatter the barrier, tear up the street\nLocked to the pulse of the digital beat" },
      { id: "b_syn_5", type: "verse", label: "Verse 2", text: "Signal reflections in the visor glow\nHigh-voltage rhythm moving down below\nNo looking back when the sirens rise\nChasing the horizon under synthetic skies" },
      { id: "b_syn_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Sensors ignite, engines awake\nToo much momentum for the system to break\nTarget acquired, locking the sight\nWe burn across the cybernetic night" },
      { id: "b_syn_7", type: "chorus", label: "Chorus 2", text: "Push it into neon overdrive\nOnly the electric are gonna survive\nShatter the barrier, tear up the street\nLocked to the pulse of the digital beat" },
      { id: "b_syn_8", type: "bridge", label: "Bridge", text: "Overload the circuit, let the voltage peak\nFinding the transcendence that we came to seek\nFrequency rising, tearing through the noise\nListen to the thunder of the engine voice" },
      { id: "b_syn_9", type: "solo", label: "Solo", text: "(Overdrive!)\n(Systems redline!)" },
      { id: "b_syn_10", type: "chorus", label: "Chorus 3", text: "Push it into neon overdrive\nOnly the electric are gonna survive\nShatter the barrier, tear up the street\nLocked to the pulse of the digital beat" },
      { id: "b_syn_11", type: "outro", label: "Outro", text: "System cooling down...\nDecelerating from orbit...\nPulse... fading... static" }
    ]
  });

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
      { id: "b_neo_1", type: "intro", label: "Intro", text: "Mmm-mmm, yeah\nRight where we need to be\n(Right here)" },
      { id: "b_neo_2", type: "verse", label: "Verse 1", text: "Sunlight spilling on the hardwood floor\nCoffee steaming by the open door\nTime moves slower when you're in the room\nEvery little silence begins to bloom" },
      { id: "b_neo_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "No rush against the ticking hand\nDrifting like golden desert sand\nYou smile and tilt your head away\nNothing else matters in the day" },
      { id: "b_neo_4", type: "chorus", label: "Chorus 1", text: "Caught in the golden hour light\nEverything feels easy and right\nLet the world keep rushing on by\nWe've got the sun and the morning sky" },
      { id: "b_neo_5", type: "verse", label: "Verse 2", text: "Unfinished melodies written on a page\nStepping off the rush of the modern stage\nJust your fingers tapping out a simple chord\nRichest peace that we could afford" },
      { id: "b_neo_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "No rush against the ticking hand\nDrifting like golden desert sand\nYou smile and tilt your head away\nNothing else matters in the day" },
      { id: "b_neo_7", type: "chorus", label: "Chorus 2", text: "Caught in the golden hour light\nEverything feels easy and right\nLet the world keep rushing on by\nWe've got the sun and the morning sky" },
      { id: "b_neo_8", type: "bridge", label: "Bridge", text: "No hurry, no race to win\nJust breathing the morning in\nHarmonies settling in the air\nWithout a single heavy care" },
      { id: "b_neo_9", type: "solo", label: "Solo", text: "(Mmm... yeah)\n(Golden hour)" },
      { id: "b_neo_10", type: "chorus", label: "Chorus 3", text: "Caught in the golden hour light\nEverything feels easy and right\nLet the world keep rushing on by\nWe've got the sun and the morning sky" },
      { id: "b_neo_11", type: "outro", label: "Outro", text: "Stay right here...\nGolden hour...\n(Mmm...)" }
    ]
  });

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
      { id: "b_pop_1", type: "intro", label: "Intro", text: "(Drifting out...)\n(Far away...)" },
      { id: "b_pop_2", type: "verse", label: "Verse 1", text: "Salt air drifting through the open car\nWondering if we traveled far\nWater gleaming in the afternoon haze\nLost in the rhythm of the summer days" },
      { id: "b_pop_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Past the dunes where the grasses sway\nWatching the daylight slip away\nColors bleeding into the tide\nWith the whole wide world on our side" },
      { id: "b_pop_4", type: "chorus", label: "Chorus 1", text: "Wash away into the coastal tide\nNowhere left we need to hide\nFloating on the current out to sea\nJust you and the open horizon with me" },
      { id: "b_pop_5", type: "verse", label: "Verse 2", text: "Footprints washed from the shoreline track\nNo clear reason for looking back\nSun sinking low into shades of rose\nWhere the cool evening current flows" },
      { id: "b_pop_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Past the dunes where the grasses sway\nWatching the daylight slip away\nColors bleeding into the tide\nWith the whole wide world on our side" },
      { id: "b_pop_7", type: "chorus", label: "Chorus 2", text: "Wash away into the coastal tide\nNowhere left we need to hide\nFloating on the current out to sea\nJust you and the open horizon with me" },
      { id: "b_pop_8", type: "bridge", label: "Bridge", text: "Let the waves crash high above\nEverything we were dreaming of\nCatch the swell before it breaks\nFor all our memories' sakes" },
      { id: "b_pop_9", type: "solo", label: "Solo", text: "(Ooh...)\n(Lost in the tide...)" },
      { id: "b_pop_10", type: "chorus", label: "Chorus 3", text: "Wash away into the coastal tide\nNowhere left we need to hide\nFloating on the current out to sea\nJust you and the open horizon with me" },
      { id: "b_pop_11", type: "outro", label: "Outro", text: "Out to sea...\nJust you and me...\n(Fade into the mist...)" }
    ]
  });

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
      { id: "b_hip_1", type: "intro", label: "Intro", text: "Check the levels on the tape deck\nOne, two... yeah\nDropping the needle on ninety-two\n(Listen close)" },
      { id: "b_hip_2", type: "verse", label: "Verse 1", text: "Sifting through the crates in the basement store\nFinding rare gems on the dusty floor\nTwelve-bit textures hitting hard on the one\nMaking classic rhythm till the rising sun\nPen on the notebook, capturing the rhyme\nEvery single syllable is locked in time" },
      { id: "b_hip_3", type: "hook", label: "Hook 1", text: "Keep the rhythm raw, never compromise\nRocking on the beat right before your eyes\nCrate diggers anthem from the underground\nPure authentic feeling in the master sound" },
      { id: "b_hip_4", type: "verse", label: "Verse 2", text: "Analog warmth through the vacuum tube\nCutting straight through the surrounding cube\nHeavy bass foundation rattling the trunk\nNothing artificial, just the real raw funk\nKick-snare cadence walking down the block\nSynchronized perfectly to turn the clock" },
      { id: "b_hip_5", type: "breakdown", label: "Breakdown", text: "Let the groove breathe for a minute\nReal audio craftsmanship with soul inside it\n(Yeah, real hip hop)" },
      { id: "b_hip_6", type: "hook", label: "Hook 2", text: "Keep the rhythm raw, never compromise\nRocking on the beat right before your eyes\nCrate diggers anthem from the underground\nPure authentic feeling in the master sound" },
      { id: "b_hip_7", type: "verse", label: "Verse 3", text: "Mastering the craft till the break of day\nStacking up the reels in a clean display\nTimeless frequency living in the groove\nGive the people something that can make them move" },
      { id: "b_hip_8", type: "bridge", label: "Bridge", text: "From the SP pads to the master reel\nYou can never duplicate the way we feel\nHarmonic overtones ringing in the room\nEngineered precision in the sonic bloom" },
      { id: "b_hip_9", type: "solo", label: "Solo", text: "(Scratch that!)\n(Cut it up, yeah!)" },
      { id: "b_hip_10", type: "hook", label: "Hook 3", text: "Keep the rhythm raw, never compromise\nRocking on the beat right before your eyes\nCrate diggers anthem from the underground\nPure authentic feeling in the master sound" },
      { id: "b_hip_11", type: "outro", label: "Outro", text: "Fading out on the groove\nClassic master tape finish\n(Peace)" }
    ]
  });

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
      { id: "b_met_1", type: "intro", label: "Intro", text: "GO!\n(Break the cycle!)" },
      { id: "b_met_2", type: "verse", label: "Verse 1", text: "Shattered glass on the concrete floor\nCan't find the truth behind this broken door\nFractured timelines tearing in two\nSearching for the anchor to pull me through\nPressure building inside the core\nWe can't ignore the warning anymore!" },
      { id: "b_met_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Tearing through the veil of reality\nSevering the chains of our gravity\nLook into the fire and take the stand\nEverything we built is in our hands!" },
      { id: "b_met_4", type: "chorus", label: "Chorus 1", text: "Stand in the eye of the quantum storm!\nReinvent the ashes and take new form!\nThrough the darkest void we ignite the spark\nLeave an everlasting light in the dark!" },
      { id: "b_met_5", type: "verse", label: "Verse 2", text: "Zero tolerance for the silent decay\nWash all the compromised illusions away\nBinary structures collapse to dust\nIn our own conviction we put our trust\nFeel the recoil, embrace the sound\nNothing can tear our foundation down!" },
      { id: "b_met_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Tearing through the veil of reality\nSevering the chains of our gravity\nLook into the fire and take the stand\nEverything we built is in our hands!" },
      { id: "b_met_7", type: "chorus", label: "Chorus 2", text: "Stand in the eye of the quantum storm!\nReinvent the ashes and take new form!\nThrough the darkest void we ignite the spark\nLeave an everlasting light in the dark!" },
      { id: "b_met_8", type: "breakdown", label: "Breakdown", text: "BREAK THE MATRIX!\n(BLEGH!)" },
      { id: "b_met_9", type: "solo", label: "Solo", text: "(Ignite the spark!)" },
      { id: "b_met_10", type: "chorus", label: "Chorus 3", text: "Stand in the eye of the quantum storm!\nReinvent the ashes and take new form!\nThrough the darkest void we ignite the spark\nLeave an everlasting light in the dark!" },
      { id: "b_met_11", type: "outro", label: "Outro", text: "Quantum break\nNothing remains\nSilence" }
    ]
  });

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
      { id: "b_cnt_1", type: "intro", label: "Intro", text: "Yeah, rolling down County Line\nJust like old times\n(Let's ride)" },
      { id: "b_cnt_2", type: "verse", label: "Verse 1", text: "Old pine trees leaning by the gravel road\nCarrying sixty miles worth of heavy load\nGot the windows down catching that summer rain\nWashing all the rust off this two-lane lane\nBoot heels worn from the honest grind\nLeaving every troubled thought way behind" },
      { id: "b_cnt_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Sun sinking down past the harvest grain\nNothing quite cures like an open plain\nTurn the dial up till the speakers roar\nTo the songs that we've been waiting for" },
      { id: "b_cnt_4", type: "chorus", label: "Chorus 1", text: "Running on dust, diesel, and prayers tonight\nChasing the red glow of the taillight\nNothing in this world can slow me down\nThirty miles past the edge of town\nGot a full tank and a clear blue sky\nWatching all the hard miles roll on by" },
      { id: "b_cnt_5", type: "verse", label: "Verse 2", text: "Silver moonlight shining on the tractor line\nNeighbor's porch light burning like a friendly sign\nWorking with your hands gives you peace of mind\nBest kind of freedom you can ever find\nHard-earned dollar and a faithful heart\nKnowing right where the real things start" },
      { id: "b_cnt_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Sun sinking down past the harvest grain\nNothing quite cures like an open plain\nTurn the dial up till the speakers roar\nTo the songs that we've been waiting for" },
      { id: "b_cnt_7", type: "chorus", label: "Chorus 2", text: "Running on dust, diesel, and prayers tonight\nChasing the red glow of the taillight\nNothing in this world can slow me down\nThirty miles past the edge of town\nGot a full tank and a clear blue sky\nWatching all the hard miles roll on by" },
      { id: "b_cnt_8", type: "bridge", label: "Bridge", text: "There's a comfort in the rhythm of the highway line\nKnowing that the future's gonna turn out fine\nKeep your eyes on the horizon ahead\nRemembering every word that mama said" },
      { id: "b_cnt_9", type: "solo", label: "Solo", text: "(Play that steel...)\n(Yeah, buddy)" },
      { id: "b_cnt_10", type: "chorus", label: "Chorus 3", text: "Running on dust, diesel, and prayers tonight\nChasing the red glow of the taillight\nNothing in this world can slow me down\nThirty miles past the edge of town\nGot a full tank and a clear blue sky\nWatching all the hard miles roll on by" },
      { id: "b_cnt_11", type: "outro", label: "Outro", text: "Just rolling on home...\nDust and diesel\n(All the way home)" }
    ]
  });

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
      { id: "b_lat_1", type: "intro", label: "Intro", text: "Dímelo... TuneBloom\nLa noche está llamando\nBailando suave, tú y yo\n(Fuego!)" },
      { id: "b_lat_2", type: "verse", label: "Verse 1", text: "Luces bajas en la ciudad\nTu mirada dice la verdad\nTe acercas lento sin preguntar\nEl ritmo empieza a acelerar\nMoviéndote con esa elegancia\nEliminando toda la distancia" },
      { id: "b_lat_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "La música sube y no podemos parar\nEl bajo retumba hasta hacernos vibrar\nBailando pegados bajo el resplandor\nSintiendo en el pecho este gran calor" },
      { id: "b_lat_4", type: "chorus", label: "Chorus 1", text: "Hay fuego en la noche, déjate llevar\nNadie como tú me puede controlar\nCon ese movimiento me vas a matar\nHasta que la luna se vaya a ocultar\n(Fuego, fuego... bien pegao)" },
      { id: "b_lat_5", type: "verse", label: "Verse 2", text: "Whiskey en la mesa, humo en el salón\nSincronizados en la misma emoción\nTu cuerpo sabe cómo navegar\nCada compás me vuelve a atrapar\nNo hay prisa cuando se siente así\nTodo lo que quiero lo encuentro en ti" },
      { id: "b_lat_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "La música sube y no podemos parar\nEl bajo retumba hasta hacernos vibrar\nBailando pegados bajo el resplandor\nSintiendo en el pecho este gran calor" },
      { id: "b_lat_7", type: "chorus", label: "Chorus 2", text: "Hay fuego en la noche, déjate llevar\nNadie como tú me puede controlar\nCon ese movimiento me vas a matar\nHasta que la luna se vaya a ocultar" },
      { id: "b_lat_8", type: "bridge", label: "Bridge", text: "Suavemente al oído susúrrame\nQue esta noche nunca se termine\nElevando el tempo sin condición\nSomos la chispa de la creación" },
      { id: "b_lat_9", type: "solo", label: "Solo", text: "(Dale!)\n(Fuego!)" },
      { id: "b_lat_10", type: "chorus", label: "Chorus 3", text: "Hay fuego en la noche, déjate llevar\nNadie como tú me puede controlar\nCon ese movimiento me vas a matar\nHasta que la luna se vaya a ocultar\n(Fuego en la noche... tú y yo)" },
      { id: "b_lat_11", type: "outro", label: "Outro", text: "Así mismito...\nHasta que salga el sol\nFuego" }
    ]
  });

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
      { id: "b_hou_1", type: "intro", label: "Intro", text: "(Echoes in the dark...)\n(Feel the frequency rising...)" },
      { id: "b_hou_2", type: "verse", label: "Verse 1", text: "Drifting through the endless blue\nEvery shadow turning into light with you\nBoundless ocean beneath the sky\nWatching ancient constellations passing by" },
      { id: "b_hou_3", type: "build", label: "Build-Up 1", text: "Frequency climbing higher and higher\nIgniting the universal fire\nFeel the pressure start to rise\nOpen up your eyes!" },
      { id: "b_hou_4", type: "drop", label: "Drop 1", text: "(Let it rise!)\n(Higher, higher!)" },
      { id: "b_hou_5", type: "verse", label: "Verse 2", text: "Weightless in the sonic stream\nLiving inside a lucid waking dream\nHarmonic overtones fill the room\nEvery single frequency begins to bloom" },
      { id: "b_hou_6", type: "build", label: "Build-Up 2", text: "Frequency climbing higher and higher\nIgniting the universal fire\nRelease the tension, break the wall\nAnswer to the call!" },
      { id: "b_hou_7", type: "drop", label: "Drop 2", text: "(Break the wall!)\n(Elysium!)" },
      { id: "b_hou_8", type: "breakdown", label: "Breakdown", text: "When the world is quiet and still\nWe find the space that love can fill\n(Quiet and still...)" },
      { id: "b_hou_9", type: "build", label: "Build-Up 3", text: "Three... two... one... let it soar!" },
      { id: "b_hou_10", type: "drop", label: "Drop 3", text: "(Soar!)\n(Echoes of Elysium!)" },
      { id: "b_hou_11", type: "outro", label: "Outro", text: "Echoes drifting out...\nInto the light...\nFade away" }
    ]
  });

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
      { id: "b_fnk_1", type: "intro", label: "Intro", text: "Get down!\nYeah, bring it on in\nTuneBloom funk in the pocket\n(Let's groove!)" },
      { id: "b_fnk_2", type: "verse", label: "Verse 1", text: "Spotted shoes on the parquet floor\nCan't keep your feet from heading for the door\nBassline popping right into your soul\nTaking full momentum and complete control\nGot that rhythm locked into the groove\nGiving everybody something to prove" },
      { id: "b_fnk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Hands in the air, feeling the beat\nTurning up the power on the city street\nHorn section blowing till the roof comes down\nBest vibrations in the entire town!" },
      { id: "b_fnk_4", type: "chorus", label: "Chorus 1", text: "Ride on the starlight groove tonight!\nEverything's shining underneath the light!\nShake off the heavy and let it unwind\nLeave all the ordinary far behind!\n(Yeah! Starlight groove!)" },
      { id: "b_fnk_5", type: "verse", label: "Verse 2", text: "Stratocaster scratching out the tempo clean\nFunkier than anything you've ever seen\nSyncopated magic on the two and four\nMaking every dancer come back for more\nGot no worries, got no blues\nJust dynamic rhythm you can never lose" },
      { id: "b_fnk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Hands in the air, feeling the beat\nTurning up the power on the city street\nHorn section blowing till the roof comes down\nBest vibrations in the entire town!" },
      { id: "b_fnk_7", type: "chorus", label: "Chorus 2", text: "Ride on the starlight groove tonight!\nEverything's shining underneath the light!\nShake off the heavy and let it unwind\nLeave all the ordinary far behind!" },
      { id: "b_fnk_8", type: "bridge", label: "Bridge", text: "Break it down to the bass and drum!\nWatch where the heavy groove is coming from!\n(Hit me!)" },
      { id: "b_fnk_9", type: "solo", label: "Solo", text: "(Blow that horn!)\n(Yeah!)" },
      { id: "b_fnk_10", type: "chorus", label: "Chorus 3", text: "Ride on the starlight groove tonight!\nEverything's shining underneath the light!\nShake off the heavy and let it unwind\nLeave all the ordinary far behind!\n(One more time, groove it out!)" },
      { id: "b_fnk_11", type: "outro", label: "Outro", text: "Keep it funky... just like that!\nHit me on the one!\n(Ow!)" }
    ]
  });

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
      { id: "b_rck_1", type: "intro", label: "Intro", text: "Yeah...\n(Here it comes)" },
      { id: "b_rck_2", type: "verse", label: "Verse 1", text: "Cracked ceiling staring down at me\nTrapped inside this quiet frequency\nCounting seconds till the engine turns\nWatching how the slow ignition burns\nWords written down on a crumpled sheet\nEchoing across the empty street" },
      { id: "b_rck_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Turn up the feedback, let it scream\nNothing is ever quite what it seems\nTension stretching till the wire snaps\nFalling right into the open traps" },
      { id: "b_rck_4", type: "chorus", label: "Chorus 1", text: "Caught in the static and the rust!\nWatching our promises turn to dust!\nScream at the wall till the shadows break\nFor all the chances we didn't take!" },
      { id: "b_rck_5", type: "verse", label: "Verse 2", text: "Old photographs on the painted wall\nWaiting for the heavy rain to fall\nScars on the knuckle from the fight we chose\nKnowing how the bitter story goes\nNo more apologies, no more delay\nTime to wash the compromise away" },
      { id: "b_rck_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Turn up the feedback, let it scream\nNothing is ever quite what it seems\nTension stretching till the wire snaps\nFalling right into the open traps" },
      { id: "b_rck_7", type: "chorus", label: "Chorus 2", text: "Caught in the static and the rust!\nWatching our promises turn to dust!\nScream at the wall till the shadows break\nFor all the chances we didn't take!" },
      { id: "b_rck_8", type: "bridge", label: "Bridge", text: "Strip it down to the raw bone frame\nNobody else left that we can blame\nIgnite the fuel and let it go\nDown in the fire down below" },
      { id: "b_rck_9", type: "solo", label: "Solo", text: "(Let it burn!)\n(Yeah!)" },
      { id: "b_rck_10", type: "chorus", label: "Chorus 3", text: "Caught in the static and the rust!\nWatching our promises turn to dust!\nScream at the wall till the shadows break\nFor all the chances we didn't take!" },
      { id: "b_rck_11", type: "outro", label: "Outro", text: "Static and rust...\nNothing left...\nDust" }
    ]
  });

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
      { id: "b_orc_1", type: "intro", label: "Intro", text: "Aeterna lux...\n(Surge ad astra)" },
      { id: "b_orc_2", type: "verse", label: "Verse 1", text: "Across the mountain ridge the storm unfolds\nA legacy of iron, blood, and gold\nThrough freezing winds the ancient banner flies\nUnder the gaze of dark immortal skies\nHold the perimeter, protect the flame\nHonor the glory of the fallen name" },
      { id: "b_orc_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Aeterna lux, veritas in armis\nSurge ad astra, victoria nos vocat" },
      { id: "b_orc_4", type: "chorus", label: "Chorus 1", text: "Rise from the ashes of the battleground!\nWhere destiny and courage can be found!\nWith wings of iron we ascend the crest\nPutting our mortal fear to rest!" },
      { id: "b_orc_5", type: "verse", label: "Verse 2", text: "The thunder echoes through the frozen canyon deep\nA sacred vigil that we swear to keep\nNo sword shall falter in the decisive hour\nWe stand as guardians of transcendent power\nThrough every trial we shall remain\nUnbroken by the tempest and the pain" },
      { id: "b_orc_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Aeterna lux, veritas in armis\nSurge ad astra, victoria nos vocat" },
      { id: "b_orc_7", type: "chorus", label: "Chorus 2", text: "Rise from the ashes of the battleground!\nWhere destiny and courage can be found!\nWith wings of iron we ascend the crest\nPutting our mortal fear to rest!" },
      { id: "b_orc_8", type: "breakdown", label: "Breakdown", text: "In silentio noctis\nGloria in excelsis" },
      { id: "b_orc_9", type: "solo", label: "Solo", text: "(Victoria!)\n(Aeterna!)" },
      { id: "b_orc_10", type: "chorus", label: "Chorus 3", text: "Rise from the ashes of the battleground!\nWhere destiny and courage can be found!\nWith wings of iron we ascend the crest\nPutting our mortal fear to rest!" },
      { id: "b_orc_11", type: "outro", label: "Outro", text: "Victoria nos vocat\nAscendit in astra\nAmen" }
    ]
  });

  window.TuneBloomBlueprints = registry;
})(window);