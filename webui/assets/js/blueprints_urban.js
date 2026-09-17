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
    id: "trap_atlanta_no_cap",
    title: "No Cap In My Section",
    genre: "Hip Hop",
    subgenre: "Atlanta Trap / Melodic Auto-Tune",
    bpm: 136,
    key: "C# minor",
    mood: "Triumphant, ruthless, opulent, bouncy, nocturnal.",
    vocals: "Melodic auto-tune male trap tenor with aggressive delivery, rapid triplet cadences, layered hard-panned ad-libs, and distorted background vocal chops.",
    vocal_lead: "Melodic auto-tune male trap tenor with aggressive delivery, rapid triplet cadences, layered hard-panned ad-libs, and distorted background vocal chops.",
    instrumental_lead: "Heavy sliding 808 sub-bass glides, detuned bell synth arpeggios, sharp brass stabs.",
    arrangement: "Primary: Heavy sliding 808 sub-bass with dynamic pitch bends anchors the low-end. Secondary: Rapid 32nd-note rolling hi-hats and sharp brass stabs drive the groove around dark detuned bell arpeggios. Section drops feature sub-bass cuts and ascending brass fanfares.",
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
    ],
    instrumental_blocks: [
      { id: "ib_trp_1", type: "intro", label: "Intro", text: "(Dark detuned bell arpeggios, filtered sub rumble, rising white noise sweeps)" },
      { id: "ib_trp_2", type: "verse", label: "Verse 1", text: "(Sliding 808 sub-bass glides, crisp rimshot on 3, rolling 16th-note hi-hats)" },
      { id: "ib_trp_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Sharp brass stabs, rapid 32nd-note hi-hat rolls, rising snare roll crescendo)" },
      { id: "ib_trp_4", type: "chorus", label: "Chorus 1", text: "(Hard punchy kick, distorted 808 sub-bass, wide stereo bell leads, brass fanfare)" },
      { id: "ib_trp_5", type: "verse", label: "Verse 2", text: "(Stripped 808 sub bounce, sparse bell counterpoint, syncopated open hats)" },
      { id: "ib_trp_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Heavy brass accents, bassline doubling, syncopated triplet snare fills)" },
      { id: "ib_trp_7", type: "chorus", label: "Chorus 2", text: "(Climactic brass stabs, driving 808 glides, multi-velocity stereo hi-hats)" },
      { id: "ib_trp_8", type: "bridge", label: "Bridge", text: "(Half-time breakdown, filtered bell melodies, isolated sub-bass pulses, dark pads)" },
      { id: "ib_trp_9", type: "solo", label: "Solo", text: "(Distorted synth lead solo, rapid legato arpeggios, pitch bends, slapback delay)" },
      { id: "ib_trp_10", type: "chorus", label: "Chorus 3", text: "(Full melodic layering, brass fanfare, bells, maximum 808 impact, rolling trap kit)" },
      { id: "ib_trp_11", type: "outro", label: "Outro", text: "(Solo detuned bell synth, decaying reverb tails, descending 808 glide fade)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "drill_bronx_shadows",
    title: "Bronx Protocol",
    genre: "Drill",
    subgenre: "NY Sample Drill / UK Dark Bounce",
    bpm: 142,
    key: "E minor",
    mood: "Ominous, aggressive, cold, gritty, cinematic.",
    vocals: "Deep raspy baritone with aggressive staccato delivery, haunting pitched vocal sample loops, and layered drill ad-libs.",
    vocal_lead: "Deep raspy baritone with aggressive staccato delivery, haunting pitched vocal sample loops, and layered drill ad-libs.",
    instrumental_lead: "Violent pitch-sliding 808s, syncopated drill snare with 3rd-beat skips, ominous minor piano loop.",
    arrangement: "Primary: Violent pitch-sliding 808s anchor the low end with aggressive octave sweeps. Secondary: Syncopated drill snares with 3rd-beat skips and rapid counter-hats frame an ominous minor grand piano loop. Transitional moments utilize reverse choral textures and distant siren FX.",
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
    ],
    instrumental_blocks: [
      { id: "ib_drl_1", type: "intro", label: "Intro", text: "(Sampled choral chops, dark minor piano chords, distant vinyl static)" },
      { id: "ib_drl_2", type: "verse", label: "Verse 1", text: "(Violent pitch-sliding 808, syncopated drill snare, 3rd-beat skips, sparse rim clicks)" },
      { id: "ib_drl_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Rapid triplet hi-hat rolls, ascending sub-bass glides, reverse sample sweeps)" },
      { id: "ib_drl_4", type: "chorus", label: "Chorus 1", text: "(Saturated 808 drop, aggressive counter-melodic piano riff, punchy kick drum)" },
      { id: "ib_drl_5", type: "verse", label: "Verse 2", text: "(Syncopated rim clicks, sliding sub-bass, haunting cello counter-melody)" },
      { id: "ib_drl_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Hi-hat velocity rolls, sliding 808 lines, cinematic impact hits)" },
      { id: "ib_drl_7", type: "chorus", label: "Chorus 2", text: "(Syncopated snare skips, wide stereo choral chops, relentless low-end rumble)" },
      { id: "ib_drl_8", type: "bridge", label: "Bridge", text: "(Solitary grand piano chords, sub-bass drones, distant siren fx)" },
      { id: "ib_drl_9", type: "solo", label: "Solo", text: "(Distorted string quartet solo, aggressive staccato runs, sliding octaves, legato phrasing)" },
      { id: "ib_drl_10", type: "chorus", label: "Chorus 3", text: "(Full drill drum battery, layered string riffs, ground-shaking sliding 808s)" },
      { id: "ib_drl_11", type: "outro", label: "Outro", text: "(Decaying piano chords, fading sub-bass pulse, gradual room silence)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "phonk_memphis_evil_drift",
    title: "Nightmare On 66th",
    genre: "Phonk",
    subgenre: "Memphis Dark Phonk / Evil Trap",
    bpm: 145,
    key: "F# minor",
    mood: "Dark, menacing, relentless, hypnotic, aggressive.",
    vocals: "Aggressive chopped Memphis triplet cadence, distorted vocal doubling, and dark pitched-down backing chants.",
    vocal_lead: "Aggressive chopped Memphis triplet cadence, distorted vocal doubling, and dark pitched-down backing chants.",
    instrumental_lead: "Saturated Memphis cowbells, blown-out distorted 808 sub slides, gritty SP-1200 kick.",
    arrangement: "Primary: Saturated Memphis cowbell melodies and blown-out distorted 808 sub slides drive the hypnotic groove. Secondary: Gritty 12-bit SP-1200 kick drums and razor-sharp open hi-hat rolls anchor the rhythm under constant cassette tape hiss and low-frequency vinyl flutter.",
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
    ],
    instrumental_blocks: [
      { id: "ib_phk_1", type: "intro", label: "Intro", text: "(Cassette tape hiss, low-passed vinyl crackle, distorted bell melodies)" },
      { id: "ib_phk_2", type: "verse", label: "Verse 1", text: "(Distorted 808 sub-bass, gritty SP-1200 kick, blown-out cowbell melody, open hi-hat sizzle)" },
      { id: "ib_phk_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Syncopated cowbell counterpoint, rising tape-flanged noise sweeps, tight claps)" },
      { id: "ib_phk_4", type: "chorus", label: "Chorus 1", text: "(Hard-clipped 808 slides, resonant dual-cowbell harmonies, rapid hi-hat rolls)" },
      { id: "ib_phk_5", type: "verse", label: "Verse 2", text: "(Rolling Memphis bounce, modulated sub-bass glides, muted cowbell ghost notes)" },
      { id: "ib_phk_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Pitch-shifted synth pads, dark tremolo, rapid snare rolls, sub swell)" },
      { id: "ib_phk_7", type: "chorus", label: "Chorus 2", text: "(High-gain low-end punch, piercing cowbell leads, aggressive stereo panning)" },
      { id: "ib_phk_8", type: "bridge", label: "Bridge", text: "(Filtered sub rumble, solitary distorted cowbell hits, cassette flutter)" },
      { id: "ib_phk_9", type: "solo", label: "Solo", text: "(Screaming analog synth lead solo, tube saturation, tape echo repeats)" },
      { id: "ib_phk_10", type: "chorus", label: "Chorus 3", text: "(Blown-out 808 slides, layered melodic cowbells, frantic rolling percussion)" },
      { id: "ib_phk_11", type: "outro", label: "Outro", text: "(Dying cassette tape saturation, fading cowbell echoes, low-end static decay)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "westcoast_bay_area_bounce",
    title: "Sideshow Geometry",
    genre: "West Coast Hip Hop",
    subgenre: "Bay Area Hyphy / G-Funk Bounce",
    bpm: 98,
    key: "G minor",
    mood: "Swaggering, bouncy, triumphant, sun-drenched, raw.",
    vocals: "Laid-back aggressive West Coast baritone flow, syncopated talkbox vocal hooks, and hypeman call-and-response ad-libs.",
    vocal_lead: "Laid-back aggressive West Coast baritone flow, syncopated talkbox vocal hooks, and hypeman call-and-response ad-libs.",
    instrumental_lead: "Whining analog portamento G-Funk synth lead, slapping live bassline, talkbox melodic riffs.",
    arrangement: "Primary: Whining analog portamento G-Funk synth leads and slapping live basslines define the bouncy funk groove. Secondary: Heavy acoustic-electronic handclaps on 2 and 4, syncopated Latin congas, and clean rhythmic Stratocaster guitar scratches drive the bounce.",
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
    ],
    instrumental_blocks: [
      { id: "ib_wcb_1", type: "intro", label: "Intro", text: "(Minimoog portamento lead, clean Rhodes chords, subtle vinyl crackle)" },
      { id: "ib_wcb_2", type: "verse", label: "Verse 1", text: "(Slap bass groove, heavy acoustic-electronic claps on 2 and 4, crisp conga loop)" },
      { id: "ib_wcb_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Synthesizer brass swells, syncopated triangle accents, building bounce)" },
      { id: "ib_wcb_4", type: "chorus", label: "Chorus 1", text: "(Punchy low-end kick, soaring portamento synth lead, full stereo percussion)" },
      { id: "ib_wcb_5", type: "verse", label: "Verse 2", text: "(Slap-and-pop bass phrasing, clean muted Stratocaster guitar chops)" },
      { id: "ib_wcb_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Wah-wah guitar riffs, ascending synth sweeps, driving bounce momentum)" },
      { id: "ib_wcb_7", type: "chorus", label: "Chorus 2", text: "(Heavy low-end claps, singing analog synth lead, syncopated Latin percussion)" },
      { id: "ib_wcb_8", type: "bridge", label: "Bridge", text: "(Fingerstyle electric bass solo, Rhodes chords, dry hi-hat sizzle)" },
      { id: "ib_wcb_9", type: "solo", label: "Solo", text: "(Analog synth lead solo, expressive octave glides, vibrato pitch-wheel bends)" },
      { id: "ib_wcb_10", type: "chorus", label: "Chorus 3", text: "(Layered synth leads, punchy slap-bass groove, continuous percussion)" },
      { id: "ib_wcb_11", type: "outro", label: "Outro", text: "(Portamento synth glides, clean rhythm guitar chords, low-pass filter fade)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "drill_chicago_war_zone",
    title: "No Mercy In The Trenches",
    genre: "Drill",
    subgenre: "Chicago Street Drill / Dark Trap",
    bpm: 138,
    key: "C minor",
    mood: "Grim, lethal, relentless, dark, intense.",
    vocals: "Raspy aggressive street baritone, staccato triplet punchlines, authentic Chicago ad-libs, and aggressive vocal double.",
    vocal_lead: "Raspy aggressive street baritone, staccato triplet punchlines, authentic Chicago ad-libs, and aggressive vocal double.",
    instrumental_lead: "Heavy punchy 808s, ominous minor piano chords, rapid-fire trap percussion.",
    arrangement: "Primary: Menacing minor grand piano chords and heavy punchy 808 sub-bass lines anchor the aggressive groove. Secondary: Rapid-fire hi-hat rolls, crisp dry trap snares, and sub-bass drops drive the tempo, punctuated by distant thunder sound design and brass stabs.",
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
    ],
    instrumental_blocks: [
      { id: "ib_chd_1", type: "intro", label: "Intro", text: "(Minor grand piano motif, empty hall acoustics, low sub-bass drone, distant thunder)" },
      { id: "ib_chd_2", type: "verse", label: "Verse 1", text: "(Punchy 808 sub-bass, dry trap snare, rapid-fire hi-hat rolls, acoustic kick)" },
      { id: "ib_chd_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Heavy staccato piano octaves, ascending sub-bass pitch slides, snare rolls)" },
      { id: "ib_chd_4", type: "chorus", label: "Chorus 1", text: "(Heavy 808 drop, aggressive melodic piano counterpoint, sharp rimshots)" },
      { id: "ib_chd_5", type: "verse", label: "Verse 2", text: "(Rolling hi-hats, deep sub kicks, dark synth bell motif accents)" },
      { id: "ib_chd_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Rolling 32nd-note hi-hat runs, dynamic snare roll crescendo, sub swell)" },
      { id: "ib_chd_7", type: "chorus", label: "Chorus 2", text: "(Full drill percussion battery, thunderous low end, ominous brass stabs)" },
      { id: "ib_chd_8", type: "bridge", label: "Bridge", text: "(Lone ticking hi-hat, somber piano arpeggios, resonant sub-bass drops)" },
      { id: "ib_chd_9", type: "solo", label: "Solo", text: "(Distorted electric guitar solo, sweeping arpeggios, high-register dive-bombs)" },
      { id: "ib_chd_10", type: "chorus", label: "Chorus 3", text: "(Maximum 808 saturation, rapid drill percussion, furious piano melodies)" },
      { id: "ib_chd_11", type: "outro", label: "Outro", text: "(Decaying piano chords, icy reverb wash, gradual sub-bass fade)" }
    ]
  });

  window.registerTuneBloomBlueprint({
    id: "detroit_scam_punch",
    title: "Wire Transfers At 5 AM",
    genre: "Hip Hop",
    subgenre: "Detroit Scam Rap / Southern Plugg Fusion",
    bpm: 100,
    key: "D# minor",
    mood: "Arrogant, bouncy, raw, unapologetic, high-tempo.",
    vocals: "Off-beat Detroit punchflow, witty deadpan staccato delivery, layered hype ad-libs, and rapid bars without breathing.",
    vocal_lead: "Off-beat Detroit punchflow, witty deadpan staccato delivery, layered hype ad-libs, and rapid bars without breathing.",
    instrumental_lead: "Jumping Plugg synth bells, heavy punching Detroit 808 kick, off-beat bass stabs.",
    arrangement: "Primary: Jumping Plugg synthesizer bells and heavy punching Detroit 808 kicks establish the bouncing groove. Secondary: Bouncy handclaps on 2 and 4, off-beat baseline stabs, and bright 16th-note hi-hat runs drive the swaggering rhythm, punctuated by playful digital synth accents.",
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
    ],
    instrumental_blocks: [
      { id: "ib_dtp_1", type: "intro", label: "Intro", text: "(Plugg bell arpeggios, filtered sub-bass, playful digital synth bloops)" },
      { id: "ib_dtp_2", type: "verse", label: "Verse 1", text: "(Detroit 808 kick on 1, off-beat bass stabs, crisp rim-claps, bouncy 16th hats)" },
      { id: "ib_dtp_3", type: "pre-chorus", label: "Pre-Chorus 1", text: "(Descending bell runs, rapid hi-hat speed doubling, ascending sub-bass slides)" },
      { id: "ib_dtp_4", type: "chorus", label: "Chorus 1", text: "(Booming 808 bass, jumping lead bells, off-beat handclaps, syncopated snare skips)" },
      { id: "ib_dtp_5", type: "verse", label: "Verse 2", text: "(Infectious bounce, upright piano jazz countermelodies, sparkling bells)" },
      { id: "ib_dtp_6", type: "pre-chorus", label: "Pre-Chorus 2", text: "(Intricate percussion fills, detuned synth pulses, rising drop momentum)" },
      { id: "ib_dtp_7", type: "chorus", label: "Chorus 2", text: "(Low-end punch, sparkling bell leads, crisp stereo claps, rolling hi-hats)" },
      { id: "ib_dtp_8", type: "bridge", label: "Bridge", text: "(Half-time breakdown, solo Plugg bells, light shaker groove, isolated sub slides)" },
      { id: "ib_dtp_9", type: "solo", label: "Solo", text: "(Synth bell lead solo, rapid off-beat runs, pitch-wheel wobbles, stereo delay)" },
      { id: "ib_dtp_10", type: "chorus", label: "Chorus 3", text: "(Full bass impact, ringing bells, rolling snares, relentless Detroit bounce)" },
      { id: "ib_dtp_11", type: "outro", label: "Outro", text: "(Bouncy synth bells, digital modem sound effects, fading low-end silence)" }
    ]
  });
})(window);