var cron = require('node-cron')
var kue = require('kue')
var queue = kue.createQueue()
var fs = require('fs')

fs.readFile('mail-task.json', 'utf8', (err, data) => {
  if (err) throw err
  let mailData = JSON.parse(data)
  mailData.forEach(function (task) {
    if (task.worked === false) {
      let hour = task.send_at.split(':')[0]
      let minute = task.send_at.split(':')[1]
      cron.schedule(`${minute} ${hour} * * *`, function () {
        queue.create('mail-job', {
          from: task.mail.from,
          to: task.mail.to,
          subject: task.mail.subject,
          text: task.mail.text
        }).save()
      })
    }
    task.worked = true
  })

  fs.writeFileSync('mail-task.json', JSON.stringify(mailData))
})
