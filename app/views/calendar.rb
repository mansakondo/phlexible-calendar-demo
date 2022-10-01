module Views
  class Calendar < PhlexibleCalendar::Views::Calendar
    def template(&block)
      div class: "flex justify-center", data: { controller: "events", action: "mouseup->events#stopResize"} do
        div class: "flex flex-col" do
          div class: "flex ml-16 py-8"do
            date_range.slice(0, 7).each do |day|
              span class: "text-md text-center text-gray-600 w-[160px]" do
                t("date.abbr_day_names")[day.wday]
              end
            end
          end

          div class: "overflow-auto h-[540px]" do
            div class: "flex" do
              div class: "flex flex-col w-16" do
                HOURS.each_with_index do |hour, i|
                  div class: "relative h-14" do
                    span class: "absolute bottom-12 text-xs text-gray-600" do
                      hour
                    end
                  end
                end
              end

              date_range.slice(0, 7).each do |day|
                div class: "relative flex flex-col w-[160px]" do
                  times_for_quarter_hours(day).each_slice(4) do |times|
                    div class: "relative h-14 border" do
                      times.each_with_index do |time, i|
                        div class: "w-full", style: "height: 25%; top: #{25*i}%;", data: { events_date_param: time.to_date, events_target: "eventSlot", time: time.strftime("%H:%M:%S %Z") } do
                          if block_given?
                            block.call sorted_events.fetch(time, [])
                          else
                            sorted_events.fetch(time, []).each_with_index do |event, i|
                              div id: event.send(start_attribute), class: "absolute flex justify-center items-center w-full bg-gray-900 text-white text-xs rounded", style: "height: #{event.height_in_percentage}%; width: calc(100% - #{(i) * 10}px); z-index: #{i+1};#{(" border: groove" if i > 0)}", draggable: true, data: { events_date_param: time.to_date, time: event.send(start_attribute).strftime("%H:%M:%S %Z"), event_id: event.id, action: "mousedown->events#startResize" } do
                                span do
                                  event.name
                                end
                              end
                            end
                          end
                        end
                      end
                    end
                  end
                end
              end
            end
          end

          div class: "flex justify-around items-center mt-4" do
            a href: url_for_previous_view, class: "flex justify-center items-center h-10 w-10 bg-gray-900 text-white rounded-full " do
              t("simple_calendar.previous", default: "<")
            end

            a href: url_for_next_view, class: "flex justify-center items-center h-10 w-10 bg-gray-900 text-white rounded-full " do
              t("simple_calendar.next", default: ">")
            end
          end
        end
      end
    end
  end
end
