var mailgun = require('mailgun-js')({apiKey: 'key-65deed3c8cf71d6e4e45fc74ad8a4ada', domain: 'sandboxe8501bee061846c68a8c47ad8a60aebf.mailgun.org'})
var kue = require('kue')
var queue = kue.createQueue()

queue.process('mail-job', function (job, done) {
  let data = {
    from: job.data.from,
    to: job.data.to,
    subject: job.data.subject,
    text: job.data.text
  }
  mailgun.messages().send(data, function (error, body) {
    if (error) {
      console.log(error)
    }
    console.log(`Email has been sent to ${job.data.to}`)
    done()
  })
})
