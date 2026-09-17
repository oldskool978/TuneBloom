(function (window) {
  function sanitizeTag(str) {
    return String(str || "")
      .replace(/[\[\]]/g, "")
      .replace(/[\r\n\t]/g, " ")
      .trim();
  }

  function canonicalType(tagOrLabel) {
    const clean = sanitizeTag(tagOrLabel).toLowerCase();
    if (!clean) return "verse";
    if (clean.includes("intro") || clean === "start") return "intro";
    if (clean.includes("pre-chorus") || clean.includes("prechorus") || clean.includes("build")) return "pre-chorus";
    if (clean.includes("post-chorus") || clean.includes("postchorus")) return "post-chorus";
    if (clean.includes("chorus") || clean.includes("hook") || clean.includes("drop") || clean.includes("refrain")) return "chorus";
    if (clean.includes("bridge") || clean.includes("transition")) return "bridge";
    if (clean.includes("breakdown") || clean.includes("beat drop") || clean.includes("interlude")) return "breakdown";
    if (clean.includes("solo")) return "solo";
    if (clean.includes("instrumental") || clean.includes("theme")) return "instrumental";
    if (clean.includes("outro") || clean.includes("fade") || clean.includes("ending")) return "outro";
    if (clean.includes("verse")) return "verse";
    return clean.replace(/[^a-z0-9_-]/g, "") || "verse";
  }

  function sanitizeBlockList(rawBlocks, isInstrumental = false) {
    if (!Array.isArray(rawBlocks)) return [];
    return rawBlocks
      .filter((b) => b && typeof b === "object")
      .map((b, idx) => {
        const rawLabel = sanitizeTag(b.label || b.type || (isInstrumental ? "Theme" : "Verse"));
        const cleanType = canonicalType(rawLabel);
        const rawText = String(b.text || "").replace(/\r\n/g, "\n").trim();
        let cleanText = rawText;
        if (isInstrumental && rawText.length > 0) {
          const stripped = rawText.replace(/^\(+|\)+$/g, "").trim();
          cleanText = `(${stripped})`;
        }
        return {
          id: String(b.id || `b_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`),
          type: cleanType,
          label: rawLabel || (cleanType.charAt(0).toUpperCase() + cleanType.slice(1)),
          text: cleanText
        };
      });
  }

  class BlueprintRegistry {
    constructor() {
      this.nodes = new Map();
      this.order = [];
      this._drainQueue();
    }

    _drainQueue() {
      if (Array.isArray(window.__TB_BLUEPRINT_QUEUE)) {
        while (window.__TB_BLUEPRINT_QUEUE.length > 0) {
          const item = window.__TB_BLUEPRINT_QUEUE.shift();
          this.register(item);
        }
      }
    }

    register(node) {
      if (!node || !node.id) return;
      const cleanId = String(node.id).trim();
      const rawBpm = Number(node.bpm) || 96;
      const cleanBpm = Math.max(30, Math.min(300, Math.round(rawBpm)));

      const cleanNode = {
        id: cleanId,
        title: String(node.title || "Untitled Master").trim().slice(0, 80),
        genre: String(node.genre || "Contemporary R&B").trim().slice(0, 60),
        subgenre: String(node.subgenre || "").trim().slice(0, 60),
        bpm: cleanBpm,
        key: String(node.key || "F minor").trim().slice(0, 30),
        mood: String(node.mood || "").trim().slice(0, 200),
        vocals: String(node.vocals || "").trim().slice(0, 300),
        arrangement: String(node.arrangement || "").trim().slice(0, 300),
        blocks: sanitizeBlockList(node.blocks, false),
        instrumental_blocks: sanitizeBlockList(node.instrumental_blocks, true)
      };

      if (!this.nodes.has(cleanId)) {
        this.order.push(cleanId);
      }
      this.nodes.set(cleanId, cleanNode);
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
  window.TuneBloomBlueprints = registry;

  window.registerTuneBloomBlueprint = function (node) {
    registry.register(node);
  };

  registry.register({
    id: "rnb_midnight_frequency",
    title: "Midnight Frequency",
    genre: "Contemporary R&B",
    subgenre: "2000s Pop R&B / Slow Jam Bounce",
    bpm: 96,
    key: "F minor",
    mood: "Sensual, passionate, nocturnal, intimate, confident.",
    vocals: "Silky male tenor with warm, breathy low-register delivery in the verses. Transitions to powerful chest-to-falsetto belts in the chorus, supported by tight 4-part stacked harmonies and intricate melismatic ad-libs.",
    arrangement: "Deep sliding 808 sub-bass anchors the groove while warm Fender Rhodes chords provide lush harmonic motion. Clean acoustic nylon guitar plays sparse legato plucks with expressive slides around the lead.",
    blocks: [
      {
        id: "b_rnb_1",
        type: "intro",
        label: "Intro",
        text: "Yeah, listen\nMidnight in the city, let the groove breathe\nGot you on my mind tonight\nYeah, don't rush the tempo\n(Oh, oh-woah, yeah)\n(Keep it right there, baby)"
      },
      {
        id: "b_rnb_2",
        type: "verse",
        label: "Verse 1",
        text: "Midnight riding under neon streetlights\nSearching for the answers in the rearview mirror\nThought I had the blueprint solid in my mind\nNow the silhouette of you is drawing nearer\nDashboard glowing with a steady slow pulse\nEchoes of your whisper in the night air\nEvery little touch that we used to share\nPulling up outside your door, yeah I know you're there\nTwo in the morning, got that look in your eyes\nNo more games and no more sweet alibis"
      },
      {
        id: "b_rnb_3",
        type: "pre-chorus",
        label: "Pre-Chorus 1",
        text: "I try to fight it, but it's pulling me in\nEvery harmonic frequency starts spinning again\nTension rising from the bottom to top\nGot that momentum and we never gon' stop\nFeel the sub-bass vibrating down through the floor\nEvery little kiss just leaves me begging for more\n(Yeah, begging for more)"
      },
      {
        id: "b_rnb_4",
        type: "chorus",
        label: "Chorus 1",
        text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\nSinking deep inside the pocket of sound\nBest damn love that we ever have found\n(Yeah, yeah, keep it right there)\n(Nobody does it like you do)"
      },
      {
        id: "b_rnb_5",
        type: "verse",
        label: "Verse 2",
        text: "Two-thirty now and the bassline taking over\nSip of something smooth, leaning in a little closer\nSilk on your skin, candlelight on the wall\nAnswering the passion every time that you call\nSyncopated touch, perfect timing on the beat\nFire in our eyes, generating pure heat\nGot your hands running through my hair real slow\nTaking full control of the rhythm and flow\nWhisper in my ear what you need me to do\nSpend the whole night making love to you"
      },
      {
        id: "b_rnb_6",
        type: "pre-chorus",
        label: "Pre-Chorus 2",
        text: "I try to fight it, but it's pulling me in\nEvery harmonic frequency starts spinning again\nTension rising from the bottom to top\nGot that momentum and we never gon' stop\nFeel the sub-bass vibrating down through the floor\nEvery little kiss just leaves me begging for more\n(Oh yeah, give me more)"
      },
      {
        id: "b_rnb_7",
        type: "chorus",
        label: "Chorus 2",
        text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\nSinking deep inside the pocket of sound\nBest damn love that we ever have found\n(Yeah, yeah, right into the pocket)\n(Don't you ever let me go)"
      },
      {
        id: "b_rnb_8",
        type: "bridge",
        label: "Bridge",
        text: "Take it to the falsetto high, let the bass drop clean\nSmoothest vibration that you've ever seen\nCounterpoint melodies weaving around\nElevating the pressure, capturing the sound\nHold that note, let the energy soar\nTake it to places that we never went before\nJust breathe with me, stay right inside the groove\nNothing left in this world we gotta prove\n(Oh, nothing left to prove)"
      },
      {
        id: "b_rnb_9",
        type: "solo",
        label: "Solo",
        text: "(Oh, yeah... take it all the way up)\n(Ride the wave, baby)\n(Ooh-woah... yeah)\n(Yeah, yeah, yeah)"
      },
      {
        id: "b_rnb_10",
        type: "chorus",
        label: "Chorus 3",
        text: "Got me caught up in the way that you move\nNobody else can lock right into the groove\nGot my heart on the floor, baby, give me one more\nShow me that rhythm, tell me what you wanna do\nSinking deep inside the pocket of sound\nBest damn love that we ever have found\n(Oh-woah, give me one more time)\n(Lock it down in the midnight groove)"
      },
      {
        id: "b_rnb_11",
        type: "outro",
        label: "Outro",
        text: "Fade into the low-end frequency\nKeep the drum pocket steady for me\nSun's coming up but we staying right here\nWhisper in my ear keep it crystal and clear\n(Yeah, just like that)\n(Stay right there)\n(TuneBloom R&B Master)\n(Fade to black)"
      }
    ],
    instrumental_blocks: [
      {
        id: "ib_rnb_1",
        type: "intro",
        label: "Intro",
        text: "(Warm Fender Rhodes chords play sparse extended voicings over subtle vinyl crackle and distant analog tape delay)"
      },
      {
        id: "ib_rnb_2",
        type: "verse",
        label: "Verse 1",
        text: "(Deep sliding 808 sub-bass enters alongside crisp syncopated rimshots on 2 and 4 while an acoustic nylon guitar introduces sparse legato plucks)"
      },
      {
        id: "ib_rnb_3",
        type: "pre-chorus",
        label: "Pre-Chorus 1",
        text: "(Dynamic tension accelerates with rising analog synth pad swells, rolling 32nd-note hi-hat accents, and subtle pitch-filtered white noise sweeps)"
      },
      {
        id: "ib_rnb_4",
        type: "chorus",
        label: "Chorus 1",
        text: "(Full punchy hybrid kick drum drops in, melodic Rhodes tremolo takes the lead, accompanied by wide stereo chorus synths and deep resonant 808 glides)"
      },
      {
        id: "ib_rnb_5",
        type: "verse",
        label: "Verse 2",
        text: "(Percussion strips back to rimshot and rolling hi-hat pocket while expressive legato electric guitar answers the chord changes with subtle vibrato)"
      },
      {
        id: "ib_rnb_6",
        type: "pre-chorus",
        label: "Pre-Chorus 2",
        text: "(Harmonic layers build with ascending bass countermelodies, swell automations, and intricate percussion fills driving toward the downbeat)"
      },
      {
        id: "ib_rnb_7",
        type: "chorus",
        label: "Chorus 2",
        text: "(Climactic drop with full rhythmic section, driving 808 sub-bass, soaring synth counterpoint, and maximum stereo width across the master bus)"
      },
      {
        id: "ib_rnb_8",
        type: "bridge",
        label: "Bridge",
        text: "(Half-time rhythmic breakdown featuring isolated low-pass filtered Rhodes chords, warm upright sub bass, and delicate suspended cymbal washes)"
      },
      {
        id: "ib_rnb_9",
        type: "solo",
        label: "Solo",
        text: "(Virtuosic expressive electric guitar takes center stage, delivering melodic legato phrasing, dynamic pitch slides, and warm tube overdrive)"
      },
      {
        id: "ib_rnb_10",
        type: "chorus",
        label: "Chorus 3",
        text: "(Final explosive acoustic climax featuring layered electric guitar motifs, driving 808 pocket, and maximum harmonic punch across all registers)"
      },
      {
        id: "ib_rnb_11",
        type: "outro",
        label: "Outro",
        text: "(Drums dissolve gradually into tape delay, leaving solitary Rhodes chords and decaying spatial reverb tails fading into absolute silence)"
      }
    ]
  });
})(window);