const ws = require('ws')
class Client {
    constructor(url, auth = 'changeme') {
        this.url = url;
        this.auth = auth
        this.wscl = new ws(url, {
            headers: {
                authorization: `Bearer ${auth}`
            }
        })
    }

    connect() {
        const wss = this.wscl

        wss.on('open', () => {
            console.log(`Connected to ${this.url}`)
            const readline = require('node:readline').createInterface({
                input: process.stdin,
                output: process.stdout,
            })
            let lastMessage;
            wss.on('message', (data) => {
                const dt = JSON.parse(data.toString())
                if(!dt.output) return;
                process.stdout.clearLine();
                process.stdout.write(dt.output)
                let thisMessage = new Date().getDate();
                lastMessage = thisMessage;
                readline.question(`${dt.user}@${dt.path}$ `, (cmd) => {
                    if(lastMessage !== thisMessage) return;
                    process.stdout.clearLine();
                    process.stdout.write(`${dt.user}@${dt.path}$ `)
                    wss.send(cmd)
                })
            })
        })
        wss.on('error', (err) => { throw new Error(err) })
        wss.on('close', (code, reason) => console.log(`Connected closed with code: ${code} and reason: ${reason}`))
    }
}

module.exports = Client