export function setTopicFilter(topics: string[]) {
    useTopicFilter().value = topics;
}

export function addTopic(topic: string): void {
    useTopicFilter().value.push(topic);
}

export function removeTopic(topic: string): void {
    const topicFilter = useTopicFilter();
    topicFilter.value.splice(topicFilter.value.indexOf(topic), 1);
}

export function addOrRemoveTopic(topic: string): void {
    const topicFilter = useTopicFilter();
    if (topicFilter.value.includes(topic)) {
        removeTopic(topic);
    } else {
        addTopic(topic);
    }
}

export const useTopicFilter = () => {
    return useState<string[]>("topicFilter", () => []);
};
