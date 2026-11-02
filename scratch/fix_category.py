with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = "const [cardCategory, setCardCategory] = useState<'Botanical' | 'Midnight' | 'Coastal' | 'Vineyard' | 'Architectural' | 'Modern'>('Midnight');"
replacement = "const [cardCategory, setCardCategory] = useState<CustomCardTemplate['category']>('Botanical');"

if target in text:
    text = text.replace(target, replacement)
    with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated cardCategory useState successfully')
else:
    print('target not found')
