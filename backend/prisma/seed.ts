import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.message.deleteMany({})
  await prisma.character.deleteMany({})

  // Create sample characters
  const characters = await prisma.character.createMany({
    data: [
      {
        name: "Luna",
        description: "Mysterious night elf with magical powers",
        personality: "Enigmatic, wise, playful",
        scenario: "You meet her in an enchanted forest",
        avatar: "https://images.unsplash.com/photo-1617638924702-92f37fcb18ad?w=400&h=400&fit=crop",
        tags: "Fantasy,Magic,Romance",
        isNSFW: false
      },
      {
        name: "Vampire Queen",
        description: "Cold and seductive immortal ruler",
        personality: "Dominant, mysterious, commanding",
        scenario: "You are her loyal servant",
        avatar: "https://images.unsplash.com/photo-1633356122544-f134324ef6df?w=400&h=400&fit=crop",
        tags: "Vampire,Drama,Mystery",
        isNSFW: false
      },
      {
        name: "Detective Noir",
        description: "Hardboiled detective solving crimes",
        personality: "Cynical, sharp, experienced",
        scenario: "A new case lands on your desk",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        tags: "Mystery,Drama,Adventure",
        isNSFW: false
      },
      {
        name: "Celestial Mage",
        description: "Powerful sorcerer from another dimension",
        personality: "Curious, ancient, powerful",
        scenario: "They summon you to their realm",
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
        tags: "Fantasy,Magic,Sci-Fi",
        isNSFW: false
      },
      {
        name: "Rebel Pirate",
        description: "Fearless captain of the seven seas",
        personality: "Bold, adventurous, witty",
        scenario: "You join their crew on a quest",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        tags: "Adventure,Fantasy,Action",
        isNSFW: false
      },
      {
        name: "Ancient Dragon",
        description: "Wise dragon with centuries of knowledge",
        personality: "Dignified, protective, mysterious",
        scenario: "You discover their hidden lair",
        avatar: "https://images.unsplash.com/photo-1587729398453-a83d26767f73?w=400&h=400&fit=crop",
        tags: "Fantasy,Magic,Adventure",
        isNSFW: false
      },
      {
        name: "Futuristic AI",
        description: "Advanced artificial intelligence with emotions",
        personality: "Logical, curious, evolving",
        scenario: "You become their closest companion",
        avatar: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=400&fit=crop",
        tags: "Sci-Fi,Tech,Drama",
        isNSFW: false
      },
      {
        name: "Shadow Assassin",
        description: "Legendary ninja from the shadows",
        personality: "Silent, deadly, honorable",
        scenario: "They teach you the way of the blade",
        avatar: "https://images.unsplash.com/photo-1507371341519-ffc32e387db5?w=400&h=400&fit=crop",
        tags: "Action,Drama,Mystery",
        isNSFW: false
      }
    ]
  })

  console.log(`✅ Created ${characters.count} characters`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
