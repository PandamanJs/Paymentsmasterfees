/**
 * 3D Touch / Force Touch Demo Component
 * Showcases all force touch capabilities
 * For development and testing purposes
 */

import { useState } from "react";
import { motion } from "motion/react";
import { 
  ForceTouchWrapper, 
  ForceTouchMenu, 
  PeekPop, 
  supportsForceTouchAPI 
} from "../utils/force-touch";
import { Trash2, Share2, Edit2, Heart, Star } from "lucide-react";
import { haptics } from "../utils/haptics";

export default function ForceTouchDemo() {
  const [likeCount, setLikeCount] = useState(42);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-3xl text-[#003630]">
            3D Touch Demo
          </h1>
          <p className="text-[#6b7280] text-sm">
            {supportsForceTouchAPI() 
              ? "✓ Your device supports 3D Touch" 
              : "⚠️ 3D Touch not available (will use fallback)"}
          </p>
        </motion.div>

        {/* Demo Cards */}
        <div className="space-y-6">
          {/* 1. Basic Force Touch with Visual Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-lg text-[#003630] mb-4">
              1. Basic Deep Press
            </h2>
            <p className="text-sm text-[#6b7280] mb-4">
              Press hard on the button to trigger haptic feedback and visual response
            </p>
            <div className="flex justify-center">
              <ForceTouchWrapper
                onDeepPress={() => {
                  haptics.success();
                  alert("Deep press detected! 🎉");
                }}
                threshold={0.75}
                showIndicator={true}
              >
                <button className="px-8 py-4 bg-[#95e36c] text-[#003630] rounded-xl font-semibold shadow-md active:shadow-sm transition-all">
                  Press Hard
                </button>
              </ForceTouchWrapper>
            </div>
          </motion.div>

          {/* 2. Context Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-lg text-[#003630] mb-4">
              2. Context Menu (Like iOS)
            </h2>
            <p className="text-sm text-[#6b7280] mb-4">
              Press hard to reveal a context menu with quick actions
            </p>
            <div className="flex justify-center">
              <ForceTouchMenu
                menuItems={[
                  {
                    label: "Edit",
                    icon: <Edit2 size={18} />,
                    onClick: () => {
                      haptics.selection();
                      alert("Edit selected");
                    }
                  },
                  {
                    label: "Share",
                    icon: <Share2 size={18} />,
                    onClick: () => {
                      haptics.selection();
                      alert("Share selected");
                    }
                  },
                  {
                    label: "Delete",
                    icon: <Trash2 size={18} />,
                    onClick: () => {
                      haptics.delete();
                      alert("Delete selected");
                    },
                    destructive: true
                  }
                ]}
                threshold={0.7}
              >
                <div className="bg-gradient-to-r from-[#95e36c] to-[#7dd054] px-8 py-12 rounded-2xl shadow-lg cursor-pointer">
                  <p className="text-center text-white font-semibold text-lg">
                    Press & Hold
                  </p>
                  <p className="text-center text-white/80 text-sm mt-2">
                    Context menu will appear
                  </p>
                </div>
              </ForceTouchMenu>
            </div>
          </motion.div>

          {/* 3. Peek & Pop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-lg text-[#003630] mb-4">
              3. Peek & Pop (Preview)
            </h2>
            <p className="text-sm text-[#6b7280] mb-4">
              Light press to peek, press harder to pop (open)
            </p>
            <div className="flex justify-center">
              <PeekPop
                previewContent={
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[#003630]">Article Preview</h3>
                    <p className="text-sm text-[#6b7280] leading-relaxed">
                      This is a preview of the content. Press deeper to open the full article.
                      The preview shows you a glimpse without committing to navigation.
                    </p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-[#95e36c]/20 text-[#003630] rounded-full text-xs">
                        Tech
                      </span>
                      <span className="px-3 py-1 bg-[#95e36c]/20 text-[#003630] rounded-full text-xs">
                        Mobile
                      </span>
                    </div>
                  </div>
                }
                onPop={() => {
                  haptics.success();
                  alert("Popped! Full article opened 📖");
                }}
                peekThreshold={0.5}
                popThreshold={0.9}
              >
                <div className="bg-[#003630] px-8 py-12 rounded-2xl shadow-lg cursor-pointer">
                  <p className="text-center text-white font-semibold text-lg">
                    Peek at Article
                  </p>
                  <p className="text-center text-white/80 text-sm mt-2">
                    Light press = Preview | Deep press = Open
                  </p>
                </div>
              </PeekPop>
            </div>
          </motion.div>

          {/* 4. Like Button with Force Touch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-lg text-[#003630] mb-4">
              4. Interactive Like Button
            </h2>
            <p className="text-sm text-[#6b7280] mb-4">
              Tap to like, press hard for "super like" (adds +5)
            </p>
            <div className="flex justify-center">
              <ForceTouchWrapper
                onDeepPress={() => {
                  haptics.success();
                  setLikeCount(prev => prev + 5);
                  setIsLiked(true);
                }}
                threshold={0.75}
                showIndicator={true}
              >
                <button
                  onClick={() => {
                    haptics.selection();
                    if (isLiked) {
                      setLikeCount(prev => prev - 1);
                      setIsLiked(false);
                    } else {
                      setLikeCount(prev => prev + 1);
                      setIsLiked(true);
                    }
                  }}
                  className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold shadow-md transition-all ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Heart 
                    size={24} 
                    fill={isLiked ? "currentColor" : "none"} 
                  />
                  <span>{likeCount}</span>
                </button>
              </ForceTouchWrapper>
            </div>
            <p className="text-center text-xs text-[#95e36c] mt-3 font-medium">
              💡 Tap = +1 | Force Press = +5
            </p>
          </motion.div>

          {/* 5. Star Rating with Force Touch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-lg text-[#003630] mb-4">
              5. Quick Actions Grid
            </h2>
            <p className="text-sm text-[#6b7280] mb-4">
              Each card supports 3D Touch for quick actions
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Photos", icon: "📷", color: "from-blue-400 to-blue-600" },
                { label: "Music", icon: "🎵", color: "from-purple-400 to-purple-600" },
                { label: "Messages", icon: "💬", color: "from-green-400 to-green-600" },
                { label: "Calendar", icon: "📅", color: "from-orange-400 to-orange-600" }
              ].map((app, index) => (
                <ForceTouchMenu
                  key={index}
                  menuItems={[
                    {
                      label: `Open ${app.label}`,
                      onClick: () => {
                        haptics.selection();
                        alert(`Opening ${app.label}`);
                      }
                    },
                    {
                      label: "Add to Favorites",
                      icon: <Star size={18} />,
                      onClick: () => {
                        haptics.selection();
                        alert("Added to favorites");
                      }
                    }
                  ]}
                >
                  <div 
                    className={`bg-gradient-to-br ${app.color} p-6 rounded-2xl shadow-md cursor-pointer flex flex-col items-center gap-2`}
                  >
                    <span className="text-4xl">{app.icon}</span>
                    <span className="text-white font-semibold text-sm">{app.label}</span>
                  </div>
                </ForceTouchMenu>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-[#003630]/5 backdrop-blur-sm rounded-2xl p-6"
        >
          <h3 className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[#003630] mb-3">
            💡 How to Use
          </h3>
          <ul className="space-y-2 text-sm text-[#6b7280]">
            <li>• <strong>Light Touch:</strong> Normal interaction</li>
            <li>• <strong>Medium Press:</strong> Triggers peek preview (~50% force)</li>
            <li>• <strong>Hard Press:</strong> Triggers deep press action (~75% force)</li>
            <li>• <strong>Very Hard Press:</strong> Triggers pop/commit (~90% force)</li>
            <li>• <strong>Visual Feedback:</strong> Green dot indicates 3D Touch enabled</li>
            <li>• <strong>Haptic Feedback:</strong> Feel vibrations on supported devices</li>
          </ul>
        </motion.div>

        {/* Browser Compatibility */}
        <div className="text-center text-xs text-[#6b7280] space-y-1">
          <p>Best experienced on iPhone 6s or later (iOS Safari)</p>
          <p>Fallback interactions work on all touch devices</p>
        </div>
      </div>
    </div>
  );
}
