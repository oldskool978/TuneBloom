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
      { id: "b_rnb_1", type: "intro", label: "Intro", text: "Yeah, listen\nMidnight in the city, let the groove breathe\nGot you on my mind tonight\nYeah, don't rush the tempo\n(Oh, oh-woah, yeah)\n(Keep it right there, baby)" },
      { id: "b_rnb_2", type: "verse", label: "Verse 1", text: "Midnight riding under neon streetlights\nSearching for the answers in the rearview mirror\nThought I had the blueprint solid in my mind\nNow the silhouette of you is drawing nearer\nDashboard glowing with a steady slow pulse\nEchoes of your whisper in the night air\nEvery little touch that we used to share\nPulling up outside your door, yeah I know you're there\nTwo in the morning, got that look in your eyes\nNo more games and no more sweet alibis" },
      { id: "b_rnb_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "I try to fight it, but it's pulling me in\nEvery harmonic frequency starts spinning again\nTension rising from the bottom to top\nGot that momentum and we never gon' stop\nFeel the sub-bass vibrating down through the floor\nEvery little kiss just leaves me begging for more\n(Yeah, begging for more)" },
      { id: "b_rnb_4", type: "chorus", label: "Chorus 1", text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\nSinking deep inside the pocket of sound\nBest damn love that we ever have found\n(Yeah, yeah, keep it right there)\n(Nobody does it like you do)" },
      { id: "b_rnb_5", type: "verse", label: "Verse 2", text: "Two-thirty now and the bassline taking over\nSip of something smooth, leaning in a little closer\nSilk on your skin, candlelight on the wall\nAnswering the passion every time that you call\nSyncopated touch, perfect timing on the beat\nFire in our eyes, generating pure heat\nGot your hands running through my hair real slow\nTaking full control of the rhythm and flow\nWhisper in my ear what you need me to do\nSpend the whole night making love to you" },
      { id: "b_rnb_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "I try to fight it, but it's pulling me in\nEvery harmonic frequency starts spinning again\nTension rising from the bottom to top\nGot that momentum and we never gon' stop\nFeel the sub-bass vibrating down through the floor\nEvery little kiss just leaves me begging for more\n(Oh yeah, give me more)" },
      { id: "b_rnb_7", type: "chorus", label: "Chorus 2", text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\nSinking deep inside the pocket of sound\nBest damn love that we ever have found\n(Yeah, yeah, right into the pocket)\n(Don't you ever let me go)" },
      { id: "b_rnb_8", type: "bridge", label: "Bridge", text: "Take it to the falsetto high, let the bass drop clean\nSmoothest vibration that you've ever seen\nCounterpoint melodies weaving around\nElevating the pressure, capturing the sound\nHold that note, let the energy soar\nTake it to places that we never went before\nJust breathe with me, stay right inside the groove\nNothing left in this world we gotta prove\n(Oh, nothing left to prove)" },
      { id: "b_rnb_9", type: "solo", label: "Solo", text: "(Oh, yeah... take it all the way up)\n(Ride the wave, baby)\n(Ooh-woah... yeah)\n(Yeah, yeah, yeah)" },
      { id: "b_rnb_10", type: "chorus", label: "Chorus 3", text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\nSinking deep inside the pocket of sound\nBest damn love that we ever have found\n(Oh-woah, give me one more time)\n(Lock it down in the midnight groove)" },
      { id: "b_rnb_11", type: "outro", label: "Outro", text: "Fade into the low-end frequency\nKeep the drum pocket steady for me\nSun's coming up but we staying right here\nWhisper in my ear keep it crystal and clear\n(Yeah, just like that)\n(Stay right there)\n(TuneBloom R&B Master)\n(Fade to black)" }
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
      { id: "b_trp_1", type: "intro", label: "Intro", text: "(Yeah! What?)\nTurn that shit up in the monitors\nLook, ain't no cap in my section, nigga\nWe ran the whole city up, let's get it\nZone six all day, you know how we comin'\n(Let's go! Racks!)" },
      { id: "b_trp_2", type: "verse", label: "Verse 1", text: "Came from the mud, now the wrist on freeze\nPopping big tags like it's nothing to me\nNiggas was talking, they broke on they knees\nNow I get paid just to breathe in the breeze\nBad bitch beside me, she bad as a sin\nDrop the top down let the turbo kick in\nFuck what they saying, I came here to win\nCounting these hundreds and doing it again\nStack on my wrist and my circle stay tight\nGlock in the console, we ready tonight\nThirty-round mag when we slide through the dark\nLight up the block with a dangerous spark\nUsed to be trappin' in front of the store\nNow we get fifty a show and we want even more" },
      { id: "b_trp_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Niggas keep flexing on gram for the clout\nI put the work in, they know what I'm 'bout\nCash on the table, no running your mouth\nKing of the city, we running the South\nWhole team eating, we setting the pace\nPut a half a ticket right in they face\n(Yeah! What? Let's go!)" },
      { id: "b_trp_4", type: "chorus", label: "Chorus 1", text: "Ain't no cap in my section, you know how we rock\nBroke niggas talking, they watching the clock\nTurn up the bass till it shatter the block\nTaking that top spot and locking the lock\nYeah, we running this shit\n(Nigga!)\nWhole squad rich and we never gon' quit\nBad ass vibe and she lit in the pit\nFuck all the fake shit, you know who this is\n(Yeah! No cap!)" },
      { id: "b_trp_5", type: "verse", label: "Verse 2", text: "Pulled out the foreign, the leather is red\nNiggas be worried 'bout what someone said\nI'm stacking paper and breaking the bread\nKeep all my family protected and fed\nHit up the jeweler, the chain hit like flash\nWhipping that work, put my foot on the gas\nShorty got body, she shaking that ass\nSpending this money and making it last\nNever went broke, kept my head on a swivel\nPressure too heavy, you niggas will cripple\nRolls Royce Cullinan parked on the lawn\nWe count up a million before it hit dawn\nDiamonds dancing on my pinky and thumb\nLaughing straight to the bank while the dividends come" },
      { id: "b_trp_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Niggas keep flexing on gram for the clout\nI put the work in, they know what I'm 'bout\nCash on the table, no running your mouth\nKing of the city, we running the South\nWhole team eating, we setting the pace\nPut a half a ticket right in they face\n(Yeah! On God!)" },
      { id: "b_trp_7", type: "chorus", label: "Chorus 2", text: "Ain't no cap in my section, you know how we rock\nBroke niggas talking, they watching the clock\nTurn up the bass till it shatter the block\nTaking that top spot and locking the lock\nYeah, we running this shit\n(What?)\nWhole squad rich and we never gon' quit\nBad ass vibe and she lit in the pit\nFuck all the fake shit, you know who this is\n(Straight up!)" },
      { id: "b_trp_8", type: "bridge", label: "Bridge", text: "They tried to count a young nigga right out\nNow look at the penthouse, look at the route\nTurned every whisper to screams and a shout\nNobody can tell me what hustle's about\nCame from the dirt with a fire inside\nNow the whole universe along for the ride\n(No cap! For real!)" },
      { id: "b_trp_9", type: "solo", label: "Solo", text: "(Turn me up!)\n(Yeah, yeah, yeah!)\n(Brrrt! Racks on racks!)\n(Count it up, nigga!)" },
      { id: "b_trp_10", type: "chorus", label: "Chorus 3", text: "Ain't no cap in my section, you know how we rock\nBroke niggas talking, they watching the clock\nTurn up the bass till it shatter the block\nTaking that top spot and locking the lock\nYeah, we running this shit\nWhole squad rich and we never gon' quit\nBad ass vibe and she lit in the pit\nFuck all the fake shit, you know who this is" },
      { id: "b_trp_11", type: "outro", label: "Outro", text: "Yeah, no cap\nStraight facts\nTuneBloom Master\nATL to the world\nWe gone\n(Bitch!)" }
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
      { id: "b_drl_1", type: "intro", label: "Intro", text: "(Grrt! Bow!)\nLook, don't play with me nigga\nYou know the routine\nBronx state of mind, get it right\nEvery time we touch down, niggas duck down\n(Bow, bow, bow!)\n(Grrt, look)" },
      { id: "b_drl_2", type: "verse", label: "Verse 1", text: "Step in the spot, niggas know it's a problem\nGot all these issues, you know we gon' solve 'em\nDark tint foreign rolling down the Grand Concourse\nKick in the door with the momentum and raw force\nNiggas be cappin', they talking too reckless\nDiamonds be choking me right on my necklace\nFuck with the gang and you find out the hard way\nRunning these blocks from the night to the hallway\nSlide with the eight-o-eight, hear how it rumble\nStep in the jungle, you slip and you tumble\nOpp on the corner, he looking real nervous\nWe put in the work and we provide the service\nMoncler coat when the winter get freezing\nDoing this shit for a very good reason\n(Grrt! Bow!)" },
      { id: "b_drl_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "They see the vision, they hating the rise\nI see the fake in the back of their eyes\nWe take the city, no room for disguise\nLook at the score, see who really survives\nLock the whole borough, we setting the trap\nNone of you niggas can put us on map\n(Bow!)" },
      { id: "b_drl_4", type: "chorus", label: "Chorus 1", text: "Bronx protocol, niggas know we don't play\nClearing the lane when we come out the way\nGrrt, bow, do what we want every day\nStacking this money, there's nothing to say\nYeah, you hear the sub hit the chest\nBulletproof armor, we putting to rest\nAll of the nonsense, we taking the best\nReal drill heavyweight passing the test\n(Bow! Bow!)" },
      { id: "b_drl_5", type: "verse", label: "Verse 2", text: "Catch 'em off guard with the timing and cadence\nNobody stopping the moves that we making\nCame from the baseline, the concrete and pavement\nLook at the checks and the empire created\nBitch on my arm and she looking exotic\nBass in the trunk and the pressure psychotic\nNever folded under heat, we iconic\nSpitting pure truth, every bar is harmonic\nFuck who was doubting, we standing right here\nMaking them feel every second of fear\nTwo-tone Glock with the switch on the back\nWe don't negotiate, we just attack\nFrom Fordham Road down to Hundred Forty-Ninth\nKing of the streets and we standing in rank" },
      { id: "b_drl_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "They see the vision, they hating the rise\nI see the fake in the back of their eyes\nWe take the city, no room for disguise\nLook at the score, see who really survives\nLock the whole borough, we setting the trap\nNone of you niggas can put us on map\n(Grrt!)" },
      { id: "b_drl_7", type: "chorus", label: "Chorus 2", text: "Bronx protocol, niggas know we don't play\nClearing the lane when we come out the way\nGrrt, bow, do what we want every day\nStacking this money, there's nothing to say\nYeah, you hear the sub hit the chest\nBulletproof armor, we putting to rest\nAll of the nonsense, we taking the best\nReal drill heavyweight passing the test\n(Bow!)" },
      { id: "b_drl_8", type: "bridge", label: "Bridge", text: "No backing down\nLock the perimeter, hold the whole town\nKings of the sound, who taking the crown?\nReal niggas only when we touch the ground\nLook at the pavement, the city is ours\nTaking the power straight up to the stars\n(Grrt, bow!)" },
      { id: "b_drl_9", type: "solo", label: "Solo", text: "(Bow! Bow! Bow!)\n(Grrt! What?)\n(Slide on 'em!)\n(Don't run now!)" },
      { id: "b_drl_10", type: "chorus", label: "Chorus 3", text: "Bronx protocol, niggas know we don't play\nClearing the lane when we come out the way\nGrrt, bow, do what we want every day\nStacking this money, there's nothing to say\nYeah, you hear the sub hit the chest\nBulletproof armor, we putting to rest\nAll of the nonsense, we taking the best\nReal drill heavyweight passing the test" },
      { id: "b_drl_11", type: "outro", label: "Outro", text: "Grrt... Bow\nTuneBloom Drill\nBronx Master\nEvery single block know the name\nOut\n(Bow!)" }
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
      { id: "b_phk_1", type: "intro", label: "Intro", text: "(Yeah, mane)\n(Triple six in the cut)\nCreepin' through the fog, Glock cocked in the dash\nWatch a busta fold when we step on the gas\nLate night creepin' through the south side\n(What? Yeah! Mane!)" },
      { id: "b_phk_2", type: "verse", label: "Verse 1", text: "Ridin' through the south side, trunk bump loud\nSmoke fill the chamber, lost up in the cloud\nDevil in my ear tellin' me to take the crown\nPut a scary nigga six feet beneath the ground\nTape deck hissin' with that nineteen-ninety-five\nRollin' with the demons, only real ones survive\nCowbell ringin' through the pitch-black street\nBlood on the asphalt, locked into the beat\nMask on my face, you can't see what I'm thinkin'\nDouble cup dirty, that potion I'm drinkin'\nChevy on twenty-twos, sliding on the curb\nNigga talk shit, he gon' get what he deserve\nTommy gun loaded up, sitting on the leather\nEvil ass Memphis shit, dark stormy weather" },
      { id: "b_phk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Late night stalkin' in the dead of the night\nHeadlights off, yeah we killin' the light\nTire smoke risin' when we rip around the bend\nAin't no mercy when the nightmare begin\nHollow point trajectory flying through the air\nLeave a motherfucker freezing in despair\n(Mane!)" },
      { id: "b_phk_4", type: "chorus", label: "Chorus 1", text: "Drift in the shadow, murder in the dark\nLeave a cold stain where the hollow points spark\nCatch a nigga slippin', put that bitch on a shirt\nTen toes down while we dig in the dirt\nYeah, we evil with the rhythm and the flow\nMemphis sound hittin' everywhere that we go\nScreamin' in the alley, nobody hear a sound\nWatch another body sink into the ground\n(Yeah! Mane!)" },
      { id: "b_phk_5", type: "verse", label: "Verse 2", text: "Stepped inside the dungeon with the steel in my grip\nBitch try to talk, slap the taste off her lip\nChopped up cadence from the ninety-one track\nNever look behind, ain't no turnin' on back\nLoaded up the clip with the heavy hollow tip\nSlidin' on the eighty-eight, hear the rubber rip\nNiggas talk heavy till they starin' at the barrel\nWalkin' through the shadow of the valley and the peril\nMoney on my mind and the blood on my hand\nLord of the underground, runnin' the land\nSmokin' on the potent till my eyes turn red\nCounting up the bounty on a scary nigga's head" },
      { id: "b_phk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Late night stalkin' in the dead of the night\nHeadlights off, yeah we killin' the light\nTire smoke risin' when we rip around the bend\nAin't no mercy when the nightmare begin\nHollow point trajectory flying through the air\nLeave a motherfucker freezing in despair" },
      { id: "b_phk_7", type: "chorus", label: "Chorus 2", text: "Drift in the shadow, murder in the dark\nLeave a cold stain where the hollow points spark\nCatch a nigga slippin', put that bitch on a shirt\nTen toes down while we dig in the dirt\nYeah, we evil with the rhythm and the flow\nMemphis sound hittin' everywhere that we go\nScreamin' in the alley, nobody hear a sound\nWatch another body sink into the ground" },
      { id: "b_phk_8", type: "bridge", label: "Bridge", text: "Hear the static in the dark, feel the reaper come close\nGive a busta what he really fear the most\nNo salvation, no prayer in the dark\nWatch the whole city ignite from the spark\nTape looped over and the bass boosted high\nSay your final prayer under stormy grey sky\n(Triple six! Mane!)" },
      { id: "b_phk_9", type: "solo", label: "Solo", text: "(Drift! Mane!)\n(Yeah! What?)\n(Watch out now!)\n(Mane!)" },
      { id: "b_phk_10", type: "chorus", label: "Chorus 3", text: "Drift in the shadow, murder in the dark\nLeave a cold stain where the hollow points spark\nCatch a nigga slippin', put that bitch on a shirt\nTen toes down while we dig in the dirt\nYeah, we evil with the rhythm and the flow\nMemphis sound hittin' everywhere that we go\nScreamin' in the alley, nobody hear a sound\nWatch another body sink into the ground" },
      { id: "b_phk_11", type: "outro", label: "Outro", text: "Yeah, mane\nMemphis underground\nTuneBloom Evil Phonk\nRest in piss\nSmoke clearing out into the night\n(Mane!)" }
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
      { id: "b_wcb_1", type: "intro", label: "Intro", text: "(Yeah! Bay Area!)\nSwing the five-point-oh through the intersection\nGas, brake, dip, nigga\nYou already know what time it is\nOakland to Vallejo, let the synth whine\n(Get stupid! Yee!)" },
      { id: "b_wcb_2", type: "verse", label: "Verse 1", text: "Swinging out the scraper in the middle of the street\nDonut round the fire while we bangin' to the beat\nGot the dreads shakin', whole clique goin' dumb\nWhite-Tee fresh, watch the heavy dollar come\nNigga from the Town, put the city on my back\nTwo-tone Cutlass rollin' heavy on the track\nTell a bad bitch get up in it if she bout it\nPut the top down, ain't a motherfucker doubt it\nSmokin' on the finest out the Oakland dispensary\nBlowin' big cloud, legacy of the century\nGold teeth shining when I smile in the sun\nCounting up forty bands just for the fun\nMac Dre spirit walking right in the room\nDropping heavy bass that can rattle the tomb" },
      { id: "b_wcb_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Watch the tires smoke when we hit that slide\nEvery single rider down for the ride\nHop on the hood, let the whole thing spin\nNiggas in the back countin' up that win\nThrow your dubs in the air if you feeling the vibe\nTrue West Coast, yeah you know it's the tribe\n(Yee!)" },
      { id: "b_wcb_4", type: "chorus", label: "Chorus 1", text: "Sideshow geometry, we rockin' the bay\nDo a whole thirty in the middle of the day\nTell that square nigga get the fuck out the way\nReal West Coast, ain't a thing you can say\nGas, brake, dip, let the bass drum drop\nWe be goin' dumb and we never gon' stop\nPop that collar, keep the dollar on lock\nKing of the pavement, runnin' the block\n(Yee-hee! What?)" },
      { id: "b_wcb_5", type: "verse", label: "Verse 2", text: "Slappin' out the subs till the rearview shatter\nNiggas talk beef, but it really don't matter\nHeavy on the gas, watch the speedometer climb\nEvery single bar is ahead of its time\nGot a thick thang with the gold hoop ring\nTell me that she love how the G-Funk sing\nMac Dre spirit in the air tonight\nMobbin' through the fog under amber light\nGot the hustle encoded in my DNA\nFrom the East Bay streets to the LA bay\nPark the whip sideways, let the speakers blow\nGiving all these squares what they need to know" },
      { id: "b_wcb_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Watch the tires smoke when we hit that slide\nEvery single rider down for the ride\nHop on the hood, let the whole thing spin\nNiggas in the back countin' up that win\nThrow your dubs in the air if you feeling the vibe\nTrue West Coast, yeah you know it's the tribe" },
      { id: "b_wcb_7", type: "chorus", label: "Chorus 2", text: "Sideshow geometry, we rockin' the bay\nDo a whole thirty in the middle of the day\nTell that square nigga get the fuck out the way\nReal West Coast, ain't a thing you can say\nGas, brake, dip, let the bass drum drop\nWe be goin' dumb and we never gon' stop\nPop that collar, keep the dollar on lock\nKing of the pavement, runnin' the block" },
      { id: "b_wcb_8", type: "bridge", label: "Bridge", text: "Tell the DJ let the funky synth whine\nRoll another blunt of the California pine\nStand on the roof, throw the W high\nReppin' for the coast till the day that I die\nKeep the bass in the trunk and the top drop low\nThis is how the real West Coast riders go\n(West Coast! For life!)" },
      { id: "b_wcb_9", type: "solo", label: "Solo", text: "(Talk that shit!)\n(Yeah!)\n(Yee! Mob on 'em!)\n(Bay Area forever!)" },
      { id: "b_wcb_10", type: "chorus", label: "Chorus 3", text: "Sideshow geometry, we rockin' the bay\nDo a whole thirty in the middle of the day\nTell that square nigga get the fuck out the way\nReal West Coast, ain't a thing you can say\nGas, brake, dip, let the bass drum drop\nWe be goin' dumb and we never gon' stop\nPop that collar, keep the dollar on lock\nKing of the pavement, runnin' the block" },
      { id: "b_wcb_11", type: "outro", label: "Outro", text: "Yee!\nTuneBloom West Coast Master\nGas, brake, dip\nSpin the block one more time\nOut\n(Get stupid!)" }
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
      { id: "b_chd_1", type: "intro", label: "Intro", text: "(Glrr! On God!)\nMan what? Niggas know what time it is\nSouth side trenches, keep your head down\nO-Block to the whole city\n(Gang, gang, gang!)\n(Glrr, bow!)" },
      { id: "b_chd_2", type: "verse", label: "Verse 1", text: "Snow falling down on sixty-fourth street\nNiggas outside with the heat on the seat\nDon't step out if you ain't bout that life\nCut through the block like a switchblade knife\nOpp talking reckless on live for a minute\nPulled up in ten, put a whole clip in it\nAin't no remorse for a nigga who snitch\nPut him in the river, leave him cold in a ditch\nDrum on the stick hold fifty-plus rounds\nClean out the block when we makin' the rounds\nHoodie pulled low, we don't look at the face\nCatching the bag, then we clearing the place\nTwo-tone Glock and it came with the beam\nDoing whatever to feed the whole team\n(Boom, boom, boom!)" },
      { id: "b_chd_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Red laser beam pointing straight at your head\nOne wrong move and you already dead\nNo cap rap, every lyric is real\nLivin' by the gun, dyin' by the steel\nStanding right here where the shooters reside\nNowhere for none of you opps to go hide\n(On God! Gang!)" },
      { id: "b_chd_4", type: "chorus", label: "Chorus 1", text: "No mercy in the trenches, you know how we slide\nNiggas be talkin' then runnin' to hide\nHeavy drill bass got the whole block shakin'\nLook at the body and look at the check made\nGang in the cut, we don't ever miss target\nWalk in the room, we the biggest in market\nBlood on the snow, that's the price that you pay\nChicago drill king, do it every damn day\n(Glrr! Gang!)" },
      { id: "b_chd_5", type: "verse", label: "Verse 2", text: "Came from the bottom where mothers be cryin'\nEvery single week another brother be dyin'\nTold myself I was gon' make it on top\nNiggas got smoked when they thought I would stop\nBitch in the hotel counting the bag\nRockin' designer, don't look at the tag\nShooter stay loyal, he ready to dump\nHit from a block away, watch how he jump\nWar in the streets and it never gon' cease\nNiggas want war, ain't no talkin' no peace\nBlack truck idling outside of the store\nReady for whatever, we ready for war" },
      { id: "b_chd_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Red laser beam pointing straight at your head\nOne wrong move and you already dead\nNo cap rap, every lyric is real\nLivin' by the gun, dyin' by the steel\nStanding right here where the shooters reside\nNowhere for none of you opps to go hide" },
      { id: "b_chd_7", type: "chorus", label: "Chorus 2", text: "No mercy in the trenches, you know how we slide\nNiggas be talkin' then runnin' to hide\nHeavy drill bass got the whole block shakin'\nLook at the body and look at the check made\nGang in the cut, we don't ever miss target\nWalk in the room, we the biggest in market\nBlood on the snow, that's the price that you pay\nChicago drill king, do it every damn day" },
      { id: "b_chd_8", type: "bridge", label: "Bridge", text: "Sirens in the distance, smoke in the air\nLook in our eyes, ain't a sliver of fear\nWe run the cold streets, hold down the fort\nTaking you niggas right out of the court\nNever gon' fold under pressure or heat\nUncrowned king of the freezing ass street\n(Gang! Glrr!)" },
      { id: "b_chd_9", type: "solo", label: "Solo", text: "(Glrr! Boom!)\n(Slide on 'em!)\n(On gang!)\n(Man what?)" },
      { id: "b_chd_10", type: "chorus", label: "Chorus 3", text: "No mercy in the trenches, you know how we slide\nNiggas be talkin' then runnin' to hide\nHeavy drill bass got the whole block shakin'\nLook at the body and look at the check made\nGang in the cut, we don't ever miss target\nWalk in the room, we the biggest in market\nBlood on the snow, that's the price that you pay\nChicago drill king, do it every damn day" },
      { id: "b_chd_11", type: "outro", label: "Outro", text: "Man what?\nChicago trenches\nTuneBloom Drill Master\nRest up to all my fallen brothers\n(Glrr, bow!)" }
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
      { id: "b_dtp_1", type: "intro", label: "Intro", text: "(What? Huh? Yeah!)\nFive in the morning, VPN connected to Romania\nJust hit for fifty bands on a fake routing number\nStop playin' with me, nigga\nMichigan to Atlanta, we runnin' through the accounts\n(Let's get it! Huh?)" },
      { id: "b_dtp_2", type: "verse", label: "Verse 1", text: "Woke up at four, made thirty bands before breakfast\nSwiped a card at Saks Fifth, bought a brand new necklace\nNiggas rap about the trap, but they credit score zero\nI just bought my mom a crib, now I'm lookin' like a hero\nOff-beat flow got you niggas confused\nWalked in Neiman Marcus with ten thousand in shoes\nCashier lookin' at the screen like 'how did this pass?'\nPut my signature down, then I step on the gas\nCrypto wallet lookin' fat, got the ledger on ice\nNever paid for a meal in my motherfuckin' life\nGot twenty-four burner phones sitting in a drawer\nEvery single one ringing with a bag from the store\nI don't even rap on beat, but the crowd go crazy\nSpending twenty thousand dollars 'cause my mood feel lazy" },
      { id: "b_dtp_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Punching on the keys, watch the balance go green\nSmoothest young scammer that you ever have seen\nServer in Iceland, proxy is tight\nMaking hundred-thousand dollar deposits tonight\nATM spitting cash right into my lap\nTell these little broke rappers get off the map\n(What? Huh?)" },
      { id: "b_dtp_4", type: "chorus", label: "Chorus 1", text: "Wire transfers at five AM, nigga check the account\nEvery single day we withdraw the maximum amount\nGot the bins, got the slips, got the full-zips loaded\nWhole database in my hand, server just exploded\nYeah, we off the leash with the cash and the punch\nSteak and lobster dinner for a casual lunch\nFuck a job application, we just print out the check\nPut a half a million dollar chain right round the neck\n(Huh? What?)" },
      { id: "b_dtp_5", type: "verse", label: "Verse 2", text: "Pulled up to the dealership with three different names\nWalked out with the Hellcat, this ain't no games\nBank teller asked for ID, handed her a fake\nLooked her in the eye while I took the whole cake\nNigga mad 'cause his girl in my DM requestin'\nSay she wanna fly to Cabo where I be investin'\nI don't even rap on beat, but the music still slaps\nWhile you niggas workin' shifts, I be runnin' through apps\nGot the burner phone ringin' with the foreign alert\nMaking ten bands sittin' in a Balenciaga shirt\nNever went to college, but I majored in fraud\nWalking out the bank looking like a young god" },
      { id: "b_dtp_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Punching on the keys, watch the balance go green\nSmoothest young scammer that you ever have seen\nServer in Iceland, proxy is tight\nMaking hundred-thousand dollar deposits tonight\nATM spitting cash right into my lap\nTell these little broke rappers get off the map" },
      { id: "b_dtp_7", type: "chorus", label: "Chorus 2", text: "Wire transfers at five AM, nigga check the account\nEvery single day we withdraw the maximum amount\nGot the bins, got the slips, got the full-zips loaded\nWhole database in my hand, server just exploded\nYeah, we off the leash with the cash and the punch\nSteak and lobster dinner for a casual lunch\nFuck a job application, we just print out the check\nPut a half a million dollar chain right round the neck" },
      { id: "b_dtp_8", type: "bridge", label: "Bridge", text: "Swipe it once, swipe it twice, do the transaction clear?\nSmilin' at the camera with a forty-carat ear\nNo trace, no case, hit the highway and skate\nNiggas talkin' down while we clearin' the plate\nGot the cash in duffle bags, flying first class\nWatching all the jealous motherfuckers kiss my ass\n(Yeah! What?)" },
      { id: "b_dtp_9", type: "solo", label: "Solo", text: "(Huh? What?)\n(Count that shit up right now!)\n(Punch it!)\n(Cash out!)" },
      { id: "b_dtp_10", type: "chorus", label: "Chorus 3", text: "Wire transfers at five AM, nigga check the account\nEvery single day we withdraw the maximum amount\nGot the bins, got the slips, got the full-zips loaded\nWhole database in my hand, server just exploded\nYeah, we off the leash with the cash and the punch\nSteak and lobster dinner for a casual lunch\nFuck a job application, we just print out the check\nPut a half a million dollar chain right round the neck" },
      { id: "b_dtp_11", type: "outro", label: "Outro", text: "Transaction confirmed\nFunds deposited\nTuneBloom Detroit Punch Master\nAnother hundred bands in the account\n(What? Huh? Out!)" }
    ]
  });

  registry.register({
    id: "dnb_liquid_roller",
    title: "Liquid Skyline",
    genre: "Drum and Bass",
    subgenre: "Liquid Drum & Bass / Atmospheric Jungle",
    bpm: 174,
    key: "F minor",
    mood: "Euphoric, driving, rolling, soulful, deep.",
    vocals: "Soulful female soprano with airy dynamic breath, high falsetto sustains, pitching vocal chops, subtle delay throws.",
    arrangement: "Deep warm 808 Reece sub-bass, fast rolling 174 BPM Amen-derived drum break, Rhodes jazz chord stabs, shimmering vocal pad.",
    blocks: [
      { id: "b_dnb_1", type: "intro", label: "Intro", text: "Rolling through the late night sky\nWatching every single shadow fly\n(Liquid motion...)\n(Take it higher...)\n(Yeah, yeah)" },
      { id: "b_dnb_2", type: "verse", label: "Verse 1", text: "City lights bleeding through the rainy glass\nWatching all the rapid transit shadows pass\nOne hundred seventy-four on the dashboard dial\nHaven't seen your face in a little while\nRolling bassline moving underneath my feet\nSynchronized perfectly to the breakbeat\nFloating on the current of the midnight sound\nLeaving all our worries on the solid ground\nFeel the sub-bass tearing through the open space\nFinding our salvation in this sacred place" },
      { id: "b_dnb_3", type: "build", label: "Build-Up 1", text: "Climbing through the frequency, higher and higher\nSetting every single dark cloud on fire\nThree, two, one, let the bassline roll!\n(Let it roll!)\n(Higher!)" },
      { id: "b_dnb_4", type: "drop", label: "Drop 1", text: "Rolling through the skyline!\n(Yeah! Feel the roll!)\n(Liquid motion in the soul!)\n(Take it higher!)\n(Yeah, yeah, yeah!)" },
      { id: "b_dnb_5", type: "verse", label: "Verse 2", text: "Lush chord progression walking up the scale\nOur connection is a ship that'll never fail\nEchoes in the headphones ringing crystal clear\nNothing in this universe that we can fear\nFast drums rolling like the ocean wave\nThis is the dynamic energy we crave\nGlide through the turn with your hand in mine\nCrossing every single boundary and line" },
      { id: "b_dnb_6", type: "build", label: "Build-Up 2", text: "Climbing through the frequency, higher and higher\nSetting every single dark cloud on fire\nThree, two, one, let the bassline roll!\n(Roll it out!)" },
      { id: "b_dnb_7", type: "drop", label: "Drop 2", text: "Rolling through the skyline!\n(Yeah! Feel the roll!)\n(Deep bass resonance!)\n(Take it higher!)\n(Let it roll!)" },
      { id: "b_dnb_8", type: "breakdown", label: "Breakdown", text: "When the drums cut out and the air is still\nFeel the space that our love can fill\nSuspended in the clouds at the break of dawn\nAll the pain from the past is gone\n(Floating in the atmosphere...)" },
      { id: "b_dnb_9", type: "solo", label: "Solo", text: "(Soar!)\n(Take it all the way!)\n(Yeah!)\n(Higher!)" },
      { id: "b_dnb_10", type: "drop", label: "Drop 3", text: "Rolling through the skyline!\n(Yeah! Maximum energy!)\n(Liquid roller in the night!)\n(Take it to the dawn!)\n(Yeah!)" },
      { id: "b_dnb_11", type: "outro", label: "Outro", text: "Liquid skyline...\nFading out on the break...\nTuneBloom Drum & Bass Master\n(Rolling... gone)" }
    ]
  });

  registry.register({
    id: "ukg_london_garage",
    title: "South London 2-Step",
    genre: "UK Garage",
    subgenre: "UK Garage / 2-Step Bassline",
    bpm: 134,
    key: "A minor",
    mood: "Bouncy, swaggering, infectious, late-night, slick.",
    vocals: "Slick British male sing-rap tenor, rapid conversational cadence, pitched female vocal sample chops, soulful call-and-response ad-libs.",
    arrangement: "Shuffle-quantized 2-step kick and rimshot groove, warped FM Donk bassline, warm Rhodes chords, vinyl crackle, tape delay sweeps.",
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
      { id: "b_ama_1", type: "intro", label: "Intro", text: "Yelele... Woza!\nTuneBloom Amapiano\nLet the log drum breathe, Jo'burg style\nSiyaphambili, halala, asambe!\n(Yelele mama, yelele baba)\n(Woza, woza, woza!)" },
      { id: "b_ama_2", type: "verse", label: "Verse 1", text: "Midnight cool air falling on the city\nDancing till the morning with my baby pretty\nDeep bass taking all the weight off the mind\nPrettiest groove that you ever could find\nMove to the left then you shift to the right\nLighting the fire in the middle of night\nEverybody know say the music is pure\nNatural medicine, ultimate cure\nFrom Soweto streets to the Sandton lights\nWe celebrate the rhythm of African nights\nDrink in the hand and the soul feeling free\nNothing in this world that I'd rather be" },
      { id: "b_ama_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Woza weekend, woza dance\nGive the heavy rhythm a chance\nFeel the sub hitting down in the chest\nSouth African sound is the absolute best\nShaker is moving and keeping the time\nHarmonies ringing so pure and sublime\n(Woza, woza, asambe sonke!)" },
      { id: "b_ama_4", type: "drop", label: "Drop 1", text: "Woza! Asambe!\n(Yelele mama, asambe!)\n(Woza, woza, woza!)\n(Halala, halala!)\n(Asambe sonke, siyaya!)\n(Woza! Asambe!)" },
      { id: "b_ama_5", type: "verse", label: "Verse 2", text: "Table filled with laughter, friends all around\nLost inside the beauty of the piano sound\nNo trouble, no drama, we keeping it clean\nSmoothest vibration the world's ever seen\nTake a little sip, let the melody glide\nNothing to hold back, nowhere to hide\nLog drum rolling with intricate rolls\nHealing the spirit and freeing our souls\nJoy in our eyes as the morning comes near\nLifting away every burden and fear\nDance with me now till the sun starts to rise\nPure golden light in the African skies" },
      { id: "b_ama_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Woza weekend, woza dance\nGive the heavy rhythm a chance\nFeel the sub hitting down in the chest\nSouth African sound is the absolute best\nShaker is moving and keeping the time\nHarmonies ringing so pure and sublime\n(Halala! Siyaya!)" },
      { id: "b_ama_7", type: "drop", label: "Drop 2", text: "Woza! Halala!\n(Halala, halala, asambe!)\n(Hey! Hey! Hey!)\n(Yelele mama, siyaphambili!)\n(Woza, woza, Jo'burg heat!)\n(Asambe sonke!)" },
      { id: "b_ama_8", type: "breakdown", label: "Breakdown", text: "When the night is deep and still\nFeel the space that spirit fill\nMusic is life, music is peace\nLet the good vibration never cease\nHold hands together and look at the sky\nWatching the constellations rolling on by\n(Peace in our hearts, love in the sound)" },
      { id: "b_ama_9", type: "solo", label: "Solo", text: "(Yelele...)\n(Woza mama!)\n(Halala, halala!)\n(Asambe!)" },
      { id: "b_ama_10", type: "drop", label: "Drop 3", text: "Asambe sonke!\n(Woza! Asambe!)\n(Yelele mama, halala!)\n(Jo'burg vibration!)\n(Woza! Halala!)" },
      { id: "b_ama_11", type: "outro", label: "Outro", text: "Yelele... Johannesburg\nTuneBloom Master\nSiyabonga kakhulu\nPeace and love\n(Halala... asambe)" }
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
      { id: "b_jcb_1", type: "intro", label: "Intro", text: "Jersey! TuneBloom in the mix!\nPut your hands up, let's get it!\nRock your hips, rock your hips!\nNewark to Philly, you know what time it is!\n(Go! Go! Go! Let's go!)" },
      { id: "b_jcb_2", type: "verse", label: "Verse 1", text: "Step in the circle, show 'em what you got\nTaking the rhythm and making it hot\nLeft foot, right foot, hit the floor\nEverybody screaming and asking for more\nBassline bumping right in the chest\nJersey club bounce is the absolute best\nFast tempo moving, never gon' stall\nTaking the party and rocking the hall\nGot the whole club jumping on beat\nFeel that sub-bass under your feet\nHands to the ceiling, let your body shake\nBest vibration that we ever could make" },
      { id: "b_jcb_3", type: "build", label: "Build-Up 1", text: "Work it, work it, let it go!\nThree, two, one, hit the floor!\n(Work it! Work it! Faster!)\n(Three! Two! One! Let's go!)" },
      { id: "b_jcb_4", type: "drop", label: "Drop 1", text: "Rock that body! Shake that ass!\nPut the whole party right on blast!\n(Work! Work! Rock that body!)\n(Shake that ass! Go! Go!)\n(Hit the floor! Let's get it!)\n(Jersey bounce!)" },
      { id: "b_jcb_5", type: "verse", label: "Verse 2", text: "Sweat on the forehead, energy peaked\nGiving them everything they came to seek\nDJ spinning the hottest release\nMaking the excitement never decrease\nTurn up the monitors, let it all bang\nRep for the city and rep for the gang\nHands to the ceiling, feet off the ground\nNobody messing with Jersey sound\nDouble time kick drum rattling the space\nLighting up a smile on everybody's face" },
      { id: "b_jcb_6", type: "build", label: "Build-Up 2", text: "Work it, work it, let it go!\nThree, two, one, hit the floor!\n(Work it! Work it! Turn it up!)\n(Three! Two! One! Let's go!)" },
      { id: "b_jcb_7", type: "drop", label: "Drop 2", text: "Break it down! Let's go!\n(Rock! Rock! Hit the floor!)\n(Rock your hips! Shake that ass!)\n(Put the whole room on blast!)\n(Go! Go! Go! Go!)" },
      { id: "b_jcb_8", type: "breakdown", label: "Breakdown", text: "Jersey vibe in the atmosphere\nMaking it crystal clean and clear\nWhen the kick drum hits the floor\nYou already know what we came here for\nTake a quick breath, get ready to roll\nJersey club rhythm taking control" },
      { id: "b_jcb_9", type: "build", label: "Build-Up 3", text: "All my people make some noise!\nTurn up the power for the girls and boys!\nThree... two... one... let's go!" },
      { id: "b_jcb_10", type: "drop", label: "Drop 3", text: "Rock your hips! Shake that ass!\nJersey Master in the class!\n(Work it! Let's go! Rock it out!)\n(Maximum bounce!)\n(Go! Go! Go! Go!)" },
      { id: "b_jcb_11", type: "outro", label: "Outro", text: "Yeah! TuneBloom Jersey Club Master\nDrop that beat to a dead stop\nNewark stand up\nDrop\n(Work!)" }
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
      { id: "b_syn_1", type: "intro", label: "Intro", text: "Grid status: Overclocked\nIgnition sequence engaged\nFull voltage across all circuits\n(Engage! Overdrive!)" },
      { id: "b_syn_2", type: "verse", label: "Verse 1", text: "Chromium skyline bleeding in the rain\nZero-latency adrenaline through every vein\nSpeedometer redlining past the perimeter line\nRunning through the shadows at the edge of time\nSynthetic reflections in the wet asphalt\nSystem overload, this is nobody's fault\nChasing the ghost through the fiber-optic grid\nUnlocking the secrets that the mainframe hid\nTurbines screaming at maximum thrust\nLeaving the wreckage and turning to dust" },
      { id: "b_syn_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Sensors ignite, engines awake\nToo much momentum for the system to break\nTarget acquired, locking the sight\nWe burn across the cybernetic night\nVoltage climbing past the critical peak\nFinding the power that we came here to seek\n(Overdrive!)" },
      { id: "b_syn_4", type: "chorus", label: "Chorus 1", text: "Push it into neon overdrive\nOnly the electric are gonna survive\nShatter the barrier, tear up the street\nLocked to the pulse of the digital beat\nFaster than light through the chrome corridor\nLeaving the past on the burning floor\n(Yeah! Neon overdrive!)" },
      { id: "b_syn_5", type: "verse", label: "Verse 2", text: "Signal reflections in the visor glow\nHigh-voltage rhythm moving down below\nNo looking back when the sirens rise\nChasing the horizon under synthetic skies\nLaser beams cutting through the heavy mist\nNames written down on the target list\nDigital pulse in the palm of my hand\nRuling the core of this silicon land" },
      { id: "b_syn_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Sensors ignite, engines awake\nToo much momentum for the system to break\nTarget acquired, locking the sight\nWe burn across the cybernetic night\nVoltage climbing past the critical peak\nFinding the power that we came here to seek" },
      { id: "b_syn_7", type: "chorus", label: "Chorus 2", text: "Push it into neon overdrive\nOnly the electric are gonna survive\nShatter the barrier, tear up the street\nLocked to the pulse of the digital beat" },
      { id: "b_syn_8", type: "bridge", label: "Bridge", text: "Overload the circuit, let the voltage peak\nFinding the transcendence that we came to seek\nFrequency rising, tearing through the noise\nListen to the thunder of the engine voice\nNo speed limit in the matrix core\nShatter the ceiling, break down the door\n(Redline!)" },
      { id: "b_syn_9", type: "solo", label: "Solo", text: "(Overdrive!)\n(Redline!)\n(Hold on!)\n(Speed!)" },
      { id: "b_syn_10", type: "chorus", label: "Chorus 3", text: "Push it into neon overdrive\nOnly the electric are gonna survive\nShatter the barrier, tear up the street\nLocked to the pulse of the digital beat\nFaster than light through the chrome corridor\nLeaving the past on the burning floor" },
      { id: "b_syn_11", type: "outro", label: "Outro", text: "System cooling down...\nDecelerating from orbit...\nPulse... fading... static\nMission complete\n(Power down)" }
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
      { id: "b_neo_1", type: "intro", label: "Intro", text: "Mmm-mmm, yeah\nRight where we need to be\nTake a deep breath, let the world slow down\n(Right here with you)\n(Mmm...)" },
      { id: "b_neo_2", type: "verse", label: "Verse 1", text: "Sunlight spilling on the hardwood floor\nCoffee steaming by the open door\nTime moves slower when you're in the room\nEvery little silence begins to bloom\nRecord spinning on the vintage deck\nGentle morning kiss upon my neck\nNo hurry for the hours to unfold\nWatching how the morning turns to gold\nYour fingers tracing lines across my palm\nSurrounded by this sweet and steady calm" },
      { id: "b_neo_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "No rush against the ticking hand\nDrifting like golden desert sand\nYou smile and tilt your head away\nNothing else matters in the day\nHarmonies breathing through the air\nWithout a single worry or a care\n(Yeah, no worries at all)" },
      { id: "b_neo_4", type: "chorus", label: "Chorus 1", text: "Caught in the golden hour light\nEverything feels easy and right\nLet the world keep rushing on by\nWe've got the sun and the morning sky\nWrapped inside this gentle melodic stream\nLiving inside a waking dream\n(Mmm, golden hour light)\n(Right here with you)" },
      { id: "b_neo_5", type: "verse", label: "Verse 2", text: "Unfinished melodies written on a page\nStepping off the rush of the modern stage\nJust your fingers tapping out a simple chord\nRichest peace that we could afford\nHumming sweet counterpoint along with me\nPure natural acoustic harmony\nOutside the traffic crawls along the street\nInside we're floating to our own heart beat" },
      { id: "b_neo_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "No rush against the ticking hand\nDrifting like golden desert sand\nYou smile and tilt your head away\nNothing else matters in the day\nHarmonies breathing through the air\nWithout a single worry or a care" },
      { id: "b_neo_7", type: "chorus", label: "Chorus 2", text: "Caught in the golden hour light\nEverything feels easy and right\nLet the world keep rushing on by\nWe've got the sun and the morning sky" },
      { id: "b_neo_8", type: "bridge", label: "Bridge", text: "No hurry, no race to win\nJust breathing the morning in\nHarmonies settling in the air\nWithout a single heavy care\nLet the sweet melody carry us away\nTo the promise of a brand new day\n(Stay right here)" },
      { id: "b_neo_9", type: "solo", label: "Solo", text: "(Mmm... yeah)\n(Golden hour sweetness)\n(Breathe in)\n(Pure love)" },
      { id: "b_neo_10", type: "chorus", label: "Chorus 3", text: "Caught in the golden hour light\nEverything feels easy and right\nLet the world keep rushing on by\nWe've got the sun and the morning sky\nWrapped inside this gentle melodic stream\nLiving inside a waking dream" },
      { id: "b_neo_11", type: "outro", label: "Outro", text: "Stay right here...\nGolden hour...\nJust you and me\n(Mmm... yeah)\n(Fade slow)" }
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
      { id: "b_pop_1", type: "intro", label: "Intro", text: "(Drifting out on the open tide...)\n(Far away from where we started...)\n(Shimmering waves in the afternoon light...)\n(Yeah...)" },
      { id: "b_pop_2", type: "verse", label: "Verse 1", text: "Salt air drifting through the open car\nWondering if we traveled far\nWater gleaming in the afternoon haze\nLost in the rhythm of the summer days\nHighway ribbon winding down the coast\nThinking of the things that we loved the most\nSea spray misting on the windshield glass\nWatching every single shadow pass\nFender reverb ringing in our ears\nWashing away all of our old fears" },
      { id: "b_pop_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Past the dunes where the grasses sway\nWatching the daylight slip away\nColors bleeding into the tide\nWith the whole wide world on our side\nFeel the current pulling us along\nSinging our forgotten coastal song\n(Out to sea...)" },
      { id: "b_pop_4", type: "chorus", label: "Chorus 1", text: "Wash away into the coastal tide\nNowhere left we need to hide\nFloating on the current out to sea\nJust you and the open horizon with me\nShimmering light on the ocean floor\nNever going back to the crowded shore\n(Drifting... floating...)" },
      { id: "b_pop_5", type: "verse", label: "Verse 2", text: "Footprints washed from the shoreline track\nNo clear reason for looking back\nSun sinking low into shades of rose\nWhere the cool evening current flows\nSeagulls crying in the purple sky\nWatching all the clouds go rolling by\nYour hand resting warm inside of mine\nFrozen in this perfect space and time" },
      { id: "b_pop_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Past the dunes where the grasses sway\nWatching the daylight slip away\nColors bleeding into the tide\nWith the whole wide world on our side\nFeel the current pulling us along\nSinging our forgotten coastal song" },
      { id: "b_pop_7", type: "chorus", label: "Chorus 2", text: "Wash away into the coastal tide\nNowhere left we need to hide\nFloating on the current out to sea\nJust you and the open horizon with me" },
      { id: "b_pop_8", type: "bridge", label: "Bridge", text: "Let the waves crash high above\nEverything we were dreaming of\nCatch the swell before it breaks\nFor all our memories' sakes\nInto the mist where the stars awake\nFor every single promise that we make\n(Into the blue...)" },
      { id: "b_pop_9", type: "solo", label: "Solo", text: "(Ooh...)\n(Lost in the mist...)\n(Floating...)\n(Floating away...)" },
      { id: "b_pop_10", type: "chorus", label: "Chorus 3", text: "Wash away into the coastal tide\nNowhere left we need to hide\nFloating on the current out to sea\nJust you and the open horizon with me\nShimmering light on the ocean floor\nNever going back to the crowded shore" },
      { id: "b_pop_11", type: "outro", label: "Outro", text: "Out to sea...\nJust you and me...\nWaves receding in the dusk...\n(Fade into the mist...)\n(Forever...)" }
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
      { id: "b_hip_1", type: "intro", label: "Intro", text: "Check the levels on the tape deck\nOne, two... yeah\nDropping the needle on ninety-two\nFrom Queensbridge to Brooklyn, real boom bap\n(Listen close, yeah)\n(Drop the break!)" },
      { id: "b_hip_2", type: "verse", label: "Verse 1", text: "Sifting through the crates in the basement store\nFinding rare gems on the dusty floor\nTwelve-bit textures hitting hard on the one\nMaking classic rhythm till the rising sun\nPen on the notebook, capturing the rhyme\nEvery single syllable is locked in time\nMPC pads and the vinyl crackle\nOvercoming every industry obstacle\nRaw hip-hop straight out the sewer grate\nServing pure knowledge on a dinner plate\nKick drum thumping in your chest real heavy\nRhymes razor sharp and we keeping 'em steady" },
      { id: "b_hip_3", type: "hook", label: "Hook 1", text: "Keep the rhythm raw, never compromise\nRocking on the beat right before your eyes\nCrate diggers anthem from the underground\nPure authentic feeling in the master sound\n(Check it out! Yeah!)\n(True school hip-hop!)" },
      { id: "b_hip_4", type: "verse", label: "Verse 2", text: "Analog warmth through the vacuum tube\nCutting straight through the surrounding cube\nHeavy bass foundation rattling the trunk\nNothing artificial, just the real raw funk\nKick-snare cadence walking down the block\nSynchronized perfectly to turn the clock\nGraffiti on the train car running down the line\nEvery single bar is a timeless design\nSP-1200 chopping up the horn\nThis is where the golden era sound was born" },
      { id: "b_hip_5", type: "breakdown", label: "Breakdown", text: "Let the groove breathe for a minute\nReal audio craftsmanship with soul inside it\nFilter down the bass, let the needle pop\nTrue hip-hop culture that will never stop\n(Yeah, real hip hop)" },
      { id: "b_hip_6", type: "hook", label: "Hook 2", text: "Keep the rhythm raw, never compromise\nRocking on the beat right before your eyes\nCrate diggers anthem from the underground\nPure authentic feeling in the master sound" },
      { id: "b_hip_7", type: "verse", label: "Verse 3", text: "Mastering the craft till the break of day\nStacking up the reels in a clean display\nTimeless frequency living in the groove\nGive the people something that can make them move\nNo autotune gimmick, just raw lyricism\nBreaking through the fake with a sonic prism\nNew York state of mind on the master tape\nReal sound artistry taking new shape" },
      { id: "b_hip_8", type: "bridge", label: "Bridge", text: "From the SP pads to the master reel\nYou can never duplicate the way we feel\nHarmonic overtones ringing in the room\nEngineered precision in the sonic bloom\n(Pure craftsmanship!)" },
      { id: "b_hip_9", type: "solo", label: "Solo", text: "(Scratch that!)\n(Cut it up, yeah!)\n(Drop the needle!)\n(One, two, on the one!)" },
      { id: "b_hip_10", type: "hook", label: "Hook 3", text: "Keep the rhythm raw, never compromise\nRocking on the beat right before your eyes\nCrate diggers anthem from the underground\nPure authentic feeling in the master sound" },
      { id: "b_hip_11", type: "outro", label: "Outro", text: "Fading out on the groove\nClassic master tape finish\nTuneBloom East Coast Master\nPeace out to all the real diggers\n(Peace)" }
    ]
  });

  registry.register({
    id: "poppunk_all_my_fault",
    title: "All My Fault",
    genre: "Pop Punk",
    subgenre: "Modern Pop-Punk / Emo Trap Revival",
    bpm: 160,
    key: "E major",
    mood: "Aggressive, angsty, high-energy, infectious, cathartic.",
    vocals: "Gritty, soaring male pop-punk tenor with chest belting, layered double-tracked chorus, shouted background gang vocals.",
    arrangement: "Driven overdriven Marshall guitar power chords, fast driving 160 BPM skate-punk drum kit, melodic bassline, subtle 808 sub drops.",
    blocks: [
      { id: "b_ppk_1", type: "intro", label: "Intro", text: "Yeah! One, two, three, four!\n(Go!)\n(Here we go again!)" },
      { id: "b_ppk_2", type: "verse", label: "Verse 1", text: "Woke up at noon with my clothes on the floor\nHeadache screaming, heading straight for the door\nLeft my keys and my phone in your car\nGuess we took that argument way too far\nStaring at the ceiling while the room starts to spin\nWondering how the hell I let you under my skin\nEvery little promise that we threw in the trash\nWatching every single bridge we built turn to ash\nSkate down the avenue to clear out my head\nRemembering every bitter word that you said" },
      { id: "b_ppk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Tired of the drama, tired of the blame\nBoth of us addicted to this stupid ass game\nTurn the amp up to ten, let it blast through the wall\nGetting ready for the catastrophic downfall!\n(Yeah! Downfall!)" },
      { id: "b_ppk_4", type: "chorus", label: "Chorus 1", text: "Say it's all my fault, yeah I know that it's true!\nI'm so sick and tired of screaming at you!\nPack up all my shit and throw it out in the street!\nWatch me land right back on my own two feet!\nNever coming back, you can cross out my name!\nI'm done being a pawn in your toxic ass game!\n(All my fault!)\n(Go!)" },
      { id: "b_ppk_5", type: "verse", label: "Verse 2", text: "Saw your best friend, told her tell you goodbye\nI don't have a single tear that's left here to cry\nPlaying fast chords in the garage with the boys\nMaking up for every second lost in the noise\nRipped up jeans and my old pair of Vans\nDoing whatever the fuck that I can\nNo more curfew and no more control\nTaking back the dignity and heart of my soul" },
      { id: "b_ppk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Tired of the drama, tired of the blame\nBoth of us addicted to this stupid ass game\nTurn the amp up to ten, let it blast through the wall\nGetting ready for the catastrophic downfall!" },
      { id: "b_ppk_7", type: "chorus", label: "Chorus 2", text: "Say it's all my fault, yeah I know that it's true!\nI'm so sick and tired of screaming at you!\nPack up all my shit and throw it out in the street!\nWatch me land right back on my own two feet!\nNever coming back, you can cross out my name!\nI'm done being a pawn in your toxic ass game!" },
      { id: "b_ppk_8", type: "bridge", label: "Bridge", text: "Remember the night that we sat on your roof?\nWe were looking for love, but we needed the proof\nNow the memory is burning away in the dark\nAll it took was a single and dangerous spark\n(Burn it down!)\n(Go!)" },
      { id: "b_ppk_9", type: "solo", label: "Solo", text: "(Yeah!)\n(Rip that guitar!)\n(One more time!)\n(Go! Go! Go!)" },
      { id: "b_ppk_10", type: "chorus", label: "Chorus 3", text: "Say it's all my fault, yeah I know that it's true!\nI'm so sick and tired of screaming at you!\nPack up all my shit and throw it out in the street!\nWatch me land right back on my own two feet!\nNever coming back, you can cross out my name!\nI'm done being a pawn in your toxic ass game!" },
      { id: "b_ppk_11", type: "outro", label: "Outro", text: "Yeah, it's all my fault\nAnd I don't give a fuck\nTuneBloom Pop Punk Master\n(Done!)" }
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
      { id: "b_cnt_1", type: "intro", label: "Intro", text: "Yeah, rolling down County Line\nJust like old times\nWindows down, tank full of gas\n(Let's ride, buddy)\n(Yeah)" },
      { id: "b_cnt_2", type: "verse", label: "Verse 1", text: "Old pine trees leaning by the gravel road\nCarrying sixty miles worth of heavy load\nGot the windows down catching that summer rain\nWashing all the rust off this two-lane lane\nBoot heels worn from the honest grind\nLeaving every troubled thought way behind\nDaddy's old toolbox sitting in the back\nKeeping this rusty Chevy right on track\nSmell of sweet hay burning in the field\nKnowing that the simple things are real" },
      { id: "b_cnt_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Sun sinking down past the harvest grain\nNothing quite cures like an open plain\nTurn the dial up till the speakers roar\nTo the songs that we've been waiting for\nGot the cool breeze blowing through the truck\nThanking the Lord for a little bit of luck\n(Yeah, good luck)" },
      { id: "b_cnt_4", type: "chorus", label: "Chorus 1", text: "Running on dust, diesel, and prayers tonight\nChasing the red glow of the taillight\nNothing in this world can slow me down\nThirty miles past the edge of town\nGot a full tank and a clear blue sky\nWatching all the hard miles roll on by\n(Just rolling on home)\n(Dust and diesel)" },
      { id: "b_cnt_5", type: "verse", label: "Verse 2", text: "Silver moonlight shining on the tractor line\nNeighbor's porch light burning like a friendly sign\nWorking with your hands gives you peace of mind\nBest kind of freedom you can ever find\nHard-earned dollar and a faithful heart\nKnowing right where the real things start\nCold sweet tea in a mason jar\nStaring up at every single southern star" },
      { id: "b_cnt_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Sun sinking down past the harvest grain\nNothing quite cures like an open plain\nTurn the dial up till the speakers roar\nTo the songs that we've been waiting for\nGot the cool breeze blowing through the truck\nThanking the Lord for a little bit of luck" },
      { id: "b_cnt_7", type: "chorus", label: "Chorus 2", text: "Running on dust, diesel, and prayers tonight\nChasing the red glow of the taillight\nNothing in this world can slow me down\nThirty miles past the edge of town\nGot a full tank and a clear blue sky\nWatching all the hard miles roll on by" },
      { id: "b_cnt_8", type: "bridge", label: "Bridge", text: "There's a comfort in the rhythm of the highway line\nKnowing that the future's gonna turn out fine\nKeep your eyes on the horizon ahead\nRemembering every word that mama said\nHonest living and a steady hand\nRooted deep inside this open land\n(Roots run deep)" },
      { id: "b_cnt_9", type: "solo", label: "Solo", text: "(Pick it clean!)\n(Yeah!)\n(Southern soul!)\n(Roll on!)" },
      { id: "b_cnt_10", type: "chorus", label: "Chorus 3", text: "Running on dust, diesel, and prayers tonight\nChasing the red glow of the taillight\nNothing in this world can slow me down\nThirty miles past the edge of town\nGot a full tank and a clear blue sky\nWatching all the hard miles roll on by" },
      { id: "b_cnt_11", type: "outro", label: "Outro", text: "Just rolling on home...\nDust and diesel\nCricket songs in the evening breeze\nTuneBloom Country Master\n(All the way home)" }
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
      { id: "b_lat_1", type: "intro", label: "Intro", text: "Dímelo... TuneBloom\nLa noche está llamando\nBailando suave, tú y yo\nSiente el bajo retumbar en el pecho\n(Fuego!)\n(Dale, no pares)" },
      { id: "b_lat_2", type: "verse", label: "Verse 1", text: "Luces bajas en la ciudad\nTu mirada dice la verdad\nTe acercas lento sin preguntar\nEl ritmo empieza a acelerar\nMoviéndote con esa elegancia\nEliminando toda la distancia\nPerfume caro flotando en el aire\nEsta noche no hay quien nos pare\nTu cintura tiene ese poder\nQue me hace todo enloquecer" },
      { id: "b_lat_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "La música sube y no podemos parar\nEl bajo retumba hasta hacernos vibrar\nBailando pegados bajo el resplandor\nSintiendo en el pecho este gran calor\nNo hay marcha atrás cuando empieza a sonar\nEste dembow que te va a conquistar\n(Fuego!)" },
      { id: "b_lat_4", type: "chorus", label: "Chorus 1", text: "Hay fuego en la noche, déjate llevar\nNadie como tú me puede controlar\nCon ese movimiento me vas a matar\nHasta que la luna se vaya a ocultar\n(Fuego, fuego... bien pegao)\n(Bailando suave hasta el amanecer)\n(Dale mami, no te quites)" },
      { id: "b_lat_5", type: "verse", label: "Verse 2", text: "Whiskey en la mesa, humo en el salón\nSincronizados en la misma emoción\nTu cuerpo sabe cómo navegar\nCada compás me vuelve a atrapar\nNo hay prisa cuando se siente así\nTodo lo que quiero lo encuentro en ti\nManos en la cintura, ritmo sensual\nUna conexión que no tiene igual" },
      { id: "b_lat_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "La música sube y no podemos parar\nEl bajo retumba hasta hacernos vibrar\nBailando pegados bajo el resplandor\nSintiendo en el pecho este gran calor\nNo hay marcha atrás cuando empieza a sonar\nEste dembow que te va a conquistar" },
      { id: "b_lat_7", type: "chorus", label: "Chorus 2", text: "Hay fuego en la noche, déjate llevar\nNadie como tú me puede controlar\nCon ese movimiento me vas a matar\nHasta que la luna se vaya a ocultar" },
      { id: "b_lat_8", type: "bridge", label: "Bridge", text: "Suavemente al oído susúrrame\nQue esta noche nunca se termine\nElevando el tempo sin condición\nSomos la chispa de la creación\nBajo las estrellas bailando los dos\nSin despedidas, sin ningún adiós\n(Dale suave)" },
      { id: "b_lat_9", type: "solo", label: "Solo", text: "(Dale!)\n(Fuego en la noche!)\n(Siente el calor!)\n(Pegadito, mami!)" },
      { id: "b_lat_10", type: "chorus", label: "Chorus 3", text: "Hay fuego en la noche, déjate llevar\nNadie como tú me puede controlar\nCon ese movimiento me vas a matar\nHasta que la luna se vaya a ocultar\n(Fuego en la noche... tú y yo)\n(Hasta que salga el sol)" },
      { id: "b_lat_11", type: "outro", label: "Outro", text: "Así mismito...\nHasta que salga el sol\nTuneBloom Master Latino\nFuego" }
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
      { id: "b_hou_1", type: "intro", label: "Intro", text: "(Echoes in the dark...)\n(Feel the frequency rising...)\n(Floating through celestial space...)\n(Universal harmony awakens...)\n(Let it build...)" },
      { id: "b_hou_2", type: "verse", label: "Verse 1", text: "Drifting through the endless blue\nEvery shadow turning into light with you\nBoundless ocean beneath the sky\nWatching ancient constellations passing by\nSonic waves upon the shore of time\nPure harmonic resonance sublime\nWeightless energy inside the chest\nPutting all our mortal thoughts to rest\nInfinite horizons shining clear\nBanishing the memory of fear" },
      { id: "b_hou_3", type: "build", label: "Build-Up 1", text: "Frequency climbing higher and higher\nIgniting the universal fire\nFeel the pressure start to rise\nOpen up your eyes!\nRising up into the blinding light\nWe transcend the borders of the night!\n(Three, two, one, ascend!)" },
      { id: "b_hou_4", type: "drop", label: "Drop 1", text: "(Let it rise!)\n(Higher, higher!)\n(Echoes of Elysium!)\n(Pure progressive power!)\n(Ascend!)" },
      { id: "b_hou_5", type: "verse", label: "Verse 2", text: "Weightless in the sonic stream\nLiving inside a lucid waking dream\nHarmonic overtones fill the room\nEvery single frequency begins to bloom\nElectric pulses beating through the soul\nTaking back harmonious control\nWalking through the gates of pure design\nWhere the human and the star align" },
      { id: "b_hou_6", type: "build", label: "Build-Up 2", text: "Frequency climbing higher and higher\nIgniting the universal fire\nRelease the tension, break the wall\nAnswer to the call!\nRising up into the blinding light\nWe transcend the borders of the night!" },
      { id: "b_hou_7", type: "drop", label: "Drop 2", text: "(Break the wall!)\n(Elysium!)\n(Harmonic explosion!)\n(Feel the frequency!)\n(Ascend!)" },
      { id: "b_hou_8", type: "breakdown", label: "Breakdown", text: "When the world is quiet and still\nWe find the space that love can fill\nSuspended in the atmosphere\nWhere everything is crystal clear\n(Quiet and still... floating...)" },
      { id: "b_hou_9", type: "build", label: "Build-Up 3", text: "Three... two... one... let it soar!\nShatter the ceiling forevermore!\n(Ascend to the stars!)" },
      { id: "b_hou_10", type: "drop", label: "Drop 3", text: "(Soar!)\n(Echoes of Elysium!)\n(Full energy release!)\n(Infinite light!)" },
      { id: "b_hou_11", type: "outro", label: "Outro", text: "Echoes drifting out...\nInto the eternal light...\nTuneBloom Progressive Master\nFade away into the stars" }
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
      { id: "b_fnk_1", type: "intro", label: "Intro", text: "Get down!\nYeah, bring it on in\nTuneBloom funk in the pocket\nHorns blowing, slap bass popping\n(Let's groove! Ow!)" },
      { id: "b_fnk_2", type: "verse", label: "Verse 1", text: "Spotted shoes on the parquet floor\nCan't keep your feet from heading for the door\nBassline popping right into your soul\nTaking full momentum and complete control\nGot that rhythm locked into the groove\nGiving everybody something to prove\nGlitter ball spinning up on high\nLighting up the disco in the sky\nStratocaster scratching on the two and four\nMaking every single body beg for more" },
      { id: "b_fnk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Hands in the air, feeling the beat\nTurning up the power on the city street\nHorn section blowing till the roof comes down\nBest vibrations in the entire town!\nShake off the heavy and let it all drop\nThis funky train is never gonna stop!\n(Hit me!)" },
      { id: "b_fnk_4", type: "chorus", label: "Chorus 1", text: "Ride on the starlight groove tonight!\nEverything's shining underneath the light!\nShake off the heavy and let it unwind\nLeave all the ordinary far behind!\n(Yeah! Starlight groove!)\n(Get on up! Ow!)" },
      { id: "b_fnk_5", type: "verse", label: "Verse 2", text: "Stratocaster scratching out the tempo clean\nFunkier than anything you've ever seen\nSyncopated magic on the two and four\nMaking every dancer come back for more\nGot no worries, got no blues\nJust dynamic rhythm you can never lose\nElectric piano chords walking on up\nPouring sweet funk right into your cup" },
      { id: "b_fnk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Hands in the air, feeling the beat\nTurning up the power on the city street\nHorn section blowing till the roof comes down\nBest vibrations in the entire town!" },
      { id: "b_fnk_7", type: "chorus", label: "Chorus 2", text: "Ride on the starlight groove tonight!\nEverything's shining underneath the light!\nShake off the heavy and let it unwind\nLeave all the ordinary far behind!" },
      { id: "b_fnk_8", type: "bridge", label: "Bridge", text: "Break it down to the bass and drum!\nWatch where the heavy groove is coming from!\nSlap that bass, make the speaker pop\nWe take the party right over the top\n(Hit me! Funky!)" },
      { id: "b_fnk_9", type: "solo", label: "Solo", text: "(Blow that horn!)\n(Yeah! Take it home!)\n(Slap that bass!)\n(Ow! Get funky!)" },
      { id: "b_fnk_10", type: "chorus", label: "Chorus 3", text: "Ride on the starlight groove tonight!\nEverything's shining underneath the light!\nShake off the heavy and let it unwind\nLeave all the ordinary far behind!\n(One more time, groove it out!)\n(Starlight!)" },
      { id: "b_fnk_11", type: "outro", label: "Outro", text: "Keep it funky... just like that!\nHit me on the one!\nTuneBloom Nu-Disco Master\n(Ow!)" }
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
      { id: "b_rck_1", type: "intro", label: "Intro", text: "Yeah...\nTurn the amps up all the way\nFeedback humming in the dark\n(Here it comes)" },
      { id: "b_rck_2", type: "verse", label: "Verse 1", text: "Cracked ceiling staring down at me\nTrapped inside this quiet frequency\nCounting seconds till the engine turns\nWatching how the slow ignition burns\nWords written down on a crumpled sheet\nEchoing across the empty street\nRust on the iron gate outside my door\nI don't wanna play these silent games no more\nTurn up the distortion on the pedal board\nTaking everything that we can afford" },
      { id: "b_rck_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Turn up the feedback, let it scream\nNothing is ever quite what it seems\nTension stretching till the wire snaps\nFalling right into the open traps\nBreak through the wall with a heavy sound\nShatter the quiet to the ground!\n(Yeah!)" },
      { id: "b_rck_4", type: "chorus", label: "Chorus 1", text: "Caught in the static and the rust!\nWatching our promises turn to dust!\nScream at the wall till the shadows break\nFor all the chances we didn't take!\nRising above where the wreckage lies\nUnder the grey and stormy skies!\n(Static and rust!)" },
      { id: "b_rck_5", type: "verse", label: "Verse 2", text: "Old photographs on the painted wall\nWaiting for the heavy rain to fall\nScars on the knuckle from the fight we chose\nKnowing how the bitter story goes\nNo more apologies, no more delay\nTime to wash the compromise away\nFuzz bass tearing through the studio room\nUnleashing pure cathodic bloom" },
      { id: "b_rck_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Turn up the feedback, let it scream\nNothing is ever quite what it seems\nTension stretching till the wire snaps\nFalling right into the open traps\nBreak through the wall with a heavy sound\nShatter the quiet to the ground!" },
      { id: "b_rck_7", type: "chorus", label: "Chorus 2", text: "Caught in the static and the rust!\nWatching our promises turn to dust!\nScream at the wall till the shadows break\nFor all the chances we didn't take!" },
      { id: "b_rck_8", type: "bridge", label: "Bridge", text: "Strip it down to the raw bone frame\nNobody else left that we can blame\nIgnite the fuel and let it go\nDown in the fire down below\nReclaim the spark from the dying ash\nWatch the whole illusion crash\n(Let it burn!)" },
      { id: "b_rck_9", type: "solo", label: "Solo", text: "(Let it burn!)\n(Guitars screaming through the stack!)\n(Yeah! Rip it up!)\n(Feedback explosion!)" },
      { id: "b_rck_10", type: "chorus", label: "Chorus 3", text: "Caught in the static and the rust!\nWatching our promises turn to dust!\nScream at the wall till the shadows break\nFor all the chances we didn't take!\nRising above where the wreckage lies\nUnder the grey and stormy skies!" },
      { id: "b_rck_11", type: "outro", label: "Outro", text: "Static and rust...\nNothing left...\nOnly the pure truth remains\nTuneBloom Grunge Master\nDust\n(Ring out)" }
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
      { id: "b_orc_1", type: "intro", label: "Intro", text: "Aeterna lux...\nSurge ad astra, veritas in armis\n(Surge ad astra)\n(Gloria in excelsis)\n(Ascendit...)" },
      { id: "b_orc_2", type: "verse", label: "Verse 1", text: "Across the mountain ridge the storm unfolds\nA legacy of iron, blood, and gold\nThrough freezing winds the ancient banner flies\nUnder the gaze of dark immortal skies\nHold the perimeter, protect the flame\nHonor the glory of the fallen name\nSymphonic thunder echoing through the night\nGuiding our warriors into the holy light\nUnbroken line of heroes taking stand\nDefending this celestial native land" },
      { id: "b_orc_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "Aeterna lux, veritas in armis\nSurge ad astra, victoria nos vocat\nWings of iron soaring through the tempest deep\nA sacred vigil that we swear to keep\n(Gloria! Victoria!)" },
      { id: "b_orc_4", type: "chorus", label: "Chorus 1", text: "Rise from the ashes of the battleground!\nWhere destiny and courage can be found!\nWith wings of iron we ascend the crest\nPutting our mortal fear to rest!\nAeterna gloria, triumphus animi\nWe conquer through the sacred symphony!\n(Valkyrie ascending!)" },
      { id: "b_orc_5", type: "verse", label: "Verse 2", text: "The thunder echoes through the frozen canyon deep\nA sacred vigil that we swear to keep\nNo sword shall falter in the decisive hour\nWe stand as guardians of transcendent power\nThrough every trial we shall remain\nUnbroken by the tempest and the pain\nChoirs of angels singing through the gale\nOur holy conviction never shall fail" },
      { id: "b_orc_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "Aeterna lux, veritas in armis\nSurge ad astra, victoria nos vocat\nWings of iron soaring through the tempest deep\nA sacred vigil that we swear to keep" },
      { id: "b_orc_7", type: "chorus", label: "Chorus 2", text: "Rise from the ashes of the battleground!\nWhere destiny and courage can be found!\nWith wings of iron we ascend the crest\nPutting our mortal fear to rest!" },
      { id: "b_orc_8", type: "breakdown", label: "Breakdown", text: "In silentio noctis\nGloria in excelsis deo\nSanctus, sanctus, requiem aeternam\nLight descending on the brave\n(Aeterna...)" },
      { id: "b_orc_9", type: "solo", label: "Solo", text: "(Victoria!)\n(Aeterna lux!)\n(Surge ad astra!)\n(Ascendit in astra!)" },
      { id: "b_orc_10", type: "chorus", label: "Chorus 3", text: "Rise from the ashes of the battleground!\nWhere destiny and courage can be found!\nWith wings of iron we ascend the crest\nPutting our mortal fear to rest!\nAeterna gloria, triumphus animi\nWe conquer through the sacred symphony!" },
      { id: "b_orc_11", type: "outro", label: "Outro", text: "Victoria nos vocat\nAscendit in astra\nTuneBloom Cinematic Master\nAmen" }
    ]
  });

  window.TuneBloomBlueprints = registry;
})(window);