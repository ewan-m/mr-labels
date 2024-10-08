import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useStore = () => {
  return useQuery({
    queryKey: ["store"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.jsonbin.io/v3/b/670545adad19ca34f8b4ec77",
        {
          headers: {
            "X-Access-Key": `$2a$10$cf6zpEBYGanhPmQWJTfbMOb2Nv6TFz.GwZUGUne7CQpNXcK/d14aW`,
            "content-type": "application/json",
          },
        },
      );

      return (await res.json()) as {
        record: Record<string, Record<string, string>>;
      };
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, Record<string, string>>) => {
      await fetch("https://api.jsonbin.io/v3/b/670545adad19ca34f8b4ec77", {
        headers: {
          "X-Access-Key": `$2a$10$cf6zpEBYGanhPmQWJTfbMOb2Nv6TFz.GwZUGUne7CQpNXcK/d14aW`,
          "content-type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
  });
};
