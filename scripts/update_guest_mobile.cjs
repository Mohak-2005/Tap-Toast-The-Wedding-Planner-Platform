const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'GuestMobileView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import getWeddingCountdown
if (!content.includes('getWeddingCountdown')) {
  content = content.replace(
    "import { useAppState, showToast } from '../lib/state';",
    "import { useAppState, showToast, getWeddingCountdown } from '../lib/state';"
  );
}

// 2. Add feedPhoto state and file input ref, and countdown
const feedStateMarker = "  // Feed State\r\n  const [feedPhase, setFeedPhase] = useState<'pre' | 'married'>('pre');";
const feedStateMarkerLF = "  // Feed State\n  const [feedPhase, setFeedPhase] = useState<'pre' | 'married'>('pre');";

const newFeedState = `  // Feed State
  const activeWedding = state.weddings?.[0];
  const countdown = getWeddingCountdown(activeWedding?.date || '2026-11-14T14:00:00');
  const isPastWedding = countdown.days <= 0 && countdown.hours <= 0 && countdown.minutes <= 0;
  const autoPhase: 'pre' | 'married' = isPastWedding ? 'married' : 'pre';
  const [feedPhoto, setFeedPhoto] = useState<string | null>(null);
  const feedFileInputRef = React.useRef<HTMLInputElement | null>(null);`;

if (content.includes(feedStateMarker)) {
  content = content.replace(feedStateMarker, newFeedState.replace(/\n/g, '\r\n'));
} else if (content.includes(feedStateMarkerLF)) {
  content = content.replace(feedStateMarkerLF, newFeedState);
}

// 3. Add photo property to feedPosts type
if (!content.includes('photo?: string;')) {
  content = content.replace(
    "badge?: string;\r\n    quote: string;\r\n    likes: number;",
    "badge?: string;\r\n    quote: string;\r\n    photo?: string;\r\n    likes: number;"
  );
  content = content.replace(
    "badge?: string;\n    quote: string;\n    likes: number;",
    "badge?: string;\n    quote: string;\n    photo?: string;\n    likes: number;"
  );
}

// 4. Update handlePostNote and add handleAttachFeedPhoto
const postNoteMarker = `  // Handle Post Feed Note
  const handlePostNote = () => {
    if (!feedText.trim()) return;
    const newPost = {
      id: 'f_' + Date.now(),
      type: 'note',
      title: 'Priya Sharma left a note',
      time: 'Just now',
      quote: feedText,
      likes: 1,
      comments: 0,
      userLiked: true,
    };
    setFeedPosts([newPost, ...feedPosts]);
    setFeedText('');
    showToast('Love note posted to celebration feed!', 'success');
  };`;

const newPostNote = `  // Handle Feed Photo Attachment
  const handleAttachFeedPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFeedPhoto(reader.result as string);
        showToast('Photo attached to note', 'success');
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Handle Post Feed Note
  const handlePostNote = () => {
    if (!feedText.trim() && !feedPhoto) return;
    const newPost = {
      id: 'f_' + Date.now(),
      type: 'note',
      title: 'Priya Sharma left a note',
      time: 'Just now',
      quote: feedText,
      photo: feedPhoto || undefined,
      likes: 1,
      comments: 0,
      userLiked: true,
    };
    setFeedPosts([newPost, ...feedPosts]);
    setFeedText('');
    setFeedPhoto(null);
    showToast('Love note posted to celebration feed!', 'success');
  };`;

if (content.includes(postNoteMarker.replace(/\n/g, '\r\n'))) {
  content = content.replace(postNoteMarker.replace(/\n/g, '\r\n'), newPostNote.replace(/\n/g, '\r\n'));
} else if (content.includes(postNoteMarker)) {
  content = content.replace(postNoteMarker, newPostNote);
}

// 5. Update Feed Countdown Banner to dynamic real-time value
content = content.replace(
  "29 days : 20 hrs : 34 mins : 12 secs remaining",
  "{countdown.days > 0 ? `${countdown.days} days : ${countdown.hours} hrs : ${countdown.minutes} mins : ${countdown.seconds} secs remaining` : 'Celebration Day & Married'}"
);

// 6. Replace Post Note button area with attach icon + Post Note, and remove Celebration Phase toggle
const oldPostArea = `<div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handlePostNote}
                    className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-lg text-xs shadow-xs cursor-pointer transition-all"
                  >
                    Post Note
                  </button>
                </div>
              </div>

              {/* Celebration Phase Toggle */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                  Celebration Phase:
                </span>
                <div className="flex bg-[#faf8f5] border border-[#ebd3a8] rounded-full p-0.5">
                  <button
                    type="button"
                    onClick={() => setFeedPhase('pre')}
                    className={\`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors \${
                      feedPhase === 'pre'
                        ? 'bg-[#bd9661] text-[#15110e]'
                        : 'text-[#8b7b6b]'
                    }\`}
                  >
                    ⏳ Pre-Wedding
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedPhase('married')}
                    className={\`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors \${
                      feedPhase === 'married'
                        ? 'bg-[#bd9661] text-[#15110e]'
                        : 'text-[#8b7b6b]'
                    }\`}
                  >
                    💍 Married &amp; Honeymoon
                  </button>
                </div>
              </div>`;

const newPostArea = `{/* Attached Photo Thumbnail Preview */}
                {feedPhoto && (
                  <div className="relative inline-block mt-2">
                    <img
                      src={feedPhoto}
                      alt="Attachment preview"
                      className="w-16 h-16 object-cover rounded-xl border-2 border-[#bd9661] shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setFeedPhoto(null)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#15110e] text-[#dfc194] flex items-center justify-center text-[10px] font-bold cursor-pointer shadow-xs"
                      title="Remove attached photo"
                    >
                      &times;
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <input
                    type="file"
                    ref={feedFileInputRef}
                    accept="image/*"
                    onChange={handleAttachFeedPhoto}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => feedFileInputRef.current?.click()}
                    className="w-9 h-9 rounded-lg bg-[#faf8f5] hover:bg-[#f0ede4] text-[#15110e] border border-[#ebd3a8] cursor-pointer shadow-2xs transition-colors flex items-center justify-center text-sm"
                    title="Attach photo"
                  >
                    🔗
                  </button>
                  <button
                    type="button"
                    onClick={handlePostNote}
                    className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-lg text-xs shadow-xs cursor-pointer transition-all"
                  >
                    Post Note
                  </button>
                </div>
              </div>`;

if (content.includes(oldPostArea.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldPostArea.replace(/\n/g, '\r\n'), newPostArea.replace(/\n/g, '\r\n'));
} else if (content.includes(oldPostArea)) {
  content = content.replace(oldPostArea, newPostArea);
}

// 7. Render photo inside feed post card if post has photo
const oldPostQuote = `{post.quote && (
                      <div className="text-xs text-[#6b5849] italic bg-[#faf8f5] p-2.5 rounded-lg border-l-2 border-[#bd9661] leading-relaxed">
                        "{post.quote}"
                      </div>
                    )}`;

const newPostQuote = `{post.quote && (
                      <div className="text-xs text-[#6b5849] italic bg-[#faf8f5] p-2.5 rounded-lg border-l-2 border-[#bd9661] leading-relaxed">
                        "{post.quote}"
                      </div>
                    )}

                    {post.photo && (
                      <div className="rounded-xl overflow-hidden border border-[#e8ded0] mt-1.5">
                        <img src={post.photo} alt="Post attachment" className="w-full max-h-48 object-cover" />
                      </div>
                    )}`;

if (content.includes(oldPostQuote.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldPostQuote.replace(/\n/g, '\r\n'), newPostQuote.replace(/\n/g, '\r\n'));
} else if (content.includes(oldPostQuote)) {
  content = content.replace(oldPostQuote, newPostQuote);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated GuestMobileView.tsx!');
