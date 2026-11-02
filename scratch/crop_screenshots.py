from PIL import Image
import os

artifacts_dir = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

# 1. Initial 3 themes with "Show More Themes" button
img1 = Image.open(os.path.join(artifacts_dir, "verify_req2_initial_3_themes.png"))
# We want to crop from Bespoke Invitations heading down past the Show More button
crop1 = img1.crop((160, 480, 1240, 895))
crop1.save(os.path.join(artifacts_dir, "req2_initial_3_themes_cropped.png"))
print("Saved req2_initial_3_themes_cropped.png")

# 2. Expanded themes: all 5 themes + blank card + "Show Less Themes" button
img2 = Image.open(os.path.join(artifacts_dir, "verify_req2_expanded_all_themes.png"))
crop2 = img2.crop((160, 480, 1240, 900))
crop2.save(os.path.join(artifacts_dir, "req2_expanded_all_themes_cropped.png"))
print("Saved req2_expanded_all_themes_cropped.png")

# 3. Canvas element with 8 handles (4 corners + 4 edge midpoints)
img3 = Image.open(os.path.join(artifacts_dir, "verify_req1_selected_8_handles.png"))
crop3 = img3.crop((440, 120, 960, 680))
crop3.save(os.path.join(artifacts_dir, "req1_selected_8_handles_cropped.png"))
print("Saved req1_selected_8_handles_cropped.png")

# 4. Canvas element expanded horizontally and vertically
img4 = Image.open(os.path.join(artifacts_dir, "verify_req1_horizontal_vertical_expanded.png"))
crop4 = img4.crop((440, 120, 960, 680))
crop4.save(os.path.join(artifacts_dir, "req1_resized_expanded_cropped.png"))
print("Saved req1_resized_expanded_cropped.png")
