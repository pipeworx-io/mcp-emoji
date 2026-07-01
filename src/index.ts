interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Emoji MCP.
 *
 * Keyless, offline: look up an emoji by :shortcode: (or reverse — get the
 * shortcode/name for an emoji character) and search emoji by keyword, from an
 * inlined table of common emoji. Pure lookup — no API, no key.
 */


// [emoji, shortcode, keywords]
const DATA: [string, string, string][] = [
  ['😀', 'grinning', 'happy smile face'], ['😃', 'smiley', 'happy joy'], ['😄', 'smile', 'happy laugh'],
  ['😁', 'grin', 'happy'], ['😂', 'joy', 'laugh cry tears funny'], ['🤣', 'rofl', 'laugh rolling funny'],
  ['🙂', 'slightly_smiling_face', 'smile'], ['😉', 'wink', 'flirt'], ['😊', 'blush', 'happy smile'],
  ['😍', 'heart_eyes', 'love like'], ['😘', 'kissing_heart', 'kiss love'], ['😎', 'sunglasses', 'cool'],
  ['🤔', 'thinking', 'think hmm consider'], ['😐', 'neutral_face', 'meh'], ['🙄', 'roll_eyes', 'annoyed'],
  ['😴', 'sleeping', 'sleep tired zzz'], ['😭', 'sob', 'cry sad tears'], ['😢', 'cry', 'sad tear'],
  ['😅', 'sweat_smile', 'relief nervous'], ['😤', 'triumph', 'angry proud'], ['😡', 'rage', 'angry mad'],
  ['🥳', 'partying_face', 'party celebrate'], ['🤯', 'exploding_head', 'mind blown shock'], ['😱', 'scream', 'fear shock'],
  ['🤗', 'hugs', 'hug'], ['🤩', 'star_struck', 'excited amazed'], ['😇', 'innocent', 'angel'],
  ['👍', 'thumbsup', 'yes good approve like'], ['👎', 'thumbsdown', 'no bad dislike'], ['👏', 'clap', 'applause bravo'],
  ['🙏', 'pray', 'please thanks hope'], ['🙌', 'raised_hands', 'celebrate praise'], ['👋', 'wave', 'hello bye hi'],
  ['🤝', 'handshake', 'deal agree'], ['✌️', 'v', 'peace victory'], ['🤞', 'crossed_fingers', 'luck hope'],
  ['💪', 'muscle', 'strong flex gym'], ['👀', 'eyes', 'look see watch'], ['🧠', 'brain', 'smart think'],
  ['❤️', 'heart', 'love red'], ['🧡', 'orange_heart', 'love'], ['💛', 'yellow_heart', 'love'],
  ['💚', 'green_heart', 'love'], ['💙', 'blue_heart', 'love'], ['💜', 'purple_heart', 'love'],
  ['🖤', 'black_heart', 'love'], ['💔', 'broken_heart', 'sad heartbreak'], ['💯', '100', 'perfect score keep it'],
  ['🔥', 'fire', 'lit hot flame'], ['✨', 'sparkles', 'shine magic new'], ['⭐', 'star', 'favorite'],
  ['🎉', 'tada', 'party celebrate congrats'], ['🎊', 'confetti_ball', 'party celebrate'], ['🎈', 'balloon', 'party'],
  ['🚀', 'rocket', 'launch ship fast space'], ['💡', 'bulb', 'idea light'], ['⚡', 'zap', 'lightning fast power'],
  ['💰', 'moneybag', 'money cash rich'], ['💸', 'money_with_wings', 'spend money'], ['💵', 'dollar', 'money cash'],
  ['📈', 'chart_with_upwards_trend', 'growth up stocks'], ['📉', 'chart_with_downwards_trend', 'down loss'],
  ['✅', 'white_check_mark', 'yes done correct ok'], ['❌', 'x', 'no wrong cancel'], ['⚠️', 'warning', 'caution alert'],
  ['❓', 'question', 'help ask'], ['❗', 'exclamation', 'important'], ['🔔', 'bell', 'notification alert'],
  ['🔒', 'lock', 'secure private'], ['🔑', 'key', 'password access'], ['🛠️', 'hammer_and_wrench', 'tools fix build'],
  ['🐶', 'dog', 'puppy pet'], ['🐱', 'cat', 'kitten pet'], ['🦊', 'fox', 'animal'], ['🐻', 'bear', 'animal'],
  ['🦁', 'lion', 'animal'], ['🐸', 'frog', 'animal'], ['🐢', 'turtle', 'slow animal'], ['🦄', 'unicorn', 'magic'],
  ['🐝', 'bee', 'insect'], ['🦋', 'butterfly', 'insect'], ['🌍', 'earth_africa', 'world globe planet'],
  ['🌙', 'crescent_moon', 'night'], ['☀️', 'sunny', 'sun weather'], ['☁️', 'cloud', 'weather'],
  ['🌧️', 'rain_cloud', 'rain weather'], ['❄️', 'snowflake', 'snow cold winter'], ['🌈', 'rainbow', 'pride color'],
  ['🍕', 'pizza', 'food'], ['🍔', 'hamburger', 'food burger'], ['🌮', 'taco', 'food'], ['🍣', 'sushi', 'food'],
  ['☕', 'coffee', 'drink caffeine'], ['🍺', 'beer', 'drink'], ['🍷', 'wine_glass', 'drink'], ['🎂', 'birthday', 'cake party'],
  ['🍎', 'apple', 'fruit food'], ['🥑', 'avocado', 'food'], ['⚽', 'soccer', 'football sport'], ['🏀', 'basketball', 'sport'],
  ['🎮', 'video_game', 'gaming play'], ['🎵', 'musical_note', 'music song'], ['📱', 'iphone', 'phone mobile'],
  ['💻', 'computer', 'laptop code'], ['⌨️', 'keyboard', 'type code'], ['📧', 'email', 'mail message'],
  ['📌', 'pushpin', 'pin location'], ['📎', 'paperclip', 'attach'], ['🔗', 'link', 'url chain'],
  ['🎯', 'dart', 'target goal bullseye'], ['🏆', 'trophy', 'win award champion'], ['🥇', 'first_place_medal', 'gold win'],
];

const byShort = new Map<string, [string, string, string]>();
const byEmoji = new Map<string, [string, string, string]>();
for (const d of DATA) { byShort.set(d[1], d); byEmoji.set(d[0], d); }

const tools: McpToolExport['tools'] = [
  {
    name: 'emoji_lookup',
    description: 'Look up an emoji by :shortcode: (e.g. ":fire:" or "fire") to get the character + keywords, OR pass an emoji character to get its shortcode/name. Keyless, offline.',
    inputSchema: { type: 'object', properties: { input: { type: 'string', description: 'A :shortcode:, a bare shortcode, or an emoji character.' } }, required: ['input'] },
  },
  {
    name: 'search_emoji',
    description: 'Search emoji by keyword/name (e.g. "party", "money", "animal") and return matching emoji with shortcodes. Keyless, offline.',
    inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'A keyword to search.' }, limit: { type: 'number', description: 'Max results (default 20).' } }, required: ['query'] },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'emoji_lookup': {
      const input = reqStr(args, 'input', '":fire:"').trim();
      const short = input.replace(/^:|:$/g, '');
      const byS = byShort.get(short.toLowerCase());
      if (byS) return { input, found: true, emoji: byS[0], shortcode: byS[1], keywords: byS[2].split(' ') };
      const byE = byEmoji.get(input) ?? byEmoji.get([...input][0]);
      if (byE) return { input, found: true, emoji: byE[0], shortcode: byE[1], keywords: byE[2].split(' ') };
      return { input, found: false, reason: 'Not in the emoji table. Try search_emoji by keyword.' };
    }
    case 'search_emoji': {
      const q = reqStr(args, 'query', '"party"').toLowerCase();
      const limit = Math.max(1, Math.min(100, typeof args.limit === 'number' ? args.limit : 20));
      const hits = DATA.filter(([, s, k]) => s.includes(q) || k.includes(q)).slice(0, limit).map(([e, s, k]) => ({ emoji: e, shortcode: s, keywords: k.split(' ') }));
      return { query: q, count: hits.length, results: hits };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqStr(args: Record<string, unknown>, key: string, ex: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${ex}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
