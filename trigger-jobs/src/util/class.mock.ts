import {
  EventHandlerBase,
  EventHandlerBaseDto,
} from "../infrastructure/events/base.event-handler";
import {
  EventHandlerDictionary,
  PublishJobDto,
} from "../functions/sqs/dtos/handlers.dto";

export class MockPublishEventHandler
  implements EventHandlerBase<PublishJobDto>
{
  handler = jest.fn(
    async (event: EventHandlerBaseDto<PublishJobDto>): Promise<void> => {}
  );
}

//deve ser o ultimo item exportado
export const mockEvenstDictionary: EventHandlerDictionary = {
  publish_job: new MockPublishEventHandler(),
};
