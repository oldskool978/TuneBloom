(function (window) {
  const BLUEPRINT_CATALOG = [
    {
      id: "bp_rnb_midnight",
      title: "Midnight Resonance",
      genre: "Contemporary R&B",
      subgenre: "2000s Pop R&B / Slow Jam Bounce",
      bpm: 96,
      key: "F minor",
      mood: "Sensual, passionate, nocturnal, intimate, confident.",
      vocals: "Silky male tenor lead vocal, dynamic chest-to-falsetto transitions, intricate melismatic ad-libs, stacked 4-part harmonies.",
      vocal_lead: "Silky male tenor lead vocal, dynamic chest-to-falsetto transitions, intricate melismatic ad-libs, stacked 4-part harmonies.",
      instrumental_lead: "Warm Fender Rhodes electric piano, expressive legato nylon guitar, melodic analog synthesizer leads.",
      arrangement: "Primary: Warm Fender Rhodes chords and expressive nylon guitar arpeggios establish the core harmonic progression. Secondary: A deep sliding 808 sub-bass enters alongside crisp syncopated rimshots and 16th-note hi-hat rolls. The chorus expands with rich analog string pads and dynamic claps, while the bridge strips back to solitary Rhodes voicings before a climactic final hook.",
      blocks: [
        {
          id: "b_rnb_1",
          type: "intro",
          label: "Intro",
          text: "(Smooth electric chords, subtle vinyl glide, ad-libs)\nYeah, listen\nMidnight in the city, let the groove breathe\nOh, yeah"
        },
        {
          id: "b_rnb_2",
          type: "verse",
          label: "Verse 1",
          text: "Midnight riding under neon streetlights\nSearching for the answers in the rearview mirror\nThought I had the blueprint solid in my mind\nNow the silhouette of you is drawing nearer\nDashboard glowing with a steady slow pulse\nEchoes of your whisper in the night air"
        },
        {
          id: "b_rnb_3",
          type: "pre-chorus",
          label: "Pre-Chorus",
          text: "I try to fight it, but it's pulling me in\nEvery harmonic frequency starts spinning again\nTension rising from the bottom to top\nGot that momentum and we never gon' stop"
        },
        {
          id: "b_rnb_4",
          type: "chorus",
          label: "Chorus",
          text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\n(Yeah, yeah, keep it right there)"
        },
        {
          id: "b_rnb_5",
          type: "verse",
          label: "Verse 2",
          text: "Two in the morning, baseline taking over\nSip of something smooth, leaning in a little closer\nSub-frequencies vibrating the floor\nYou give me everything, but I still want more"
        },
        {
          id: "b_rnb_6",
          type: "bridge",
          label: "Bridge",
          text: "Take it to the falsetto high, let the bass drop clean\nSmoothest vibration that you've ever seen\nCounterpoint melodies weaving around\nElevating the pressure, capturing the sound"
        },
        {
          id: "b_rnb_7",
          type: "solo",
          label: "Solo",
          text: "(Warm expressive electric guitar solo with dynamic slides and warm tube overdrive)"
        },
        {
          id: "b_rnb_8",
          type: "chorus",
          label: "Chorus",
          text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do"
        },
        {
          id: "b_rnb_9",
          type: "outro",
          label: "Outro",
          text: "Fade into the low-end frequency\nKeep the drum pocket steady for me\nAd-libs drifting out into the night\nYeah, just like that"
        }
      ],
      instrumental_blocks: [
        { id: "ib_rnb_1", type: "intro", label: "Intro", text: "(Filtered Rhodes chords, vinyl crackle, subtle tape delay)" },
        { id: "ib_rnb_2", type: "verse", label: "Verse 1", text: "(Deep 808 sub-bass, heavy pitch glides, syncopated rimshot, muted nylon guitar)" },
        { id: "ib_rnb_3", type: "pre-chorus", label: "Pre-Chorus", text: "(Rising analog synth pad swells, rolling 32nd-note hi-hats, building snare crescendo)" },
        { id: "ib_rnb_4", type: "chorus", label: "Chorus", text: "(Punchy four-on-the-floor kick, detuned lead synthesizer, wide stereo chorus, dynamic claps)" },
        { id: "ib_rnb_5", type: "verse", label: "Verse 2", text: "(Stripped drum pocket, syncopated 808 bass, legato guitar counter-melody)" },
        { id: "ib_rnb_6", type: "bridge", label: "Bridge", text: "(Subtractive breakdown, solitary Rhodes chords, resonant sub drops, filtered white noise)" },
        { id: "ib_rnb_7", type: "solo", label: "Solo", text: "(Overdriven electric guitar solo, dynamic pitch slides, expressive legato phrasing)" },
        { id: "ib_rnb_8", type: "chorus", label: "Chorus", text: "(Full explosive groove, layered brass stabs, driving 808 sub-bass, stereo percussion)" },
        { id: "ib_rnb_9", type: "outro", label: "Outro", text: "(Decaying spatial reverb tails, solitary Rhodes chords, low-end filter fade)" }
      ]
    },
    {
      id: "bp_synthwave_neon",
      title: "Neon Horizon 1984",
      genre: "Electronic / Synthwave",
      subgenre: "Retrowave / Outrun Dream Pop",
      bpm: 118,
      key: "D minor",
      mood: "Nostalgic, cinematic, propulsive, driving, triumphant.",
      vocals: "Clear female alto vocal, vintage tape saturation, delayed vocal throws, shimmering double-tracked chorus harmonies.",
      vocal_lead: "Clear female alto vocal, vintage tape saturation, delayed vocal throws, shimmering double-tracked chorus harmonies.",
      instrumental_lead: "Bright sawtooth synthesizer leads, vintage Roland Juno arpeggios, gated analog snare.",
      arrangement: "Primary: An arpeggiated analog bassline and pulsing 16th-note synthesizers provide constant forward momentum. Secondary: Gated LinnDrum snare hits and a punchy electronic kick anchor the 80s groove. Bright polyphonic brass synths punctuate section transitions, while wide chorus-drenched pads widen the stereo panorama during the climaxes.",
      blocks: [
        {
          id: "b_synth_1",
          type: "intro",
          label: "Intro",
          text: "(Analog arpeggiator opens with rising filter cutoff, gated snare rolls)\nOut on the grid tonight"
        },
        {
          id: "b_synth_2",
          type: "verse",
          label: "Verse 1",
          text: "Chasing the horizon down the digital highway\nHeadlights cutting through the midnight chrome\nStatic on the radio, signals in the twilight\nDriving through the shadows all alone\nEvery neon sign reflects inside my eyes\nUnderneath the electric skies"
        },
        {
          id: "b_synth_3",
          type: "pre-chorus",
          label: "Pre-Chorus",
          text: "Can you feel the circuit start to overload\nBurning like a fever on the open road\nAccelerating faster through the purple haze\nLost inside the synthesizer maze"
        },
        {
          id: "b_synth_4",
          type: "chorus",
          label: "Chorus",
          text: "Running through the neon horizon\nFaster than the speed of light\nElectric dreams are never dying\nWe own the highway tonight"
        },
        {
          id: "b_synth_5",
          type: "verse",
          label: "Verse 2",
          text: "Reflections on the glass, tachometer is redlined\nEchoes of the past are falling far behind\nSynthesizer pulse right through the steering wheel\nNothing else is real"
        },
        {
          id: "b_synth_6",
          type: "breakdown",
          label: "Breakdown",
          text: "(Drums drop out, filtered Juno pad chords swell with tape delay)"
        },
        {
          id: "b_synth_7",
          type: "solo",
          label: "Solo",
          text: "(Virtuosic pitch-bent synthesizer lead solo over driving electronic bass arpeggios)"
        },
        {
          id: "b_synth_8",
          type: "chorus",
          label: "Chorus",
          text: "Running through the neon horizon\nFaster than the speed of light\nElectric dreams are never dying\nWe own the highway tonight"
        },
        {
          id: "b_synth_9",
          type: "outro",
          label: "Outro",
          text: "Into the fading light\nElectric grid fades to black"
        }
      ],
      instrumental_blocks: [
        { id: "ib_synth_1", type: "intro", label: "Intro", text: "(Analog synth arpeggio, opening low-pass filter cutoff, gated snare fill)" },
        { id: "ib_synth_2", type: "verse", label: "Verse 1", text: "(Pulsing 16th-note bassline, four-on-the-floor kick, gated LinnDrum snare)" },
        { id: "ib_synth_3", type: "pre-chorus", label: "Pre-Chorus", text: "(Rising white noise sweep, octave synthesizer lead, dynamic pitch modulations)" },
        { id: "ib_synth_4", type: "chorus", label: "Chorus", text: "(Full driving electronic groove, soaring polyphonic brass synths, wide stereo pads)" },
        { id: "ib_synth_5", type: "verse", label: "Verse 2", text: "(Restrained drum groove, syncopated analog bassline, lush chorus keys)" },
        { id: "ib_synth_6", type: "breakdown", label: "Breakdown", text: "(Drums cut, isolated synthesizer chords, tape delay modulation, sub swell)" },
        { id: "ib_synth_7", type: "solo", label: "Solo", text: "(Fast synthesizer lead solo, pitch-wheel bends, stereo delay repeats)" },
        { id: "ib_synth_8", type: "chorus", label: "Chorus", text: "(Climactic full arrangement, maximum gated reverb, driving bass, bright brass chords)" },
        { id: "ib_synth_9", type: "outro", label: "Outro", text: "(Arpeggiator filter close, trailing delay tails, gradual analog fade)" }
      ]
    },
    {
      id: "bp_darksynth_cyber",
      title: "Neuro-Overdrive",
      genre: "Cyberpunk Darksynth",
      subgenre: "Industrial Electro / Midtempo Bass",
      bpm: 105,
      key: "E minor",
      mood: "Aggressive, dark, oppressive, mechanical, relentless.",
      vocals: "Heavily distorted vocoder and robotized male chant, harsh industrial texture, close metallic resonance.",
      vocal_lead: "Heavily distorted vocoder and robotized male chant, harsh industrial texture, close metallic resonance.",
      instrumental_lead: "Distorted reese bass, aggressive wavetable growls, metallic industrial percussion.",
      arrangement: "Primary: Heavy distorted reese basslines and aggressive pitch-modulated wavetable growls drive the track. Secondary: Punchy industrial kick drum, razor-sharp metallic snares, and relentless offbeat percussive accents. High-frequency glitch textures and filtered riser sweeps inject mechanical tension into transitional drops.",
      blocks: [
        {
          id: "b_dark_1",
          type: "intro",
          label: "Intro",
          text: "(Industrial alarm sirens, low distorted sub rumble, glitch stutter FX)\nSystem override initialized"
        },
        {
          id: "b_dark_2",
          type: "verse",
          label: "Verse 1",
          text: "Monolithic towers piercing through the acid rain\nSilicon neural network pulsing in my brain\nZero point energy coursing through the wire\nCybernetic heartbeat, synthetic hellfire"
        },
        {
          id: "b_dark_3",
          type: "pre-chorus",
          label: "Pre-Chorus",
          text: "Critical warning, threshold surpassed\nSteel and tungsten built to outlast\nPower surge rising up to the red\nErase the boundary of the living and dead"
        },
        {
          id: "b_dark_4",
          type: "chorus",
          label: "Chorus",
          text: "Neuro-overdrive, break the machine\nDarkest frequency that you've ever seen\nSub-level impact tearing through the floor\nWarning protocol, system hardcore"
        },
        {
          id: "b_dark_5",
          type: "breakdown",
          label: "Breakdown",
          text: "(Heavy half-time industrial stomps, metallic clangs, resonant bass drops)"
        },
        {
          id: "b_dark_6",
          type: "chorus",
          label: "Chorus",
          text: "Neuro-overdrive, break the machine\nDarkest frequency that you've ever seen\nSub-level impact tearing through the floor\nWarning protocol, system hardcore"
        },
        {
          id: "b_dark_7",
          type: "outro",
          label: "Outro",
          text: "Shutdown sequence complete\nStatic decay to silence"
        }
      ],
      instrumental_blocks: [
        { id: "ib_dark_1", type: "intro", label: "Intro", text: "(Industrial factory drone, low distorted sub rumble, digital glitch stutters)" },
        { id: "ib_dark_2", type: "verse", label: "Verse 1", text: "(Distorted reese bass, heavy four-on-the-floor industrial kick, metallic snare)" },
        { id: "ib_dark_3", type: "pre-chorus", label: "Pre-Chorus", text: "(Rising pitch sweep, rapid 16th-note machine-gun hi-hats, building sub pressure)" },
        { id: "ib_dark_4", type: "chorus", label: "Chorus", text: "(Midtempo bass drop, aggressive wavetable growls, crushing sub-bass, stereo distortion)" },
        { id: "ib_dark_5", type: "breakdown", label: "Breakdown", text: "(Half-time industrial breakdown, solitary metallic clangs, sub-bass pulse)" },
        { id: "ib_dark_6", type: "chorus", label: "Chorus", text: "(Maximum industrial impact, wall-of-sound distorted bass, pounding kick, siren FX)" },
        { id: "ib_dark_7", type: "outro", label: "Outro", text: "(Failing power grid FX, white noise hiss, decaying low sub rumble to silence)" }
      ]
    },
    {
      id: "bp_lofi_window",
      title: "Rainy Windowpane",
      genre: "Lo-Fi Hip Hop",
      subgenre: "Chillhop / Nostalgic Jazz Beats",
      bpm: 78,
      key: "Eb major",
      mood: "Dreamy, relaxing, nostalgic, cozy, atmospheric.",
      vocals: "Intimate, warm spoken word phrases, subtle background humming, heavy vinyl tape saturation.",
      vocal_lead: "Intimate, warm spoken word phrases, subtle background humming, heavy vinyl tape saturation.",
      instrumental_lead: "Dusty Rhodes electric piano, muted upright bass, mellow jazz trumpet fills.",
      arrangement: "Primary: Detuned, warbly Rhodes chords with vinyl crackle and wow-and-flutter tape modulation establish the cozy theme. Secondary: Boom-bap kick and soft side-stick snare played with a lazy, swung groove. Muted upright jazz bass grounds the bottom end while occasional mellow trumpet licks weave counter-melodies.",
      blocks: [
        {
          id: "b_lofi_1",
          type: "intro",
          label: "Intro",
          text: "(Vinyl crackle, warm rain falling on glass, dusty piano chords)\nJust another quiet afternoon\nYeah"
        },
        {
          id: "b_lofi_2",
          type: "verse",
          label: "Verse 1",
          text: "Drops of water rolling down the glass\nWatching every crowded second pass\nWarm cup of tea cooling on the sill\nTime is frozen, standing completely still\nPencil scribbling sketches in a book\nLost inside a momentary look"
        },
        {
          id: "b_lofi_3",
          type: "chorus",
          label: "Chorus",
          text: "Let the gentle rain wash it all away\nSave tomorrow for another day\nUnderneath the roof listening to the sound\nPeace is the sweetest melody I've found"
        },
        {
          id: "b_lofi_4",
          type: "verse",
          label: "Verse 2",
          text: "Distant sirens echoing through the street\nSynchronized with this relaxed beat\nDusty turntable spinning round and round\nElevating quietly off the ground"
        },
        {
          id: "b_lofi_5",
          type: "solo",
          label: "Solo",
          text: "(Mellow muted trumpet solo playing gentle lyrical phrases over swung drums and Rhodes)"
        },
        {
          id: "b_lofi_6",
          type: "chorus",
          label: "Chorus",
          text: "Let the gentle rain wash it all away\nSave tomorrow for another day\nUnderneath the roof listening to the sound\nPeace is the sweetest melody I've found"
        },
        {
          id: "b_lofi_7",
          type: "outro",
          label: "Outro",
          text: "Rain continues on the window\nFade out with the crackle of vinyl"
        }
      ],
      instrumental_blocks: [
        { id: "ib_lofi_1", type: "intro", label: "Intro", text: "(Vinyl crackle, rain texture, dusty detuned Rhodes chords)" },
        { id: "ib_lofi_2", type: "verse", label: "Verse 1", text: "(Swung boom-bap kick, soft rimshot, warm acoustic upright bass, muted guitar)" },
        { id: "ib_lofi_3", type: "chorus", label: "Chorus", text: "(Full laid-back groove, mellow muted trumpet accents, rich electric piano harmony)" },
        { id: "ib_lofi_4", type: "verse", label: "Verse 2", text: "(Filtered drum groove, walking upright bassline, subtle vinyl pops)" },
        { id: "ib_lofi_5", type: "solo", label: "Solo", text: "(Muted jazz trumpet solo, warm room reverb, lazy swung groove)" },
        { id: "ib_lofi_6", type: "chorus", label: "Chorus", text: "(Warm harmonic climax, layered trumpet fills, rich Rhodes chords, vinyl groove)" },
        { id: "ib_lofi_7", type: "outro", label: "Outro", text: "(Drums cut, isolated Rhodes arpeggio, rain ambiance, vinyl hiss fade)" }
      ]
    },
    {
      id: "bp_orchestral_epic",
      title: "Echoes of the Vanguard",
      genre: "Cinematic Orchestral",
      subgenre: "Epic Film Score / Hybrid Trailer",
      bpm: 124,
      key: "C minor",
      mood: "Heroic, monumental, intense, cinematic, triumphant.",
      vocals: "Towering mixed SATB choir chanting in resonant cathedral acoustics, powerful soprano soloist soaring over the climax.",
      vocal_lead: "Towering mixed SATB choir chanting in resonant cathedral acoustics, powerful soprano soloist soaring over the climax.",
      instrumental_lead: "Virtuosic cello melody, full symphonic brass section, thunderous taiko percussion ensemble.",
      arrangement: "Primary: An emotional solo cello motif introduces the heroic theme. Secondary: Massive orchestral strings build rolling rhythmic ostinatos accompanied by booming taiko drums and orchestral cymbals. French horns and tubas declare the main anthem, while brass stabs and trailer sound design hit with monumental impact during the climax.",
      blocks: [
        {
          id: "b_orch_1",
          type: "intro",
          label: "Intro",
          text: "(Sparse solo cello motif in cavernous acoustic hall, distant low timpani rolls)"
        },
        {
          id: "b_orch_2",
          type: "theme a",
          label: "Theme A",
          text: "Ancient banners standing in the wind\nThe long forgotten battle will begin\nFrom the shadows into blinding light\nWe gather strength to face the coming night"
        },
        {
          id: "b_orch_3",
          type: "build",
          label: "Build Up",
          text: "(Staccato 16th-note string ostinatos enter, accelerating taiko drum rolls)\nStand fast, hold the line\nAcross the shifting sands of time"
        },
        {
          id: "b_orch_4",
          type: "chorus",
          label: "Climax 1",
          text: "Echoes of the fallen rise again\nThrough the fire and the driving rain\nGlorious ascension to the throne\nWe will never stand alone"
        },
        {
          id: "b_orch_5",
          type: "breakdown",
          label: "Breakdown",
          text: "(Percussion cuts abruptly, solitary solo French horn carries the thematic melody)"
        },
        {
          id: "b_orch_6",
          type: "chorus",
          label: "Grand Finale",
          text: "Echoes of the fallen rise again\nThrough the fire and the driving rain\nGlorious ascension to the throne\nWe will never stand alone"
        },
        {
          id: "b_orch_7",
          type: "outro",
          label: "Outro",
          text: "(Full symphonic chord decaying with majestic hall reverb, final solitary cello note)"
        }
      ],
      instrumental_blocks: [
        { id: "ib_orch_1", type: "intro", label: "Intro", text: "(Solitary solo cello motif, cavernous hall reverb, distant timpani roll)" },
        { id: "ib_orch_2", type: "theme a", label: "Theme A", text: "(Low string section swells, steady marching taiko pulse, French horn counter-melody)" },
        { id: "ib_orch_3", type: "build", label: "Build Up", text: "(Rapid 16th-note spiccato violin ostinatos, accelerating snare rolls, rising brass fanfare)" },
        { id: "ib_orch_4", type: "chorus", label: "Climax 1", text: "(Monumental orchestral explosion, thunderous taikos, soaring trumpet melody, crashing cymbals)" },
        { id: "ib_orch_5", type: "breakdown", label: "Breakdown", text: "(Sudden dynamic drop, solitary French horn solo, quiet atmospheric string pad)" },
        { id: "ib_orch_6", type: "chorus", label: "Grand Finale", text: "(Full symphonic wall of sound, massive brass stabs, heavy sub impacts, triumphant strings)" },
        { id: "ib_orch_7", type: "outro", label: "Outro", text: "(Decaying concert hall reverb tail, final low cello sustain, silence)" }
      ]
    },
    {
      id: "bp_folk_timberline",
      title: "Timberline Whispers",
      genre: "Indie Folk",
      subgenre: "Modern Acoustic / Singer-Songwriter",
      bpm: 104,
      key: "G major",
      mood: "Organic, warm, contemplative, gentle, hopeful.",
      vocals: "Earthy male baritone with subtle vocal rasp, intimate close-mic delivery, layered acoustic group harmonies in the choruses.",
      vocal_lead: "Earthy male baritone with subtle vocal rasp, intimate close-mic delivery, layered acoustic group harmonies in the choruses.",
      instrumental_lead: "Fingerpicked Martin acoustic guitar, warm upright acoustic bass, expressive pedal steel guitar.",
      arrangement: "Primary: An intricate steel-string acoustic guitar fingerpicking pattern anchors the entire piece. Secondary: Clean upright double bass enters during the second phrase to support the chord changes. Brushed snare drums and stomp-and-clap percussion enter during the choruses to build energy, accented by soaring pedal steel guitar counter-melodies.",
      blocks: [
        {
          id: "b_folk_1",
          type: "intro",
          label: "Intro",
          text: "(Delicate steel-string guitar fingerpicking, natural room resonance)\nMorning mist on the mountain"
        },
        {
          id: "b_folk_2",
          type: "verse",
          label: "Verse 1",
          text: "Woke up to the frost upon the cedar trees\nWhisper of the river carried by the breeze\nTraded all the city lights for mountain air\nLeft the heavy burdens that I used to bear\nPack my boots and hit the winding trail today\nWatch the morning shadows start to fade away"
        },
        {
          id: "b_folk_3",
          type: "pre-chorus",
          label: "Pre-Chorus",
          text: "Step by step, the summit's drawing near\nEvery breath is clean and ringing clear\nHigh above the treeline where the eagles soar\nFound the peaceful rhythm I was looking for"
        },
        {
          id: "b_folk_4",
          type: "chorus",
          label: "Chorus",
          text: "Oh, take me back to where the wildflowers grow\nWhere the clean cold mountain waters flow\nUnderneath the open canopy of pines\nI will leave my wanderings behind"
        },
        {
          id: "b_folk_5",
          type: "verse",
          label: "Verse 2",
          text: "Campfire embers glowing in the twilight dusk\nPine needles crunched beneath an earthen crust\nStars ignite across the valley deep and wide\nNothing left for me to run from or to hide"
        },
        {
          id: "b_folk_6",
          type: "solo",
          label: "Solo",
          text: "(Warm expressive pedal steel and mandolin solo with gentle acoustic guitar backing)"
        },
        {
          id: "b_folk_7",
          type: "chorus",
          label: "Chorus",
          text: "Oh, take me back to where the wildflowers grow\nWhere the clean cold mountain waters flow\nUnderneath the open canopy of pines\nI will leave my wanderings behind"
        },
        {
          id: "b_folk_8",
          type: "outro",
          label: "Outro",
          text: "Into the quiet woods\nGentle guitar fingerpicking fades"
        }
      ],
      instrumental_blocks: [
        { id: "ib_folk_1", type: "intro", label: "Intro", text: "(Intricate fingerpicked acoustic guitar, organic room ambience, subtle string harmonics)" },
        { id: "ib_folk_2", type: "verse", label: "Verse 1", text: "(Steady guitar arpeggio, warm acoustic double bass, light brushed snare)" },
        { id: "ib_folk_3", type: "pre-chorus", label: "Pre-Chorus", text: "(Stomp and clap rhythm enters, mandolin tremolo picking, rising dynamic swells)" },
        { id: "ib_folk_4", type: "chorus", label: "Chorus", text: "(Full acoustic groove, soaring pedal steel guitar, driving kick stomp, open cymbals)" },
        { id: "ib_folk_5", type: "verse", label: "Verse 2", text: "(Restrained acoustic picking, upright bass notes, subtle tambourine on 2 and 4)" },
        { id: "ib_folk_6", type: "solo", label: "Solo", text: "(Melodic pedal steel guitar solo, expressive volume swells, fingerpicked acoustic backing)" },
        { id: "ib_folk_7", type: "chorus", label: "Chorus", text: "(Climactic full acoustic ensemble, rich mandolin chords, driving rhythm, open room sound)" },
        { id: "ib_folk_8", type: "outro", label: "Outro", text: "(Decaying acoustic guitar harmonics, solitary upright bass note, room silence)" }
      ]
    },
    {
      id: "bp_funk_studio79",
      title: "Studio 79 Groove",
      genre: "Funk Pop",
      subgenre: "Disco Revival / Nu-Disco Bounce",
      bpm: 122,
      key: "G minor",
      mood: "Celebratory, energetic, uplifting, groovy, infectious.",
      vocals: "Powerful female mezzo-soprano, bold pop delivery, playful ad-libs, stacked falsetto harmonies in the choruses.",
      vocal_lead: "Powerful female mezzo-soprano, bold pop delivery, playful ad-libs, stacked falsetto harmonies in the choruses.",
      instrumental_lead: "Slap bass guitar, punchy brass section (trumpet/saxophone), clean funky rhythm guitar chops.",
      arrangement: "Primary: An infectious syncopated slap bassline and four-on-the-floor disco kick anchor the foundation. Secondary: Rhythmic electric guitar chops on the offbeats provide percussive drive. A punchy horn section delivers crisp stabs on structural downbeats, while vintage string synths add glossy stereo shimmer during the choruses.",
      blocks: [
        {
          id: "b_funk_1",
          type: "intro",
          label: "Intro",
          text: "(Syncopated slap bass riff, four-on-the-floor kick, horn fanfare)\nYeah! Get up on the floor!\nCome on!"
        },
        {
          id: "b_funk_2",
          type: "verse",
          label: "Verse 1",
          text: "Step inside the velvet room, mirror ball is spinning\nFriday night is in the air, the party just beginning\nGot that rhythm in your shoes, electricity inside\nThrow away your reservations, come along for the ride"
        },
        {
          id: "b_funk_3",
          type: "pre-chorus",
          label: "Pre-Chorus",
          text: "Feel the pressure rising from the speakers to the ceiling\nEverybody in the building synchronizing with the feeling\nHorns are getting louder now, the baseline's getting tight\nWe are taking over the night"
        },
        {
          id: "b_funk_4",
          type: "chorus",
          label: "Chorus",
          text: "Don't stop the groove, keep it moving right now\nEverybody on the floor, let me show you how\nGot that classic vibration, pure funk sensation\nWe're gonna dance till the morning light"
        },
        {
          id: "b_funk_5",
          type: "verse",
          label: "Verse 2",
          text: "Sweat is dripping down the glass, bass is locked inside the pocket\nNothing gonna slow us down, ignited like a rocket\nGuitar chops are cutting clean right across the groove\nTell me what you wanna do"
        },
        {
          id: "b_funk_6",
          type: "breakdown",
          label: "Breakdown",
          text: "(Rhythm strips back to solo slap bass and handclaps, building tension)\nRight there, bring it back!"
        },
        {
          id: "b_funk_7",
          type: "chorus",
          label: "Chorus",
          text: "Don't stop the groove, keep it moving right now\nEverybody on the floor, let me show you how\nGot that classic vibration, pure funk sensation\nWe're gonna dance till the morning light"
        },
        {
          id: "b_funk_8",
          type: "outro",
          label: "Outro",
          text: "Keep that bass playing\nDance till the morning light\nFade to black"
        }
      ],
      instrumental_blocks: [
        { id: "ib_funk_1", type: "intro", label: "Intro", text: "(Slap bass groove, four-on-the-floor kick, brass section stabs)" },
        { id: "ib_funk_2", type: "verse", label: "Verse 1", text: "(Tight syncopated bassline, offbeat funk guitar chops, crisp snare drum)" },
        { id: "ib_funk_3", type: "pre-chorus", label: "Pre-Chorus", text: "(Rising brass swell, rapid open hi-hat accents, building octave bassline)" },
        { id: "ib_funk_4", type: "chorus", label: "Chorus", text: "(Full explosive disco groove, punchy horn section, wide vintage string synths, stereo claps)" },
        { id: "ib_funk_5", type: "verse", label: "Verse 2", text: "(Stripped rhythmic pocket, slap bass fills, syncopated guitar strums)" },
        { id: "ib_funk_6", type: "breakdown", label: "Breakdown", text: "(Isolated slap bass riff, handclaps on 2 and 4, rising synth riser)" },
        { id: "ib_funk_7", type: "chorus", label: "Chorus", text: "(Maximum dynamic energy, soaring brass fanfare, driving disco drums, lush string chords)" },
        { id: "ib_funk_8", type: "outro", label: "Outro", text: "(Extending slap bass riffs, energetic brass accents, gradual rhythm fade)" }
      ]
    },
    {
      id: "bp_trap_phantom",
      title: "Velvet Phantom",
      genre: "Modern Melodic Trap",
      subgenre: "Dark Trap / Ambient Cloud Rap",
      bpm: 140,
      key: "A minor",
      mood: "Dark, melancholic, hypnotic, confident, spacious.",
      vocals: "Autotuned male melodic delivery, intimate sing-rap cadence, ambient reverb throws, doubled lower-octave layers.",
      vocal_lead: "Autotuned male melodic delivery, intimate sing-rap cadence, ambient reverb throws, doubled lower-octave layers.",
      instrumental_lead: "Distorted 808 sub-bass, reverse bell plucks, half-time syncopated trap snare.",
      arrangement: "Primary: A reverse acoustic bell pluck drenched in spatial tape delay establishes the dark melodic loop. Secondary: Heavy distorted 808 sub-bass glides enter alongside rolling 32nd-note hi-hat triplets and a crisp electronic snare on beat 3. Ambient filtered synth pads thicken the stereo field during the main hooks.",
      blocks: [
        {
          id: "b_trap_1",
          type: "intro",
          label: "Intro",
          text: "(Reverse bell melody, filtered low-end tape noise, delayed ad-libs)\nYeah, phantom in the mist\nLook"
        },
        {
          id: "b_trap_2",
          type: "verse",
          label: "Verse 1",
          text: "Rolling through the dark in a tinted limousine\nCounting up the fragments of an iridescent dream\nDiamond chains frozen cold hanging on my chest\nRunning through the shadows, never getting any rest\nPhone is on silent while the world is ringing loud\nMoving like a ghost right through the crowd"
        },
        {
          id: "b_trap_3",
          type: "pre-chorus",
          label: "Pre-Chorus",
          text: "Can you see the phantom moving in the fog\nClimbing from the bottom of the dialogue\nHeavy 808s vibrating in the floor\nKnocking at the heavy iron door"
        },
        {
          id: "b_trap_4",
          type: "chorus",
          label: "Chorus",
          text: "Velvet phantom gliding through the midnight chill\nStanding at the summit of the lonely hill\nEverything they said that we could never be\nNow we write our own destiny"
        },
        {
          id: "b_trap_5",
          type: "verse",
          label: "Verse 2",
          text: "Smoke drifting upward to the ceiling fan\nFollowing the blueprint of a master plan\nBass hit heavy, hear the window shake\nWide awake"
        },
        {
          id: "b_trap_6",
          type: "chorus",
          label: "Chorus",
          text: "Velvet phantom gliding through the midnight chill\nStanding at the summit of the lonely hill\nEverything they said that we could never be\nNow we write our own destiny"
        },
        {
          id: "b_trap_7",
          type: "outro",
          label: "Outro",
          text: "Phantom fades out into the night\nHeavy sub-bass rolls out to black"
        }
      ],
      instrumental_blocks: [
        { id: "ib_trap_1", type: "intro", label: "Intro", text: "(Reverse bell melody, tape delay repeats, filtered sub sweep)" },
        { id: "ib_trap_2", type: "verse", label: "Verse 1", text: "(Distorted 808 sub-bass glides, sharp rimshot on 3, rapid hi-hat rolls)" },
        { id: "ib_trap_3", type: "pre-chorus", label: "Pre-Chorus", text: "(Rising synth riser, 32nd-note hi-hat triplets, building snare rolls)" },
        { id: "ib_trap_4", type: "chorus", label: "Chorus", text: "(Heavy saturated 808 drop, punchy acoustic-electronic kick, dark bell melody, stereo claps)" },
        { id: "ib_trap_5", type: "verse", label: "Verse 2", text: "(Stripped trap beat, sub-bass pulse, isolated reverse bell loop)" },
        { id: "ib_trap_6", type: "chorus", label: "Chorus", text: "(Full trap drop, maximum 808 saturation, complex rolling hi-hats, wide pads)" },
        { id: "ib_trap_7", type: "outro", label: "Outro", text: "(Decaying bell delay tails, low-pass filter sweep, fading 808 sub rumble)" }
      ]
    }
  ];

  function registerBlueprint(node) {
    if (!node || typeof node !== "object" || !node.id) return;
    const existingIndex = BLUEPRINT_CATALOG.findIndex((b) => b.id === node.id);
    if (existingIndex >= 0) {
      BLUEPRINT_CATALOG[existingIndex] = node;
    } else {
      BLUEPRINT_CATALOG.push(node);
    }
  }

  window.registerTuneBloomBlueprint = registerBlueprint;

  if (Array.isArray(window.__TB_BLUEPRINT_QUEUE) && window.__TB_BLUEPRINT_QUEUE.length > 0) {
    window.__TB_BLUEPRINT_QUEUE.forEach(registerBlueprint);
    window.__TB_BLUEPRINT_QUEUE = [];
  }

  window.TuneBloomBlueprints = {
    register: registerBlueprint,
    getAll: () => JSON.parse(JSON.stringify(BLUEPRINT_CATALOG)),
    getById: (id) => {
      const found = BLUEPRINT_CATALOG.find((b) => b.id === id);
      return found ? JSON.parse(JSON.stringify(found)) : null;
    },
    getRandom: () => {
      if (BLUEPRINT_CATALOG.length === 0) return null;
      const idx = Math.floor(Math.random() * BLUEPRINT_CATALOG.length);
      return JSON.parse(JSON.stringify(BLUEPRINT_CATALOG[idx]));
    }
  };
})(window);