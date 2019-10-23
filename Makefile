IMAGE_ID := docker.pkg.github.com/techulus/chrome-headless-docker/stable

test:
	true

image:
	docker build -t $(IMAGE_ID):$(TRAVIS_COMMIT) .

push-image:
	docker push $(IMAGE_ID)


.PHONY: image push-image test