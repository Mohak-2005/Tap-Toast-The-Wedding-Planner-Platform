with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

old_link = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap'
new_link = 'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cinzel:wght@400..800&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Great+Vibes&family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:ital,wght@0,300..800;1,300..800&family=Parisienne&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Prata&display=swap'

if old_link in text:
    text = text.replace(old_link, new_link)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated index.html successfully')
else:
    print('old_link not found in index.html')
