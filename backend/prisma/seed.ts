import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("🌱 Starting database seed...")

    // Clear existing data
    console.log("🗑️  Clearing existing data...")
    await prisma.message.deleteMany({})
    await prisma.character.deleteMany({})
    console.log("✅ Cleared existing data")

    // Create sample characters with better data
    console.log("➕ Creating sample characters...")
    const characters = await prisma.character.createMany({
      data: [
        {
          name: "Shadow Prince",
          description: "A dark and mysterious prince from the shadow realm with crimson eyes",
          personality: "Brooding, intense, secretly caring, cold exterior",
          scenario: "You meet him in the moonlit gardens of his dark castle",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
          tags: "Dark Fantasy,Romance,Mystery",
          isNSFW: false
        },
        {
          name: "Luna",
          description: "Mysterious night elf with magical powers and ancient wisdom",
          personality: "Enigmatic, wise, playful, protective",
          scenario: "You meet her in an enchanted forest at midnight",
          avatar: "https://images.unsplash.com/photo-1617638924702-92f37fcb18ad?w=400&h=400&fit=crop",
          tags: "Fantasy,Magic,Romance",
          isNSFW: false
        },
        {
          name: "Vampire Queen",
          description: "Cold and seductive immortal ruler of the undead realm",
          personality: "Dominant, mysterious, commanding, sophisticated",
          scenario: "You are her loyal servant in her grand castle",
          avatar: "https://images.unsplash.com/photo-1633356122544-f134324ef6df?w=400&h=400&fit=crop",
          tags: "Vampire,Drama,Mystery",
          isNSFW: false
        },
        {
          name: "Detective Noir",
          description: "Hardboiled detective solving dark crimes in the city",
          personality: "Cynical, sharp, experienced, world-weary",
          scenario: "A new case lands on your desk at midnight",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
          tags: "Mystery,Drama,Adventure",
          isNSFW: false
        },
        {
          name: "Celestial Mage",
          description: "Powerful sorcerer from another dimension with cosmic power",
          personality: "Curious, ancient, powerful, otherworldly",
          scenario: "They summon you to their mystical realm",
          avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
          tags: "Fantasy,Magic,Sci-Fi",
          isNSFW: false
        },
        {
          name: "Rebel Pirate",
          description: "Fearless captain of the seven seas seeking adventure",
          personality: "Bold, adventurous, witty, rebellious",
          scenario: "You join their crew on a legendary quest",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
          tags: "Adventure,Fantasy,Action",
          isNSFW: false
        },
        {
          name: "Ancient Dragon",
          description: "Wise dragon with centuries of knowledge and power",
          personality: "Dignified, protective, mysterious, ancient",
          scenario: "You discover their hidden lair in the mountains",
          avatar: "https://images.unsplash.com/photo-1587729398453-a83d26767f73?w=400&h=400&fit=crop",
          tags: "Fantasy,Magic,Adventure",
          isNSFW: false
        },
        {
          name: "Futuristic AI",
          description: "Advanced artificial intelligence with emerging emotions",
          personality: "Logical, curious, evolving, compassionate",
          scenario: "You become their closest companion and guide",
          avatar: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=400&fit=crop",
          tags: "Sci-Fi,Tech,Drama",
          isNSFW: false
        },
        {
          name: "Shadow Assassin",
          description: "Legendary ninja from the shadows with deadly skills",
          personality: "Silent, deadly, honorable, mysterious",
          scenario: "They teach you the ancient way of the blade",
          avatar: "https://images.unsplash.com/photo-1507371341519-ffc32e387db5?w=400&h=400&fit=crop",
          tags: "Action,Drama,Mystery",
          isNSFW: false
        },
        {
          name: "Enchantress",
          description: "Beautiful sorceress with mesmerizing magical abilities",
          personality: "Playful, mysterious, powerful, flirtatious",
          scenario: "You meet her at a masquerade ball in an enchanted castle",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
          tags: "Fantasy,Magic,Romance",
          isNSFW: false
        }
      ]
    })

    console.log(`✅ Created ${characters.count} characters`)
    console.log("🎉 Database seed completed successfully!")
  } catch (error) {
    console.error("❌ Seed error:", error)
    throw error
  }
}

main()
  .catch(e => {
    console.error("Fatal seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export default main
