'use server'


export type ProjectSubmission = {
    userName: string
    selectedInterests: string[]
    initialPrompt: string
    chatHistory: Array<{ role: 'ai' | 'user'; content: string }>
    contactEmail?: string
}

export async function submitProjectRequest(data: ProjectSubmission) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log('--- NEW PROJECT REQUEST RECEIVED ---')
    console.log('User:', data.userName)
    console.log('Interests:', data.selectedInterests)
    console.log('Prompt:', data.initialPrompt)
    console.log('Contact:', data.contactEmail)
    console.log('History:', JSON.stringify(data.chatHistory, null, 2))
    console.log('------------------------------------')

    // TODO: Integrate with Database (Supabase, Prisma, etc.)
    // Example: 
    // await db.project.create({ data: { ... } })

    return { success: true, message: "Project received successfully" }
}
