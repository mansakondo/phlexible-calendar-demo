import ApplicationController from './application_controller'

export default class extends ApplicationController {
  static targets = ["eventSlot"]

  connect () {
    super.connect()
  }

  startResize(event) {
    event.preventDefault()
    const target = event.target.closest("[data-event-id]")
    const { date, eventId } = target.dataset

    this.selectedDate = date
    this.selectedEvent = target
    this.resizeEvent = this.resizeEvent.bind(this)

    this.eventSlotTargets.forEach((eventSlotTarget) => {
      eventSlotTarget.addEventListener("mouseover", this.resizeEvent)
    })
  }

  resizeEvent(event) {
    const { time } = event.target.dataset
    if (!time) {
      event.preventDefault()
      return
    }

    const selectedEventId = this.selectedEvent.dataset.eventId

    this.stimulate("Events#resize", selectedEventId, this.selectedDate, time)
  }

  stopResize() {
    this.eventSlotTargets.forEach((eventSlotTarget) => {
      eventSlotTarget.removeEventListener("mouseover", this.resizeEvent)
    })
  }

  startDrag(event) {
    this.stopResize()
    event.dataTransfer.setData("text/plain", event.target.dataset.eventId)
  }

  setDropEffect(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  drop(event) {
    this.stopResize()
    const event_id = event.dataTransfer.getData("text/plain")
    const { date, time } = event.target.dataset

    this.stimulate("Events#drop", event_id, date, time)
  }
}
