
async function testChat() {
    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: "je veux créer une automatisation",
            nodes: []
        })
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

testChat();
