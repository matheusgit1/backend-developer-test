import {
  EventHandlerBase,
  EventHandlerBaseDto,
} from "../events/base.event-handler";
import {
  EventHandlerDictionary,
  PublishJobDto,
} from "../functions/sqs/__dtos__/handlers.dto";

export class MockPublishEventHandler
  implements EventHandlerBase<PublishJobDto>
{
  handler = jest.fn(
    async (_event: EventHandlerBaseDto<PublishJobDto>): Promise<void> => {}
  );
}

//deve ser o ultimo item exportado
export const mockEvenstDictionary: EventHandlerDictionary = {
  event_publish_job: new MockPublishEventHandler(),
};
