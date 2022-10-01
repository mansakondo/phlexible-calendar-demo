# frozen_string_literal: true

class EventsReflex < ApplicationReflex
  def update_time(event_id, selected_date, new_time)
    selected_date = Date.parse selected_date
    new_time = Time.parse(new_time, selected_date)

    if event_id.present? && (event = Event.find(event_id))
      if new_time < event.start_time
        time_attribute = event.start_attribute
      else
        time_attribute = event.end_attribute
      end

      event.update(:"#{time_attribute}" => new_time)
    end
  end
end
