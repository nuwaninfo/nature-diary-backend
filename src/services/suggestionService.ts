import { AppDataSource } from "../database/data-source.js";
import { Suggestion } from "../entities/Suggestion.js";
import { User } from "../entities/User.js";
import { Observation } from "../entities/Observation.js";

export class SuggestionService {
  private suggestionRepository = AppDataSource.getRepository(Suggestion);
  private userRepository = AppDataSource.getRepository(User);
  private observationRepository = AppDataSource.getRepository(Observation);

  async addSuggestion(userId: number, observationId: number, name: string) {
    const user = await this.userRepository.findOne({ 
        where: { id: userId },
        select: ["id", "firstName", "lastName"] 
    });
    
    if (!user) {
      throw new Error("User not found");
    }

    const observation = await this.observationRepository.findOne({
      where: { id: observationId },
      select: ["id"] 
    });

    if (!observation) {
      throw new Error("Observation not found");
    }

    const suggestion = new Suggestion();
    suggestion.suggested_name = name; 
    suggestion.user = user;
    suggestion.observation = observation;

    return await this.suggestionRepository.save(suggestion);
  }
  async acceptSuggestion(userId: number, suggestionId: number) {
  const suggestion = await this.suggestionRepository.findOne({
    where: { id: suggestionId },
    relations: ["observation", "observation.user"], 
  });

  if (!suggestion) {
    throw new Error("Suggestion not found");
  }

  const observation = suggestion.observation;

  if (observation.user.id !== userId) {
    throw new Error("Unauthorized: Only the observation owner can accept suggestions");
  }

  observation.common_name = suggestion.suggested_name;
  observation.identified = true;

  return await this.observationRepository.save(observation);
}
 async getSuggestionsByObservation(observationId: number) {
  return await this.suggestionRepository.find({
    where: { observation: { id: observationId } },
    relations: ["user"], 
    select: {
      user: {
        id: true,
        firstName: true, 
        lastName: true
      }
    },
    order: { date: "DESC" }
  });
}
}