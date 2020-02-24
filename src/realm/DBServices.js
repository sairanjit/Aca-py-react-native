import Realm from 'realm';

const AgentDetails = new Realm({
    schema: [
        {
            name: 'AgentDetails',
            properties: {
                agentUrl: 'string'
            },
        },
    ],
});

const DBServices = {
    saveInfo(data) {
        console.log(data);
        AgentDetails.write(() => {
            AgentDetails.create(
                'AgentDetails', data, true
            );
        });
    },

    fetchAgentDB() {
        const query = AgentDetails.objects('AgentDetails');
        const array = Array.from(query);
        return array;
    },
};

export default DBServices;