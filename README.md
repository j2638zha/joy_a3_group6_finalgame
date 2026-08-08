# A3_Group6_FINAL GAME

# Description

The game places players in the role of a penguin descending a snowy mountain while navigating the uncertainty associated with low vision, now represented through a directional flashlight that only illuminates the area directly ahead of the penguin. This narrow cone of sight shifts with movement, requiring players to rely on careful steering, memory, and audio cues to progress. As players advance through Levels 2 and 3, new hazards emerge: holes that the penguin can fall into and must escape by pressing Enter repeatedly, and fast‑moving mountain goats in Level 3 that instantly end the run upon collision. The experience is framed by illustrated story panels showing the penguin beginning its journey down the mountain, while a proximity‑based volume system adjusts audio intensity as hazards approach, reinforcing the low‑vision theme through multimodal feedback. Together, these mechanics create a tense, immersive experience where players must navigate partial information, unpredictable dangers, and time pressure.

# Setup and Interaction Instructions

Players begin by selecting Start, which triggers the opening story panels before loading Level 1. Movement uses WASD controls, with W moving forward, A and D turning, and S allowing backward movement. Visibility is restricted to a softened flashlight cone that illuminates only the direction the penguin faces, requiring deliberate navigation along the narrow mountain path. In later levels, players must avoid holes that cause the penguin to fall and can only be escaped by pressing Enter several times, and in Level 3, watch for goats that sprint unpredictably across the path and instantly kill the penguin. A proximity‑based volume system increases audio intensity as hazards draw near, helping players anticipate danger despite limited sight. The game ends when the player reaches the bottom or is defeated by time, a goat, or falling hazards, after which they may retry or return to the home screen.

# Iteration Notes

**Post-Playtest:** 3 changes made based on playtesting:
After playtesting, we implemented three major refinements to improve clarity, immersion, and accessibility. First, we added illustrated story panels to introduce the penguin’s descent and provide narrative context before gameplay begins. Second, we integrated a proximity‑based volume system that adjusts audio intensity based on distance to hazards, giving players additional sensory feedback to compensate for restricted visibility. Third, we refined the directional flashlight by making its animation less harsh, softening the edges and smoothing transitions to reduce visual strain while maintaining the challenge of limited sight. These updates strengthened the game’s atmosphere, improved accessibility, and created a more intuitive and polished player experience.

**Changes after Final Showcase**

- No "Im Here" sound after collecting Miss Shelby during stomp
- Added finish line at the top of the level for clear end affordance
- Changed fish collected card from "Get to the safety zone" to "get to the bottom of the mountain"
- Added missing loading screen between level 2 and level 3
- Removed level 3 goat crossing card (kept the sign) to reduce repeating information
- Add and tweak the button sound to the lose screen

# Assets

| File                                           | Source                                                 |
| ---------------------------------------------- | ------------------------------------------------------ |
| `assets/images/bigger_box.png`                 | Box card tutorial UI asset – ChatGPT.com               |
| `assets/images/w_key_penguin.png`              | Penguin W Key - ChatGPT.com                            |
| `assets/images/d_key_penguin.png`              | Penguin D Key - ChatGPT.com                            |
| `assets/images/a_key_penguin.png`              | Penguin A Key - ChatGPT.com                            |
| `assets/images/s_key_penguin.png`              | Penguin S Key - ChatGPT.com                            |
| `assets/images/tutorial_background.png`        | Tutorial background screen asset – ChatGPT.com         |
| `assets/images/fish_item.png`                  | Fish sprite sheet - ChatGPT.com                        |
| `assets/images/fish_outline.png`               | Fish sprite sheet - ChatGPT.com                        |
| `assets/images/spike_tall.png`                 | Spike obstacle asset – ChatGPT.com                     |
| `assets/fonts/jersey10.ttf`                    | Jersey10-Regular - Google Fonts.com [1]                |
| `assets/images/check_icon.png`                 | Iterated game assets - ChatGPT.com                     |
| `assets/images/fish.png`                       | Fish sprite sheet - ChatGPT.com                        |
| `assets/images/goat_spritesheet.png`           | Goat sprite sheet - ChatGPT.com                        |
| `assets/images/golden_star.png`                | Iterated game assets - ChatGPT.com                     |
| `assets/images/level_picker.JPG`               | Iterated game assets - ChatGPT.com                     |
| `assets/images/lock_icon.png`                  | Iterated game assets - ChatGPT.com                     |
| `assets/images/loss_screen.png`                | Screens, spike and penguin sprite sheets - ChatGPT.com |
| `assets/images/penguin_stomp.png`              | Screens, spike and penguin sprite sheets - ChatGPT.com |
| `assets/images/spike_double.png`               | Screens, spike and penguin sprite sheets - ChatGPT.com |
| `assets/images/spike_mid.png`                  | Screens, spike and penguin sprite sheets - ChatGPT.com |
| `assets/images/spike_small.png`                | Screens, spike and penguin sprite sheets - ChatGPT.com |
| `assets/images/star_outline.png`               | Iterated game assets - ChatGPT.com                     |
| `assets/images/penguin_front.png`              | Screens, spike and penguin sprite sheets - ChatGPT.com |
| `assets/images/win_screen.png`                 | Screens, spike and penguin sprite sheets - ChatGPT.com |
| `assets/images/avalanche_card.png`             | Card Assets - ChatGPT.com                              |
| `assets/images/avalanche_card2.png`            | Card Assets - ChatGPT.com                              |
| `assets/images/avalanche_card3.png`            | Card Assets - ChatGPT.com                              |
| `assets/images/crevices_card.png`              | Card Assets - ChatGPT.com                              |
| `assets/images/Foundpopup_card.png`            | Card Assets - ChatGPT.com                              |
| `assets/images/stopsign_card.png`              | Card Assets - ChatGPT.com                              |
| `assets/images/hurry_card.png`                 | Card Assets - ChatGPT.com                              |
| `assets/images/instruction_direction_card.png` | Card Assets - ChatGPT.com                              |
| `assets/images/pop_up_card.png`                | Card Assets - ChatGPT.com                              |
| `assets/images/space_dialoguecard.png`         | Card Assets - ChatGPT.com                              |
| `assets/images/title_screen.png`               | Title Screen - ChatGPT.com                             |
| `assets/images/transition_page.png`            | Transition Screen - ChatGPT.com                        |
| `assets/videos/goat_death.mp4`                 | Transition Video - ChatGPT.com                         |
| `assets/videos/crevice_death.mp4`              | Transition Video - ChatGPT.com                         |
| `assets/videos/time_death.mp4`                 | Transition Video - ChatGPT.com                         |
| `assets/images/crevice.png`                    | Crevice image - ChatGPT.com                            |
| `assets/images/aw_key_penguin.png`             | Manually customized – Generated on ChatGPT.com         |
| `assets/images/wd_key_penguin.png`             | Manually customized – Generated on ChatGPT.com         |
| `assets/images/as_key_penguin.png`             | Manually customized – Generated on ChatGPT.com         |
| `assets/images/sd_key_penguin.png`             | Manually customized – Generated on ChatGPT.com         |
| `assets/images/enter_button_sprite.png`        | Manually customized – Generated on ChatGPT.com         |
| `assets/images/lock_break.png`                 | Manually customized – Generated on ChatGPT.com         |
| `assets/images/penguin_climb.png`              | Manually customized – Generated on ChatGPT.com         |
| `assets/images/penguin_falling.png`            | Manually customized – Generated on ChatGPT.com         |
| `assets/images/penguin_icon.png`               | Cropped from asset – Generated on ChatGPT.com          |
| `assets/images/test_fish.png`                  | Generated on ChatGPT.com                               |
| `assets/images/how_to_play_button.png`         | Generated with ChatGPT.com                             |
| `assets/images/level_info_box.png`             | Generated with ChatGPT.com                             |
| `assets/images/level2_background.png`          | Generated with ChatGPT.com                             |
| `assets/images/level3_background.png`          | Generated with ChatGPT.com                             |
| `assets/images/settings_button.png`            | Generated with ChatGPT.com                             |
| `assets/story_panel_1.png`                     | Generated with ChatGPT.com                             |
| `assets/story_panel_2.png`                     | Generated with ChatGPT.com                             |
| `assets/story_panel_3.png`                     | Generated with ChatGPT.com                             |
| `assets/story_panel_4.png`                     | Generated with ChatGPT.com                             |
| `assets/win_screen_story_panel_1.png`          | Generated with ChatGPT.com                             |
| `assets/win_screen_story_panel_2.png`          | Generated with ChatGPT.com                             |
| `assets/win_screen_story_panel_3.png`          | Generated with ChatGPT.com                             |
| `assets/win_screen_story_panel_4.png`          | Generated with ChatGPT.com                             |
| `assets/sound/button_1.mp3`                    | floraphonic - Pixabay.com [2]                          |
| `assets/sound/button_2.mp3`                    | Leszek_Szary (freesound_community) - Pixabay.com [3]   |
| `assets/sound/lock_button.mp3`                 | Mendenhall02 (freesound_community) - Pixabay.com [4]   |
| `assets/sound/levelpicker_background.mp3`      | HauntSync - Pixabay.com [5]                            |
| `assets/sound/Story_Audio_But_Why.mp3`         | @midjourney.image – TikTok [6]                         |
| `assets/sound/StoryAudio.mp3`                  | @midjourney.image – TikTok [6]                         |
| `assets/sound/win_screen_story_audio.mp3`      | nojisuma – Pixabay.com [7]                             |
| `assets/sound/unlock_sound.mp3`                | Vadim_Makes_Sound – Pixabay.com [8]                    |
| `assets/sound/fish_collect_sound.mp3`          | Liecio – Pixabay.com [9]                               |
| `assets/sound/penguin_stomping_sound.mp3`      | daboy291 (freesound_community) – Pixabay.com [10]      |
| `assets/sound/penguin_walking_sound.mp3`       | Abdalrahman_bm – Pixabay.com [11]                      |
| `assets/sound/stomping_aura.mp3`               | Lolo_s – Pixabay.com [12]                              |
| `assets/sound/game_background_music.mp3`       | AstroGalaxyMoon – Pixabay.com [13]                     |
| `assets/sound/win_screen_sound.mp3`            | PeekabooLabCreative – Pixabay.com [14]                 |
| `assets/sound/lose_screen_sound.mp3`           | Make_More_Sound – Pixabay.com [15]                     |
| `assets/sound/introscreen.mp3`                 | DJARTMUSIC – Pixabay.com [16]                          |

# References

[1]N/A. 2026. Jersey 10 - Google Fonts. Google Fonts. Retrieved July 8, 2026 from https://fonts.google.com/specimen/Jersey+10?query=pixel&preview.script=Latn

[2]floraphonic. 2024. Multi Pop 2 | Royalty-free Music. Pixabay.com. Retrieved August 6, 2026 from https://pixabay.com/sound-effects/film-special-effects-multi-pop-2-188167/

[3]Leszek_Szary freesound_community. 2022. menu button | Royalty-free Music. Pixabay.com. Retrieved August 6, 2026 from https://pixabay.com/sound-effects/film-special-effects-menu-button-89141/

[4]Mendenhall02 freesound_community. 2022. Denied sound | Royalty-free Music. Pixabay.com. Retrieved August 6, 2026 from https://pixabay.com/sound-effects/film-special-effects-denied-sound-39708/

[5]HauntSync. 2026. Whiteout Valley - Blizzard Ambient Loop with Howling Hillside Winds | Royalty-free Music. Pixabay.com. Retrieved August 7, 2026 from https://pixabay.com/sound-effects/nature-whiteout-valley-blizzard-ambient-loop-with-howling-hillside-winds-563822/

[6]@midjourney.image. N/A. TikTok video. TikTok. Retrieved August 7, 2026 from https://vt.tiktok.com/ZS4qy2Lyu/

[7]nojisuma. 2024. 風と大地Wind_and_Land | Royalty-free Music. Pixabay.com. Retrieved August 7, 2026 from https://pixabay.com/music/beats-%E9%A2%A8%E3%81%A8%E5%A4%A7%E5%9C%B0wind-and-land-270921/

[8]Vadim_Makes_Sound. 2026. Achievement Badge Pop Sound #2 | Royalty-free Music. Pixabay.com. Retrieved August 7, 2026 from https://pixabay.com/sound-effects/film-special-effects-achievement-badge-pop-sound-2-547865/

[9]Liecio. 2024. Collect Points | Royalty-free Music. Pixabay.com. Retrieved August 7, 2026 from https://pixabay.com/sound-effects/film-special-effects-collect-points-190037/

[10]daboy291 freesound_community. 2022. stomping_footsteps_flat_shoes_tile_floor | Royalty-free Music. Pixabay.com. Retrieved August 7, 2026 from https://pixabay.com/sound-effects/household-stomping-footsteps-flat-shoes-tile-floor-107004/

[11]Abdalrahman_bm. 2025. 8-bit gravel footsteps 1 | Royalty-free Music. Pixabay.com. Retrieved August 7, 2026 from https://pixabay.com/sound-effects/film-special-effects-8-bit-gravel-footsteps-1-408582/

[12]Lolo_s. 2026. Aura | Royalty-free Music. Pixabay.com. Retrieved August 7, 2026 from https://pixabay.com/sound-effects/technology-aura-474086/

[13]AstroGalaxyMoon. 2025. Princess Frostine Theme (Bubble Bob 1995) | Royalty-free Music. Pixabay.com. Retrieved August 7, 2026 from https://pixabay.com/music/video-games-princess-frostine-theme-bubble-bob-1995-392937/

[14]PeekabooLabCreative. 2025. 11L-Victory_sound_with_t-1749487402950 | Royalty-free Music. Pixabay.com. Retrieved August 7, 2026 from https://pixabay.com/sound-effects/film-special-effects-11l-victory-sound-with-t-1749487402950-357606/

[15]Make_More_Sound. 2023. 8 Bit Video Game Fail - version 2 | Royalty-free Music. Pixabay.com. Retrieved August 7, 2026 from https://pixabay.com/sound-effects/film-special-effects-8-bit-video-game-fail-version-2-145478/

[16]DJARTMUSIC. 2025. The World Of 8-bit Games | Royalty-free Music. Pixabay.com. Retrieved August 7, 2026 from https://pixabay.com/music/video-games-the-world-of-8-bit-games-301273/
